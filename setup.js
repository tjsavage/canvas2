var program = require('commander');
var fs = require('fs');
var path = require('path');
var client = require('scp2');
var Client = require('scp2').Client;
var node_ssh = require('node-ssh');
var path = require('path');

var ping = require('ping');

program
  .option('-c, --config <filepath>', 'The file path of the system-system.json')

var systemConfig = require('./lib/system-config');

program
  .command('devices')
  .action(function() {
    var devices = systemConfig.devices;

    var pingPromises = []
    var pingedDevices = [];

    for (var key in devices) {
      var device = devices[key];
      if (!device.host) {
        console.log("%s: no host provided", key);
        continue;
      }

      var isAlivePromise = pingDevice(device.host);

      pingPromises.push(isAlivePromise);
      pingedDevices.push(key);
    }

    Promise.all(pingPromises).then(function(results) {
      for (var i = 0; i < results.length; i++) {
        console.log("%s: %s", pingedDevices[i], results[i] ? "connected" : "can't reach");
      }
    });
  });

program
  .command('deploy <device>')
  .action(function(device) {
    console.log('Deploying system config to %s', device);

    var devices = systemConfig.devices;
    var deviceConfig = systemConfig.devices[device];

    if (!deviceConfig.homeDir) {
      console.error("No homeDir specified in device config - exiting.");
      process.exit(1);
    }
    if (!deviceConfig.username) {
      console.error("No username specified in device config - exiting.");
      process.exit(1);
    }
    if (!deviceConfig.password) {
      console.error("No password specified in device config - exiting.");
      process.exit(1);
    }

    var devicePromise = deploySystemConfigToDevice(systemConfig, deviceConfig);
    devicePromise.then(function() {
      console.log("Finished");
      process.exit(0);
    }, function(err) {
      console.log("Exited with error:", err);
      process.exit(1);
    });
  })

program
  .command('setup <device>')
  .action(function(device) {
    var deviceKey = device;
    var devices = systemConfig.devices;

    var deviceConfig = devices[deviceKey];
    console.log("Setting up", deviceKey);

    if (!deviceConfig.homeDir) {
      console.error("No homeDir specified in device config - exiting.");
      process.exit(1);
    }
    if (!deviceConfig.username) {
      console.error("No username specified in device config - exiting.");
      process.exit(1);
    }
    if (!deviceConfig.password) {
      console.error("No password specified in device config - exiting.");
      process.exit(1);
    }

    var devicePromise = setupDevice(deviceConfig);
    devicePromise.then(function() {
      console.log("Finished");
      process.exit(0);
    }, function(err) {
      console.log("Exited with error:", err);
      process.exit(1);
    });
  })

program.parse(process.argv);

function pingDevice(host) {
  return new Promise(function(resolve, reject) {
    ping.sys.probe(host, function(isAlive) {
      resolve(isAlive);
    })
  })
}

function setupDevice(deviceConfig) {
  ssh = new node_ssh();

  return new Promise(function(resolve, reject) {
    client.scp(path.resolve(__dirname, 'setupDevice.sh'), {
      port: 22,
      host: deviceConfig.host,
      username: deviceConfig.username,
      password: deviceConfig.password,
      path: deviceConfig.homeDir
    }, function(err) {
      if (err) reject(err);
      resolve();
    });
  }).then(function() {
    console.log("Successfully copied setup script to device.");
    return ssh.connect({
      host: deviceConfig.host,
      port: 22,
      username: deviceConfig.username,
      password: deviceConfig.password
    }).then(function() {
      console.log("Successfully connected");
    }, function(err) {
      console.log("Error connecting to execute script:", err);
    });
  }).then(function() {
    console.log("Executing setup script.")
    return ssh.execCommand('bash ' + deviceConfig.homeDir + '/setupDevice.sh', {
      cwd: deviceConfig.homeDir,
      stream: 'both'
    }).then(function(result) {
      console.log("STDOUT:", result.stdout);
      console.log("STDERR:", result.stderr);
      console.log("Finished executing script.")
    }, function(err) {
      console.log("Error executing script:", err);
    })
  });
}


function deploySystemConfigToDevice(systemConfig, deviceConfig) {
  var ssh = new node_ssh();

  return new Promise(function(resolve, reject) {
    var client = new Client({
      port: 22,
      host: deviceConfig.host,
      username: deviceConfig.username,
      password: deviceConfig.password
    });

    client.write({
      destination: deviceConfig.homeDir + '/system-config.json',
      content: new Buffer(JSON.stringify(systemConfig.configObj, null, 2), 'utf-8')
    }, function(err) {
      if (err) reject(err);
      console.log("Finished uploading system config");
      resolve();
    });
  }).then(function() {
    return ssh.connect({
      host: deviceConfig.host,
      port: 22,
      username: deviceConfig.username,
      password: deviceConfig.password
    }).then(function() {
      console.log("Successfully connected");
    }, function(err) {
      console.log("Error connecting to execute script:", err);
    });
  }, function(err) {
    console.log("Error uploading podrc:", err);
    throw err;
  }).then(function(){
    console.log("Attempting to restart pod");
    return ssh.execCommand('source ~/.bashrc; pod web && pod stopall && pod startall', {
        cwd: deviceConfig.homeDir,
        stream: 'both'
    }).then(function(result) {
      console.log("STDOUT:", result.stdout);
      console.log("STDERR:", result.stderr);
    }, function(err) {
      console.log("Error executing pod:", err);
    })
  });
}
