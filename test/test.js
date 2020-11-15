'use strict';

// Controllers
import p5Controller from '../assets/js/controller/p5Controller.js';
import connectionController from '../assets/js/controller/connectionController.js';
import componentController from '../assets/js/controller/componentController.js';
import networkController from '../assets/js/controller/networkController.js';
import panelController from '../assets/js/controller/panelController.js';
import saveLoadController from '../assets/js/controller/saveLoadController.js';


// Collections
import allComponents from '../assets/js/collections/allComponents.js';
import allSubnets from '../assets/js/collections/allSubnets.js';

// Models
import Connection from '../assets/js/models/connection.js';
import Interface from '../assets/js/models/Interface.js';
import allConnections from '../assets/js/collections/allConnections.js';
import Graph from '../assets/js/models/graph.js';


var assert = chai.assert;
var expect = chai.expect;

var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised);
var should = chai.should();

p5Controller.createNewCanvas();


// describe lets you comment on what this block of code is for.
describe('component functions', () => {

  before('setup of some components', async function () {
    var pc = await componentController.createNewComponent('PC')
    var netswitch = await componentController.createNewComponent('Switch')
    var router = await componentController.createNewComponent('Router')

    // ADDS IT TO ARRAY OF ALL components
    allComponents.add(pc);
    allComponents.add(netswitch);
    allComponents.add(router);

    // Adds component to graph
    Graph.getInstance().addNode(pc.id);
    Graph.getInstance().addNode(netswitch.id);
    Graph.getInstance().addNode(router.id);

  });

  let connection1 = new Connection(1, "Twisted_Pair", "Cable");
  let connection2 = new Connection(2, "Fibre", "Cable");


  it('test if comps exist in collection', async () => {
    const comps = allComponents.getAll();
    comps.should.have.length(3);
  });

  it('test if default comp values have been loaded', async () => {
    var defaultPC = await componentController.createNewComponent('PC')

    let promise = new Promise((resolve, reject) => {
      p5Controller.getCanvas().loadXML(`/assets/components/${'pc'}.xml`, (xml) => {
          resolve(xml);
      });
    });

    let data = await promise;

    let type = data.getChild('type').getContent();
    let image = data.getChild('image').getString('path');
    
    let validLinkingComps = [];
    for (let getValidLinkingComp of data.getChild("validLinkingComponents").getChildren()) {
        validLinkingComps.push(getValidLinkingComp.getContent());
    }

    expect(defaultPC.type).to.equal(type);
    expect(defaultPC.imgPath).to.equal(image);
    expect(defaultPC.validLinkingComponents).to.eql(validLinkingComps);
    expect(defaultPC).to.have.property('_interfaces').with.lengthOf(1);

    defaultPC._interfaces.forEach(i => {
      expect(i).to.be.an.instanceof(Interface);
    });
  });


  // it() lets you comment on what an individual test is about.
  it('Checking if a valid connection component returns true', async () => {
    
    var pc = allComponents.getAll().find(c => c.name == "PC" )
    
    let valid = pc.checkValidLinkingComponent(connection1);
    // expect is the actual test.  This test checks if the var is a string.
    expect(valid).to.equal(true);
  });

  it('Checking if a invalid connection component returns false', async () => {
    
    var pc = allComponents.getAll().find(c => c.name == "PC" )

    let valid = pc.checkValidLinkingComponent(connection2);
    // expect is the actual test.  This test checks if the var is a string.
    expect(valid).to.equal(false);
  });

    
});

// FIRST SETS OF TESTS FOR NETWORKING FUNCTIONS

