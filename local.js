'use strict'

var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var os = require('os');
var firebase = require('firebase');

var hubs = require('./hubs');
var HubFactory = hubs.HubFactory;

var AppModule = require('./apps');

var localConfigFilePath = argv.localConfigFile || path.resolve(__dirname, 'local-config.json');
var localConfigFile = fs.readFileSync(localConfigFilePath, 'UTF-8');

if (!localConfigFile) {
  console.error("No local config found.");
  process.exit(1);
}

var localConfig = JSON.parse(localConfigFile);

var hubFactory = new HubFactory();

for (var i = 0; i < localConfig.hubs.length; i++) {
  hubFactory.getHubInstance(localConfig.hubs[i]);
}

var apps = localConfig.apps;

if (!apps || apps.length == 0 ) {
  console.error("No apps defined in local-config");
  process.exit(1);
}

for (var i = 0; i < apps.length; i++) {
  var appConfig = apps[i];

  var app = AppModule.startApp(appConfig);

  if ('hubId' in appConfig) {
    var hub = hubFactory.getHubInstanceById(appConfig.hubId);
    app.registerHub(hub);
  }

}
