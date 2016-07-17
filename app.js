'use strict'

var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');

if (!argv.app) {
  console.error("No app argument provided. Exiting.");
  process.exit();
}

if (!argv.appId) {
  console.error("No appId argument provided. Exiting.");
  process.exit();
}

var App = require('./apps/' + argv.app);

var appConfig = constructAppConfig(argv.app, argv.appId);

var app = new App(appConfig);

function constructAppConfig(app, appId) {
  var config = {};

  var systemConfigFilepath = process.env.CANVAS2_SYSTEM_CONFIG || argv.systemConfig || path.resolve(__dirname, 'system-config.json');

  var systemConfig = JSON.parse(fs.readFileSync(systemConfigFilepath, 'UTF-8'));

  config['firebase'] = systemConfig.global.firebase;
  config['appId'] = appId;
  config['app'] = app;

  return config;
}