describe('networking calculation functions', function() {
  this.timeout(20000);
  var hosts;
  var subnets;
  var subnetmask;
  var supernetmask;



  before('setup of some components', async function () {
    allComponents.clear();
    allConnections.clear();
    allSubnets.getInstance().clear();

    console.log("First Network Test");

    // Must be same number of PCs and Routers
    var devices = ['PC', 'Switch', 'Router', 'Router', 'Smartphone', 'Cloud', 
                   'Laptop', 'Printer', 'Server', 'PC', 'Switch', 'Switch', 
                   'Router', 'Laptop', 'Laptop', 'PC']



    await componentController.createNewComponentFromArray(devices);

    await setupNetwork();

    networkController.calculateAllNetworkProperties();


  });

  // it() lets you comment on what an individual test is about.
  it('Test #1 for calculating number of hosts', async () => {
    hosts = networkController.calculateAllHost();
    expect(hosts).to.equal(9);
  });

  it('Test #1 for calculating number of subnets', async () => {
    subnets = networkController.calculateAllSubnets();
    expect(subnets).to.equal(5);
  });

  it('Test #1 for calculating subnetmask', async () => {
    subnetmask = networkController.calculateSubnetMask();
    expect(subnetmask).to.equal('255.255.255.248');
  });
 
  it('Test #1 for calculating supernetmask', async () => {
    supernetmask = networkController.calculateSupernetMask(subnets);
    expect(supernetmask).to.equal('255.255.255.240');
  });

  it('Test #1 for calculating max number of IP addresses', async () => {
    var max_number_hosts = networkController.calculateTotalIPAddresses(subnetmask);
    expect(max_number_hosts).to.equal(6);
  });

  it('Test #1 for calculating max number of subnets', async () => {
    var max_number_subnets = networkController.calculateTotalNumberSubnets(supernetmask);
    expect(max_number_subnets).to.equal(14);
  });

  it('Test slash value to decimal conversion function', async () => {
    var slashvalue_to_decimal = networkController.calculateDecimalFromSlashValue("26");
    expect(slashvalue_to_decimal).to.equal("255.255.255.192");
  });

  it('Test binary to decimal conversion function', async () => {
    var IP_in_decimal = networkController.binaryToDecimal("00001111.10100111.11111111.10000000");
    expect(IP_in_decimal).to.equal("15.167.255.128");
  });

  it('Test decimal to binary conversion function', async () => {
    var IP_in_binary = networkController.decimalToBinary("15.167.255.128");
    expect(IP_in_binary).to.equal("00001111.10100111.11111111.10000000");
  });

  it('Test #1 function for calculating subnetID', async () => {
    var subnetID = networkController.calculateSubnetID("192.168.1.6", "255.255.255.248");
    expect(subnetID).to.equal("192.168.1.0");
  });

  it('Test #2 function for calculating subnetID', async () => {
    var subnetID = networkController.calculateSubnetID("192.168.1.150", "255.255.255.240");
    expect(subnetID).to.equal("192.168.1.144");
  });


  it('Testing function for validating entered IP address', async () => {
    var list_of_PCs = allComponents.getAll().filter(c => c.name === 'PC');

    var component = list_of_PCs[1];
    var list_connection = allConnections.getConnectionsRelatedToComp(component);
    var connection = list_connection[0];
    componentController.setSelectedComponent(component);

    console.log(allConnections.getAll());
    console.log("Connection", connection);

    panelController.getInstance().updatePanelWithData(componentController.getSelectedComponent());

    var subnet = allSubnets.getInstance().getWithConnectionID(connection.id);
    subnet.subnetID = "192.168.1.0";
    subnet.gatewayRouterIP.push("192.168.1.1");
    console.log("Subnets", allSubnets.getInstance().getAll());
    
    $('#IP_address_field_0').html('192.168.1.');
    var e = jQuery.Event("keypress");
    e.which = 53; // # 53 == "5"
    e.keyCode = 53;
    e.data;
    $("#IP_address_field_0").trigger(e);

    expect(subnet.unavailableAddresses).to.include("192.168.1.5");
    expect(connection._interfacePorts[1][0].portIPaddress).to.include("192.168.1.5");
  });
  

  it('Test valid IP address function', async () => {
    var subnet = allSubnets.getInstance().get(0);
    subnet.subnetID = "192.168.1.0";
    var is_valid = networkController.checkAvailableIPAddress(subnet, "192.168.1.2");
    expect(is_valid).to.equal(true);
  });

  
  describe('Save / Load functions', () => {
    // before('setup of some components', async function () {
  
    // });
    it('test saving project to JSON', async () => {
      // await saveLoadController.saveEventToFile();
    });
    it('test loading project from JSON', async () => {
  
    });
  });
  
  
  // SECOND SETS OF TESTS FOR NETWORKING FUNCTIONS

  describe('Overriding setup network', function() {
    var hosts;
    var subnets;
    var subnetmask;
    var supernetmask;


    before('setup of some components', async function () {
      allComponents.clear();
      allConnections.clear();
      allSubnets.getInstance().clear();

      console.log("Second Network Test");

      // Must be same number of PCs and Routers
      var devices = [
                     'Laptop', 'Printer', 'Server', 'Switch',
                     'Router', 'Router', 'Router', 'Router',
                     'Router', 'Router', 'Router', 'Router', 
                     'Laptop', 'Laptop', 'Laptop', 'Laptop',
                     'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 
                     'PC'
                    ]
  
      await componentController.createNewComponentFromArray(devices);
  
      await setupNetwork();

    });

    it('Test #2 for calculating number of hosts', async () => {
      hosts = networkController.calculateAllHost();
      expect(hosts).to.equal(15);
    });
  
    it('Test #2 for calculating number of subnets', async () => {
      subnets = networkController.calculateAllSubnets();
      expect(subnets).to.equal(15);
    });
    it('Test #2 for calculating subnetmask', async () => {
      subnetmask = networkController.calculateSubnetMask();
      expect(subnetmask).to.equal('255.255.255.240');
    });
    it('Test #2 for calculating supernetmask', async () => {
      supernetmask = networkController.calculateSupernetMask(subnets);
      expect(supernetmask).to.equal('255.255.255.224');
    });
    it('Test #2 for calculating max number of IP addresses', async () => {
      var max_number_hosts = networkController.calculateTotalIPAddresses(subnetmask);
      expect(max_number_hosts).to.equal(14);
    });
  
    it('Test #2 for calculating max number of subnets', async () => {
      var max_number_subnets = networkController.calculateTotalNumberSubnets(supernetmask);
      expect(max_number_subnets).to.equal(30);
    });
  });

  // after('draw network',function () {
  //   app.draw = () => {
  //     connectionController.drawAllConnections();
  //     componentController.displayAllComponents();
  //   }
  // });
});

