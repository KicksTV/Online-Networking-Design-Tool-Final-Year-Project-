'use strict';

// Import the expect library.  This is what allows us to check our code.
// You can check out the full documentation at http://chaijs.com/api/bdd/
const expect = require('chai').expect;

// Create the variable you are going to test

// Controllers
const componentController = require('../assets/js/controller/componentController.js');

// Collections
const allComponents = require('../assets/js/collections/allComponents.js');

// Models
const Component = require('../assets/js/models/component.js');
const Connection = require('../assets/js/models/connection.js');


// describe lets you comment on what this block of code is for.
describe('testing methods for component', function() {
  let comp = new Component(1, "PC", "Device", "/assets/img/pc.svg", null);
  let connection1 = new Connection(1, "Twisted_Pair", "Cable");
  let connection2 = new Connection(2, "Fibre", "Cable");

    // it() lets you comment on what an individual test is about.
    it('Checking if a valid connection component returns true', function(done) {
      let valid = comp.checkValidLinkingComponent(connection1);
      // expect is the actual test.  This test checks if the var is a string.
      expect(valid).to.equal(true);
      // done tells the program the test is complete.
      done();
    });

    it('Checking if a invalid connection component returns false', function(done) {
      let valid = comp.checkValidLinkingComponent(connection2);
      // expect is the actual test.  This test checks if the var is a string.
      expect(valid).to.equal(false);
      // done tells the program the test is complete.
      done();
    });
});

describe('testing networking calculation functions', function() {

  // it() lets you comment on what an individual test is about.
  it('test calculating all hosts function', function(done) {

    componentController.getInstance().createNewComponent('PC')
    componentController.getInstance().createNewComponent('Switch')
    componentController.getInstance().createNewComponent('Router')


    let len = allComponents.getInstance().length();
    // expect is the actual test.  This test checks if the var is a string.
    expect(len).to.equal(3);
    // done tells the program the test is complete.
    done();
  });

  it('Checking if a invalid connection component returns false', function(done) {
    let valid = comp.checkValidLinkingComponent(connection2);
    // expect is the actual test.  This test checks if the var is a string.
    expect(valid).to.equal(false);
    // done tells the program the test is complete.
    done();
    });
});