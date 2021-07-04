const puppeteer = require('puppeteer');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");

'use strict';

chai.use(chaiAsPromised);

/* 
***************************************************
*                     NOTES                       *
***************************************************
*/
/*

❌ Passing arrow functions to Mocha is discouraged.

*/

// describe lets you comment on what this block of code is for.
describe('My app', () => {
  let browser;
  let page;

  describe('#1 Creation functions', function() {
    before(async function() {
      this.timeout(20000);
      // Launch Puppeteer and navigate to the Express server
      browser = await puppeteer.launch({ 
        headless: true,
        slowMo: 250,
        args: [`--window-size=1800,1200`], // new option
        defaultViewport: {
          width:1800,
          height:800
        }
      });
      page = await browser.newPage();
      await page.goto('http://localhost:5000/projects/newproject');


      /* 
      Create app enviroment to test networking related calculation functions.
      */
      // console.log("#1 networking calculation functions before")
    });

    it('test page loaded', async function() {
      this.timeout(20000);
      let content = await page.evaluate(() => document.getElementsByClassName('navbar-brand')[0].innerHTML);
      expect(content).to.include('Build Networks Online');
    });

    it('test creation of components and linking components', async function() {
      this.timeout(20000);
      let components = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        let device = await app.componentController.createNewComponent('PC')
        let tp_cable = await app.connectionController.createNewConnection('twisted-pair')
        /*
        Need to make a spesific connection json conversion function.
        */
        con_json = {
          "id": tp_cable.id,
          "name": tp_cable.name,
          "type": tp_cable.type,
        }
        return [device.prepareForJson(), con_json]
      })
      let pc = components[0]
      let tp_cable = components[1]
      expect(pc.name).to.equal("PC");
      expect(tp_cable.name).to.equal("twisted-pair");
    });
  });
  describe('#1 networking calculation functions', function() {
    var hosts;
    var subnets;
    var subnetmask;
    var supernetmask;

    before(async function() {
      this.timeout(60000); // A very long environment setup.
      await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]

        // reset test enviroment
        app.componentController.clear();
        app.connectionController.clear();
        app.allSubnets.getInstance().clear();

        // Must be same number of PCs and Routers
        var devices = ['PC', 'Switch', 'Router', 'Router', 'Smartphone', 'Cloud', 
        'Laptop', 'Printer', 'Server', 'PC', 'Switch', 'Switch', 
        'Router', 'Laptop', 'Laptop', 'PC']

        await app.componentController.createNewComponentFromArray(devices);

        // console.log("#1 networking calculation functions")

        await app.networkController.setupNetwork();
        app.networkController.calculateAllNetworkProperties();
      })
    });

    it('test dummy network has been created', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        // console.log(app.componentController.getAll())
        return {
          'length': app.componentController.getAll().length,
        }
      })
      expect(data.length).to.equal(16);
    });

    it('Test #1 for calculating number of hosts', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'hosts': app.networkController.calculateAllHost(),
        }
      })
      hosts = data.hosts
      expect(data.hosts).to.equal(9);
    });

    it('Test #1 for calculating number of subnets', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnets': app.networkController.calculateAllSubnets(),
        }
      })
      subnets = data.subnets
      expect(data.subnets).to.equal(5);
    });

    it('Test #1 for calculating subnetmask', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnetmask': app.networkController.calculateSubnetMask(),
        }
      })
      subnetmask = data.subnetmask
      expect(data.subnetmask).to.equal('255.255.255.248');
    });

    it('Test #1 for calculating supernetmask', async function() {
      let data = await page.evaluate(async (subnets) => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'supernetmask': app.networkController.calculateSupernetMask(subnets),
        }
      })
      supernetmask = data.supernetmask
      expect(data.supernetmask).to.equal('255.255.255.240');
    });

    it('Test #1 for calculating max number of IP addresses', async function() {
      let data = await page.evaluate(async (subnetmask) => {
        var app = $vue.$children[0].$children[1].$children[1]
        // console.log(subnetmask)
        return {
          'max_number_hosts': app.networkController.calculateTotalIPAddresses(subnetmask)
        }
      }, subnetmask)
      expect(data.max_number_hosts).to.equal(6);
    });

    it('Test #1 for calculating max number of subnets', async function() {
      let data = await page.evaluate(async (supernetmask) => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'max_number_subnets': app.networkController.calculateTotalNumberSubnets(supernetmask)
        }
      }, supernetmask)
      expect(data.max_number_subnets).to.equal(14);
    });

    it('Test slash value to decimal conversion function', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'slashvalue_to_decimal': app.networkController.calculateDecimalFromSlashValue("26")
        }
      })
      expect(data.slashvalue_to_decimal).to.equal("255.255.255.192");
    });

    it('Test binary to decimal conversion function', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'IP_in_decimal': app.networkController.binaryToDecimal("00001111.10100111.11111111.10000000")
        }
      })
      expect(data.IP_in_decimal).to.equal("15.167.255.128");
    });

    it('Test decimal to binary conversion function', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'IP_in_binary': app.networkController.decimalToBinary("15.167.255.128")
        }
      })
      expect(data.IP_in_binary).to.equal("00001111.10100111.11111111.10000000");
    });

    it('Test #1 function for calculating subnetID', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnetID': app.networkController.calculateSubnetID("192.168.1.6", "255.255.255.248")
        }
      })
      expect(data.subnetID).to.equal("192.168.1.0");
    });

    it('Test #2 function for calculating subnetID', async function() {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnetID': app.networkController.calculateSubnetID("192.168.1.150", "255.255.255.240")
        }
      })
      expect(data.subnetID).to.equal("192.168.1.144");
    });

    it('Testing function for validating entered IP address', async function() {
      this.timeout(20000);
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]

        var list_of_PCs = app.allComponents.getAll().filter(c => c.name === 'PC');
  
        var component = list_of_PCs[1];
        var list_connection = app.allConnections.getConnectionsRelatedToComp(component);
        var connection = list_connection[0];
        app.componentController.setSelectedComponent(component);
    
        app.panelController.getInstance().updatePanelWithData(app.componentController.getSelectedComponent())
           
        var subnet = app.allSubnets.getInstance().getWithConnectionID(connection.id);
        subnet.subnetID = "192.168.1.0";
        subnet.gatewayRouterIP.push("192.168.1.1");
        // console.log("Subnets", app.allSubnets.getInstance().getAll());

        return {
          'connection': connection.id,
        }
      })

      await page.type('#IP_address_field_0', '192.168.1.5');

      let result = await page.evaluate(async (data) => {
        var app = $vue.$children[0].$children[1].$children[1]
        var subnet = app.allSubnets.getInstance().getWithConnectionID(data.connection);
        var connection = app.allConnections.getAll().find(c => c.id == data.connection);
        return {
          'unavailableAddresses': subnet.unavailableAddresses,
          '_interfacePorts': connection._interfacePorts,
        }
      }, data)

      expect(result.unavailableAddresses).to.include("192.168.1.5");
      expect(result._interfacePorts[1][0].portIPaddress).to.include("192.168.1.5");
    });

    it('Test "checkAvailableIPAddress" function', async function() {

      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        var subnet = app.allSubnets.getInstance().get(0);
        subnet.subnetID = "192.168.1.0";
        var is_valid = app.networkController.checkAvailableIPAddress(subnet, "192.168.1.2");

        return {
          'is_valid': is_valid,
        }

      })
      expect(data.is_valid).to.equal(true);
    });

  });


  // SECOND SETS OF TESTS FOR NETWORKING FUNCTIONS
  describe('#2 networking calculation functions', function() {
    var hosts;
    var subnets;
    var subnetmask;
    var supernetmask;


    before('setup of some components', async function () {
      this.timeout(60000); // A very long environment setup.
      await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]

        // reset test enviroment
        app.componentController.clear();
        app.connectionController.clear();
        app.allSubnets.getInstance().clear();

        // Must be same number of PCs and Routers
        var devices = [
          'Laptop', 'Printer', 'Server', 'Switch',
          'Router', 'Router', 'Router', 'Router',
          'Router', 'Router', 'Router', 'Router', 
          'Laptop', 'Laptop', 'Laptop', 'Laptop',
          'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 
          'PC'
        ]

        await app.componentController.createNewComponentFromArray(devices);

        // console.log("#1 networking calculation functions")

        await app.networkController.setupNetwork();
        app.networkController.calculateAllNetworkProperties();
      })
    });

    it('Test #2 for calculating number of hosts', async () => {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'hosts': app.networkController.calculateAllHost(),
        }
      })
      hosts = data.hosts
      expect(hosts).to.equal(15);
    });

    it('Test #2 for calculating number of subnets', async () => {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnets': app.networkController.calculateAllSubnets(),
        }
      })
      subnets = data.subnets
      expect(subnets).to.equal(15);
    });
    it('Test #2 for calculating subnetmask', async () => {
      let data = await page.evaluate(async () => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'subnetmask': app.networkController.calculateSubnetMask(),
        }
      })
      subnetmask = data.subnetmask
      expect(subnetmask).to.equal('255.255.255.240');
    });
    it('Test #2 for calculating supernetmask', async () => {
      let data = await page.evaluate(async (subnets) => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'supernetmask': app.networkController.calculateSupernetMask(subnets),
        }
      })
      supernetmask = data.supernetmask
      expect(supernetmask).to.equal('255.255.255.224');
    });
    it('Test #2 for calculating max number of IP addresses', async () => {
      let data = await page.evaluate(async (subnetmask) => {
        var app = $vue.$children[0].$children[1].$children[1]
        // console.log(subnetmask)
        return {
          'max_number_hosts': app.networkController.calculateTotalIPAddresses(subnetmask)
        }
      }, subnetmask)
      expect(data.max_number_hosts).to.equal(14);
    });

    it('Test #2 for calculating max number of subnets', async () => {
      let data = await page.evaluate(async (supernetmask) => {
        var app = $vue.$children[0].$children[1].$children[1]
        return {
          'max_number_subnets': app.networkController.calculateTotalNumberSubnets(supernetmask)
        }
      }, supernetmask)
      expect(data.max_number_subnets).to.equal(30);
    });
  });
});