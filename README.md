# canvas2

System for using raspberry pi's and other embeddable micro-pc's to manage a house. It also can support managing programs on virtual hosts .

Canvas2 relies heavily on [pod](https://github.com/yyx990803/pod) for deployment. The central datastore for system state is meant to be pluggable, but the system is initially designed to use [Firebase](https://console.firebase.google.com) for storing the state of the system.

The basics:

The **System** is made up of a number of different **Devices**. Each **Device** can run a number of different **Apps**. Each **App** has a unique name - `appId`. The **State** of each application is synced to a particular **Hub**, so that the state of the overall System is always reflected in the Hub.

On each device, `pod` just handles running a single instance of canvas2's `device.js`.

Pieces of the canvas system:

## Important files

### In the repo

`system-config.json` - the overall config file that describes the entire system. This is copied to every device.

`device.js` - the file that runs on a particular device, that boots up all the apps the device is responsible for running. Takes command-line arguments for where to look for the system config, and what device this is being run on.

`setup.js` - the local command-line script to deploy the configurations to all the appropriate devices on the network.

`setupDevice.sh` - the script that gets copied to and run on each new device to set it up.

### On each device

`.podrc` - The pod configuration, which should be the same for all devices.

`pod/` - Contains the repo and app for pod.

`system-config.json` - The system config that is copied to the device.

`.pm2/logs/*` - Pod uses `pm2` under the hood to run, so logs for the instances are stored here.


## Firebase Database

The rough schema for the firebase database will be:

```
{
  "system": {

  },
  "state": {

  },
  "logs": {

  }
}
```

# Getting Started

## Setting up device

### 0. Set up the device

Some basic setup to get going.

#### Setting up a Debian Machine (non-Raspberry Pi)

Follow: https://www.digitalocean.com/community/tutorials/initial-server-setup-with-debian-8 to set up the machine.


### 1. Set up static IP (Raspberry Pi Only)

See: http://raspberrypi.stackexchange.com/questions/37920/how-do-i-set-up-networking-wifi-static-ip

Edit `/etc/wpa_supplicant/wpa_supplicant.conf` to the following:

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="ESSID"
    psk="Your_wifi_password"
}
```

Edit `/etc/dhcpcd.conf` to add the following lines:

```
interface eth0 #Or wlan0 if wifi
static ip_address=10.0.1.51/24
static routers=10.0.1.1
static domain_name_servers=10.0.1.1
```

Set up your wifi router to assign this static IP to the device's HW address.

Set up your wifi router to connect an external port to the internal POD web service port on your device: 19999. For device with IP 10.0.1.XX, I forward external port XX99 to 10.0.1.XX:19999.

Set up the device's hostname and timezone via: `sudo raspi-config`

Reboot.

### 2. Add the device to your `system-config.json` file

Your `system-config.json` file should look something like:

```
{
  "hubs": [...],
  "devices": {
    "new-device-hostname": {
      "host": "10.0.1.51",
      "username": "pi",
      "password": "raspberry",
      "homeDir": "/home/pi",
      "apps": [...]
    }
  }
}
```

### 3. Set up device

`my-device-name` corresponds to the key in your `system-config.json` file.

```
node setup.js setup my-device-name
```

### 4. Set up Pod on the device.

Pod should already be installed on step 3.

SSH into the device.

Set up POD for the first time:

`pod`

path: ~/pod

Edit the ~/.podrc file to get a little more specific:

```
{
    // where pod puts all the stuff. Use pi or other appropriate
    // home directory
    "root": "/home/pi/pod",

    // default env
    "node_env": "production",

    // this can be overwritten in each app's package.json's "main" field
    // or in the app's configuration below using the "script" field
    "default_script": "device.js",

    // minimum uptime to be considered stable,
    // in milliseconds. If not set, all restarts
    // are considered unstable.
    "min_uptime": 3600000,

    // max times of unstable restarts allowed
    // before the app is auto stopped.
    "max_restarts": 10,

    // config for the web interface
    "web": {
        // set these! default is admin/admin
        "username": "admin",
        "password": "admin",
        "port": 19999,
        // allow jsonp for web interface, defaults to false
        "jsonp": true
    },

    "apps": {
    },
}
```

Set up pod to start automatically:

```
# /etc/init/pod.conf
start on (local-filesystems and net-device-up IFACE!=lo)
exec sudo -u <username> /home/pi/.node-install/bin/node /home/pi/.npm-packages/bin/pod startall
```

Make sure that the `.bashrc` file will run on non-interactive shell sessions. Look for lines in the `~/.bashrc` file along the lines of "If not running interactively, don't do anything" and comment them out.

Install canvas2 as a pod app:

`pod remote canvas2 tjsavage/canvas2`

This should now have canvas2 repository installed in ~/pod/apps

### 5. Deploy the system config to the new device

Go back to your development machine.

Run `node setup.js deploy my-device`, replacing `my-device` with the name of your new device.


### 6. Set up github webhook

IMPORTANT: Add the ssh key of the device to Github: https://help.github.com/articles/generating-an-ssh-key/

Go to https://github.com and your repo

Go to Settings > Webhooks & services

In "Payload URL" enter `http://MYROUTERIP:MYFORWARDEDPORT/hooks/canvas2`

In Content type enter "application/json"

Don't enter a secret

### 7. Start the app

SSH back into the new device.

Start pod web service:

`pod web`

Start pod app:

`pod start canvas2`


## Troubleshooting

### Webhooks not getting delivered from Github?

Make sure `pod web` service is running.

SSH into the machine and run `pod web`.

### Getting error when deploying like "bash: pod: command not found"?

Make sure that the `.bashrc` file will execute on non-interactive shell sessions.

Look for lines in the `~/.bashrc` file along the lines of "If not running interactively, don't do anything" and comment them out.

## Todo

- [] Fix images on rpi
- [] make pixabay-img truly responsive with offsetHeight/width
- [] Make background a random image with https://unsplash.it/200/300/?random
- [] Add tweets block
- [] UI Inspiration: https://dribbble.com/shots/1332769-Panels-Dashboard/attachments/188298
