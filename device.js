'use strict'

var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var os = require('os');
var firebase = require('firebase');

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

var apps = deviceConfig.apps;

if (!apps || apps.length == 0 ) {
  console.error("No apps defined in system-config for hostname:", hostname);
  process.exit(1);
}

firebase.initializeApp(systemConfig.global.firebase);
var firebaseDatabase = firebase.database();

for (var i = 0; i < deviceConfig.apps.length; i++) {
  var appConfig = apps[i];
  var finalConfig = constructFinalConfig(systemConfig, appConfig);

  var App = require('./apps/' + appConfig.app);
  var app = new App(finalConfig);
  app.connect(firebaseDatabase);
}
