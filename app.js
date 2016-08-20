'use strict'

var argv = require('yargs').argv;
var randomstring = require('randomstring');

var apps = require('./apps');
var hubs = require('./hubs');
var HubFactory = hubs.HubFactory;

var appName = argv._[0];
var config = argv.config;
var localHub = argv.localHub;

if (config) {
  config = JSON.parse(config);
}

if (localHub) {
  var factory = new HubFactory();
  var hub = factory.getHubInstance({'hubId': 'a', 'hubClass': 'LocalHub'});
}

config = Object.assign({
  appId: 'defaultApp-' + randomstring.generate(4),
  verbose: true
}, config);

var app = apps.startApp(appName, config);

if (hub) {
  app.registerHub(hub);
}
