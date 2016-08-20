var argv = require('yargs').argv;
var fs = require('fs');
var path = require('path');
var client = require('scp2');
var Client = require('scp2').Client;
var node_ssh = require('node-ssh');
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
    ping.sys.probe(devices[key].host, function(isAlive) {
      process.stdout.write(isAlive ? "Alive" : "Can't reach");
      process.stdout.write("\n");
    })
  }
}

/*
if (argv.deployAll) {
  //Deploy to all devices
  var devices = systemConfig.devices;
  var devicePromises = [];

  for (var key in devices) {
    var deviceConfig = devices[key];
    console.log("Initializing", key);

    var devicePromise = deployPodToDevice(deviceConfig);

    devicePromises.push(devicePromise);
  }

  Promise.all(devicePromises).then(function() {
    console.log("All devices deployed");
    process.exit(0);
  }).catch(function(err){console.log(err)})
}
*/

if (argv.deployConfig) {
  //Deploys the system-config to a single device.
  var deviceKey = argv.deployConfig;
  var devices = systemConfig.devices;
  var deviceConfig = systemConfig.devices[deviceKey];

  console.log("Deploying system config to", deviceKey);

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

}

if (argv.setupDevice) {
  //Set up a devices from scratch
  var deviceKey = argv.setupDevice;
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
      content: new Buffer(JSON.stringify(systemConfig, null, 2), 'utf-8')
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
    return ssh.execCommand('source ~/.bashrc && cat ~/.bashrc && pod web && pod restartall', {
      cwd: deviceConfig.homeDir,
      stream: 'both'
    }).then(function(result) {
      console.log("STDOUT:", result.stdout);
      console.log("STDERR:", result.stderr);
      console.log("Successfully executed pod.")
    }, function(err) {
      console.log("Error executing pod:", err);
    })
  });
}
