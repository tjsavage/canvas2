'use strict'

var argv = require('yargs').argv;

var apps = require('./apps');

var appName = argv._[0];
var config = argv.config;

if (config) {
  config = JSON.parse(config);
} else {
  config = {
    appId: 'defaultApp'
  }
}

apps.startApp(appName, config);
