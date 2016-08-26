'use strict'

var program = require('commander');
var fs = require('fs');
var path = require('path');
var os = require('os');

var hubs = require('./hubs');
var HubFactory = hubs.HubFactory;

var AppModule = require('./apps');

program
  .option('-c, --config [filepath]', 'Path to the system-config.json file')
  .option('-d, --device [device]', 'Name of the device to use in the config. Defaults to hostname.')
  .option('-v, --verbose', 'Set all applications to log verbosely')
  .parse(process.argv);


var systemConfig = require('./lib/system-config');

var deviceName = program.device || os.hostname();

var deviceConfig = systemConfig.devices[deviceName];

if (!deviceConfig) {
  console.error("No device config found for hostname:", deviceName);
  process.exit(1);
}

// Set up the hubs

var hubFactory = new HubFactory();

for (var i = 0; i < systemConfig.hubs.length; i++) {
  hubFactory.getHubInstance(systemConfig.hubs[i]);
}

// Start the apps

var apps = deviceConfig.apps;

if (!apps || apps.length == 0 ) {
  console.error("No apps defined in config for device:", deviceName);
  process.exit(0);
}

for (var i = 0; i < apps.length; i++) {
  var appConfig = apps[i];

  if (program.verbose) {
    appConfig.verbose = true;
  }

  var app = AppModule.startApp(appConfig);

  if ('hubId' in appConfig) {
    var hub = hubFactory.getHubInstanceById(appConfig.hubId);
    app.registerHub(hub);
  }
}
