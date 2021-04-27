const puppeteer = require('puppeteer');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();
var chaiAsPromised = require("chai-as-promised")

'use strict';

chai.use(chaiAsPromised);

// describe lets you comment on what this block of code is for.
describe('component functions', () => {

  before('setup of some components', async function () {

  });


  it('test if comps exist in collection', async () => {
    expect(1).to.equal(1);
  });

  });