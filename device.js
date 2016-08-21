'use strict'

var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var os = require('os');

var hubs = require('./hubs');
var HubFactory = hubs.HubFactory;

var AppModule = require('./apps');

var systemConfigFilePath = argv.systemConfigFile || path.resolve(process.env['HOME'], 'system-config.json');
var systemConfigFile = fs.readFileSync(systemConfigFilePath, 'UTF-8');

if (!systemConfigFile) {
  console.error("No device config found. Make sure to deploy a device config to this device by running: `node devices.js --deployConfig=$HOSTNAME`")
  process.exit(1);
}

var systemConfig = JSON.parse(systemConfigFile);

var hostname = argv.device || os.hostname();

var deviceConfig = systemConfig.devices[hostname];

if (!deviceConfig) {
  console.error("No device config found for hostname:", hostname);
  process.exit(1);
}

// Set up the hubs

if (!apps || apps.length == 0 ) {
  console.error("No apps defined in system-config for hostname:", hostname);
  process.exit(1);
}

var hubFactory = new HubFactory();

for (var i = 0; i < systemConfig.hubs.length; i++) {
  hubFactory.getHubInstance(systemConfig.hubs[i]);
}

// Start the apps

var apps = deviceConfig.apps;

if (!apps || apps.length == 0 ) {
  console.error("No apps defined in local-config");
  process.exit(0);
}

for (var i = 0; i < apps.length; i++) {
  var appConfig = apps[i];

  var app = AppModule.startApp(appConfig);

  if ('hubId' in appConfig) {
    var hub = hubFactory.getHubInstanceById(appConfig.hubId);
    app.registerHub(hub);
  }
}
