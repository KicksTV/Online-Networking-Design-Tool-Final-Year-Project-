'use strict';

// Controllers
import connectionController from '../assets/js/controller/connectionController.js';
import componentController from '../assets/js/controller/componentController.js';
import networkController from '../assets/js/controller/networkController.js';

// Collections
import allComponents from '../assets/js/collections/allComponents.js';

// Models
import Connection from '../assets/js/models/connection.js';
import Interface from '../assets/js/models/Interface.js';
import allConnections from '../assets/js/collections/allConnections.js';
import Graph from '../assets/js/models/graph.js';


var assert = chai.assert;
var expect = chai.expect;

var p5 = require('p5')

var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised);
var should = chai.should();


window.app = new p5(function(p5) {
  p5.preload = function() {
  }
  p5.setup = function() {
    var canvas = p5.createCanvas((p5.windowWidth-20), p5.windowHeight);
    canvas.parent("canvasDiv");
  }
  p5.draw = function() {
  }
});



// describe lets you comment on what this block of code is for.
describe('component functions', () => {

  before('setup of some components', async function () {
    var pc = await componentController.getInstance().createNewComponent('PC')
    var netswitch = await componentController.getInstance().createNewComponent('Switch')
    var router = await componentController.getInstance().createNewComponent('Router')

    // ADDS IT TO ARRAY OF ALL components
    allComponents.getInstance().add(pc);
    allComponents.getInstance().add(netswitch);
    allComponents.getInstance().add(router);

    // Adds component to graph
    Graph.getInstance().addNode(pc.id);
    Graph.getInstance().addNode(netswitch.id);
    Graph.getInstance().addNode(router.id);

  });

  let connection1 = new Connection(1, "Twisted_Pair", "Cable");
  let connection2 = new Connection(2, "Fibre", "Cable");


  it('test if comps exist in collection', async () => {
    const comps = allComponents.getInstance().getAll();
    comps.should.have.length(3);
  });

  it('test if default comp values have been loaded', async () => {
    var defaultPC = await componentController.getInstance().createNewComponent('PC')

    let promise = new Promise((resolve, reject) => {
      app.loadXML(`/assets/components/${'pc'}.xml`, (xml) => {
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
    
    var pc = allComponents.getInstance().getAll().find(c => c.name == "PC" )
    
    let valid = pc.checkValidLinkingComponent(connection1);
    // expect is the actual test.  This test checks if the var is a string.
    expect(valid).to.equal(true);
  });

  it('Checking if a invalid connection component returns false', async () => {
    
    var pc = allComponents.getInstance().getAll().find(c => c.name == "PC" )

    let valid = pc.checkValidLinkingComponent(connection2);
    // expect is the actual test.  This test checks if the var is a string.
    expect(valid).to.equal(false);
  });

    
});

describe('networking calculation functions', function() {
  this.timeout(20000);
  var hosts;
  var subnets;

  before('setup of some components', async function () {
    allComponents.getInstance().clear();
    allConnections.getInstance().clear();
    // Must be same number of PCs and Routers
    var devices = ['PC', 'Switch', 'Router', 'Router', 'Smartphone', 'Cloud', 
                   'Laptop', 'Printer', 'Server', 'PC', 'Switch', 'Switch', 
                   'Router', 'Laptop', 'Laptop', 'PC']

    await componentController.getInstance().createNewComponentFromArray(devices);

    await setupNetwork();
  });

  // it() lets you comment on what an individual test is about.
  it('Test #1 for calculating number of hosts', async () => {
    hosts = networkController.getInstance().calculateAllHost();
    expect(hosts).to.equal(9);
  });

  it('Test #1 for calculating number of subnets', async () => {
    subnets = networkController.getInstance().calculateAllSubnets();
    expect(subnets).to.equal(5);
  });

  it('Test #1 for calculating subnetmask', async () => {
    var subnetmask = networkController.getInstance().calculateSubnetMask();
    expect(subnetmask).to.equal('255.255.255.248');
  });
  it('Test #1 for calculating supernetmask', async () => {
    var supernetmask = networkController.getInstance().calculateSupernetMask(subnets);
    expect(supernetmask).to.equal('255.255.255.240');
  });





  describe('Overriding setup network', function() {
    var hosts;
    var subnets;

    before('setup of some components', async function () {
      allComponents.getInstance().clear();
      allConnections.getInstance().clear();

      // Must be same number of PCs and Routers
      var devices = ['Laptop', 'Printer', 'Server', 'Switch',
                     'Router', 'Router', 'Router', 'Router',
                     'Router', 'Router', 'Router', 'Router', 
                     'Laptop', 'Laptop', 'Laptop', 'Laptop',
                     'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC'
                    ]
  
      await componentController.getInstance().createNewComponentFromArray(devices);
  
      await setupNetwork();

    });

    it('Test #2 for calculating number of hosts', async () => {
      hosts = networkController.getInstance().calculateAllHost();
      expect(hosts).to.equal(15);
    });
  
    it('Test #2 for calculating number of subnets', async () => {
      subnets = networkController.getInstance().calculateAllSubnets();
      expect(subnets).to.equal(15);
    });
    it('Test #2 for calculating subnetmask', async () => {
      var subnetmask = networkController.getInstance().calculateSubnetMask();
      expect(subnetmask).to.equal('255.255.255.240');
    });
    it('Test #2 for calculating supernetmask', async () => {
      var supernetmask = networkController.getInstance().calculateSupernetMask(subnets);
      expect(supernetmask).to.equal('255.255.255.224');
    });
  });
});

async function setupNetwork() {
  var list_of_routers = allComponents.getInstance().getAll().filter(c => c.name === 'Router');
  var list_of_PCs = allComponents.getInstance().getAll().filter(c => c.name === 'PC');

  var netswitch = allComponents.getInstance().getAll().find(c => c.name === 'Switch');

  // Creates a connection between all routers
  for (let r in list_of_routers) {
    if (r != list_of_routers.length-1) {
      var con = await connectionController.getInstance().createNewConnection("twisted_pair");
      con._components = [list_of_routers[r], list_of_routers[r++]];
      
      // Creating new Edge on graph
      Graph.getInstance().addEdge(
        list_of_routers[r].getID(), 
        list_of_routers[r++].getID()
      );

      allConnections.getInstance().add(con);
    }
  }

  // Router_1  -> Switch_1
  var connection1 = await connectionController.getInstance().createNewConnection("twisted_pair");
  connection1._components = [list_of_routers[0], netswitch];
  allConnections.getInstance().add(connection1);

  // Create a subnet for each router
  for (let i in list_of_routers) {
    if (i != 0) {
      var con = await connectionController.getInstance().createNewConnection("twisted_pair");
      con._components = [list_of_routers[i], list_of_PCs[i]];
      console.log(list_of_PCs[i]);
      // Creating new Edge on graph
      Graph.getInstance().addEdge(
        list_of_routers[i].getID(), 
        list_of_PCs[i].getID()
      );

      allConnections.getInstance().add(con);
    }
  }

  var list_of_end_devices = allComponents.getInstance()
                                          .getAll().filter(c => 
                                                          c.name === 'Laptop' ||
                                                          c.name === 'Printer' ||
                                                          c.name === 'Server');

  for (let endDevice of list_of_end_devices) {
    var con = await connectionController.getInstance().createNewConnection("twisted_pair");

    endDevice.getInterface(0).portInUse(0);
    // endDevice.getInterface(0).portIPaddress[0] = `192.168.1.${list_of_end_devices.indexOf(endDevice)+1}`;
    con._components = [netswitch, endDevice];
    // Creating new Edge on graph
    Graph.getInstance().addEdge(
      netswitch.getID(), 
      endDevice.getID()
    );
    allConnections.getInstance().add(con);
  }
}