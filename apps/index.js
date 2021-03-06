'use strict'

var APP_MODULE_PATHS = {
  'Base': './Base',
  'Clock': './Clock',
  'MuniMonitor': './MuniMonitor',
  'PIRSensor': './PIRSensor',
  'RestBus': './RestBus',
  'SecuritySystem': './SecuritySystem',
  'SmartThingsWebHooks': './SmartThingsWebHooks',
  'TTS': './TTS',
  'TwitterUserStream': './TwitterUserStream',
  'Weather': './Weather'
}

module.exports = {
  startApp: function(appConfig) {
    if (!appConfig) {
      throw new Error("No appConfig provided. Did you not list any apps?");
    }
    if (!appConfig.app) {
      throw new Error("No appName provided in app config");
    }
    var appName = appConfig.app;
    if (!(appName in APP_MODULE_PATHS)) {
      throw new Error('App ' + appName + ' not in app modules');
    }

    var App = require(APP_MODULE_PATHS[appName]);

    return new App(appConfig);
  }
}
