var Config = {};

Config.constructFinalConfig = function(systemConfig, appConfig) {
  var config = {};

  config['firebase'] = systemConfig.global.firebase;
  config['appId'] = appConfig.appId;
  config['app'] = appConfig.app;
  config['appConfig'] = appConfig;

  return config;
}

module.exports = Config;
