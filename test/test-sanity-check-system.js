var chai = require('chai');

var expect = chai.expect;

var os = require('os');

describe('system-config', function() {
  before(function() {
    var systemConfigFilepath = process.env.CANVAS2_SYSTEM_CONFIG;
  })
