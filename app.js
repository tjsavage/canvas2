'use strict'

var argv = require('yargs').argv;
var randomstring = require('randomstring');

var apps = require('./apps');

var appName = argv._[0];
var config = argv.config;

if (config) {
  config = JSON.parse(config);
}

config = Object.assign({
  appId: 'defaultApp-' + randomstring.generate(4),
  verbose: true
}, config);

apps.startApp(appName, config);
