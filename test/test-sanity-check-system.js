var chai = require('chai');

var expect = chai.expect;

var os = require('os');
var systemConfig = require('../lib/system-config')

var apps = require('../apps');

describe('sanity check system-config', function() {
  it('should be able to find the config', function() {
    expect(systemConfig.hubs).to.not.be.null;
    expect(systemConfig.devices).to.not.be.null;
  });

  it('should be able to start every app in the config', function() {
    var devices = systemConfig.devices;
    var excluded = ["PIRSensor"];

    Object.keys(devices).forEach(function(deviceId) {
      var device = devices[deviceId];
      device.apps.forEach(function(app) {
        if (excluded.indexOf(app.app) == -1) {
          apps.startApp(app);
        }
      });
    });
  });
});
