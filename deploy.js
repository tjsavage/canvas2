var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');

var ping = require('ping');

var systemConfigFilepath = process.env.CANVAS2_SYSTEM_CONFIG || argv.systemConfig || path.resolve(__dirname, 'system-config.json');

var systemConfig = JSON.parse(fs.readFileSync(systemConfigFilepath, 'UTF-8'));

if (argv.devices) {
  //Just try to connect to the devices and report status
  var devices = systemConfig.devices;
  for (var key in devices) {
    var device = devices[key];
    process.stdout.write(key + "...");
    ping.sys.probe(devices[key].ip, function(isAlive) {
      process.stdout.write(isAlive ? "Alive" : "Can't reach");
      process.stdout.write("\n");
    })
  }

}