async function setupNetwork() {
  var list_of_routers = allComponents.getAll().filter(c => c.name === 'Router');
  var list_of_PCs = allComponents.getAll().filter(c => c.name === 'PC');

  var netswitch = allComponents.getAll().find(c => c.name === 'Switch');

  // Creates a connection between all routers
  for (let r in list_of_routers) {
    if (r != list_of_routers.length-1) {
      var con = await connectionController.createNewConnection("twisted_pair");
      
      let num = parseInt(r);
      var num2 = num+1;


      var interfaceValues1 = list_of_routers[num].getInterfaceFromString(`Fast_Ethernet 1`);
      var interfaceValues2 = list_of_routers[num2].getInterfaceFromString("Fast_Ethernet 0");

      // var intface1 = list_of_routers[r].getInterface(0);
      // var intface2 = list_of_routers[r++].getInterface(0);
      con.addComponent(list_of_routers[num]);
      con.addComponent(list_of_routers[num2]);
      con.addInterfacePort(interfaceValues1);
      con.addInterfacePort(interfaceValues2);
      // con._interfaces = [[intface1, 0], [intface2, 0]];

      // get the interface.
      var inter1 = interfaceValues1[0];
      // get the port of that interface.
      var port1 = interfaceValues1[1];
      // port is now in use and cannot be selected.
      inter1.portInUse(port1);

      // get the interface.
      var inter2 = interfaceValues2[0];
      // get the port of that interface.
      var port2 = interfaceValues2[1];
      // port is now in use and cannot be selected.
      inter2.portInUse(port2);
       
      // Creating new Edge on graph
      Graph.getInstance().addEdge(
        list_of_routers[num].id, 
        list_of_routers[num2].id
      );

      allConnections.add(con);
    }
  }

  // Router_1  -> Switch_1
  var connection1 = await connectionController.createNewConnection("twisted_pair");
  var interfaceValues1 = list_of_routers[0].getInterfaceFromString(`Fast_Ethernet 0`);
  var interfaceValues2 = netswitch.getInterfaceFromString("Fast_Ethernet 0");
  connection1.addComponent(list_of_routers[0]);
  connection1.addComponent(netswitch);
  connection1.addInterfacePort(interfaceValues1);
  connection1.addInterfacePort(interfaceValues2);

  // get the interface.
  var inter1 = interfaceValues1[0];
  // get the port of that interface.
  var port1 = interfaceValues1[1];
  // port is now in use and cannot be selected.
  inter1.portInUse(port1);

  // get the interface.
  var inter2 = interfaceValues2[0];
  // get the port of that interface.
  var port2 = interfaceValues2[1];
  // port is now in use and cannot be selected.
  inter2.portInUse(port2);
  
  // Creating new Edge on graph
  Graph.getInstance().addEdge(
    list_of_routers[0].id, 
    netswitch.id
  );
  allConnections.add(connection1);

  // Create a subnet between each router and pc execpt first router
  for (let i in list_of_routers) {
    if (i != 0) {
      var con = await connectionController.createNewConnection("twisted_pair");
      // con._components = [list_of_routers[i], list_of_PCs[i]];

      var interfaceValues1 = list_of_routers[i].getInterfaceFromString(`Fast_Ethernet 3`);
      var interfaceValues2 = list_of_PCs[i].getInterfaceFromString("Fast_Ethernet 0");

      con.addComponent(list_of_routers[i]);
      con.addComponent(list_of_PCs[i]);
      con.addInterfacePort(interfaceValues1);
      con.addInterfacePort(interfaceValues2);

      // get the interface.
      var inter1 = interfaceValues1[0];
      // get the port of that interface.
      var port1 = interfaceValues1[1];
      // port is now in use and cannot be selected.
      inter1.portInUse(port1);

      // get the interface.
      var inter2 = interfaceValues2[0];
      // get the port of that interface.
      var port2 = interfaceValues2[1];
      // port is now in use and cannot be selected.
      inter2.portInUse(port2);

      // Creating new Edge on graph
      Graph.getInstance().addEdge(
        list_of_routers[i].id, 
        list_of_PCs[i].id
      );

      allConnections.add(con);
    }
  }

  var list_of_end_devices = allComponents
                                          .getAll().filter(c => 
                                                          c.name === 'Laptop' ||
                                                          c.name === 'Printer' ||
                                                          c.name === 'Server');

  for (let endDevice of list_of_end_devices) {
    var index = list_of_end_devices.indexOf(endDevice);
    // index = 0 is already taken by connection with router
    if (index == 0) index++;
    var con = await connectionController.createNewConnection("twisted_pair");

    // endDevice.getInterface(0).portInUse(0);
    // endDevice.getInterface(0).portIPaddress[0] = `192.168.1.${list_of_end_devices.indexOf(endDevice)+1}`;
    var interfaceValues1 = endDevice.getInterfaceFromString("Fast_Ethernet 0");
    var interfaceValues2 = netswitch.getInterfaceFromString(`Fast_Ethernet ${index}`);

    con.addComponent(endDevice);
    con.addComponent(netswitch);
    con.addInterfacePort(interfaceValues1);
    con.addInterfacePort(interfaceValues2);

    // get the interface.
    var inter1 = interfaceValues1[0];
    // get the port of that interface.
    var port1 = interfaceValues1[1];
    // port is now in use and cannot be selected.
    inter1.portInUse(port1);

    // get the interface.
    var inter2 = interfaceValues2[0];
    // get the port of that interface.
    var port2 = interfaceValues2[1];
    // port is now in use and cannot be selected.
    inter2.portInUse(port2);

    // Creating new Edge on graph
    Graph.getInstance().addEdge(
      netswitch.getID(), 
      endDevice.getID()
    );
    allConnections.add(con);
  }

  networkController.dispatchNetworkChangeEvent();
}