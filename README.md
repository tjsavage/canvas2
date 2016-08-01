# canvas2

System for using raspberry pi's and other embeddable micro-pc's to manage a house.

Canvas2 relies heavily on [pod](https://github.com/yyx990803/pod) for deployment and [Firebase](https://console.firebase.google.com) for storing the state of the system.

The basics:

The **System** is made up of a number of different **Devices**. Each **Device** can run a number of different **Applications**. Each **Application** has a unique name. The **State** of each application is synced to a particular [**Firebase Database**](https://console.firebase.google.com), so that the state of the overall System is always reflected in the Firebase database.

On each device, `pod` just handles running a single instance of canvas2's `device.js`. This looks at a

Pieces of the canvas system:

- **Database** - the firebase database that reflects the state of the overall system.
- **Device** - each addressable device that the hub communicates with.
- **App** - each particular application that can run on a device. Each app is simply an command-line executable that runs on a device.

Important files:

**In the repo**

`system-config.json` - the overall config file that describes the entire system.
`app.js` - the file that runs on a particular device, that boots up an app. Takes a command-line argument that is the name of the app to run, and any config arguments for that particular app.
`deploy.js` - the local command-line script to deploy the configurations to all the appropriate devices on the network.

**On each device**

`.podrc` - The pod configuration, which should be the same for all devices.
`pod/` - Contains the repo and app for pod.
`system-config.json` - The system config that is copied to the device.

## Apps

All apps

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


# Getting Started

## Setting up the Raspberry Pi

0) Set up static IP

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

Set up your wifi router to connect an external port to the internal POD web service port on your device: 19999

Set up the device's hostname and timezone via: `sudo raspi-config`

Reboot.


1) Set up device

`my-device-name` corresponds to the key in your `system-config.json` file.

```
node devices.js --setupDevice=my-device-name
```

2) Set up Pod on the device.

Pod should already be installed on step 1.

SSH into the device.

Set up POD for the first time:

`pod`

path: ~/pod

Edit the ~/.podrc file to get a little more specific:

```
{
    // where pod puts all the stuff
    "root": "/srv",

    // default env
    "node_env": "development",

    // this can be overwritten in each app's package.json's "main" field
    // or in the app's configuration below using the "script" field
    "default_script": "app.js",

    // minimum uptime to be considered stable,
    // in milliseconds. If not set, all restarts
    // are considered unstable.
    "min_uptime": 3600000,

    // max times of unstable restarts allowed
    // before the app is auto stopped.
    "max_restarts": 10

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
        "example1": {

            // passed to the app as process.env.NODE_ENV
            // if not set, will inherit from global settings
            "node_env": "production",

            // passed to the app as process.env.PORT
            // if not set, pod will try to parse from app's
            // main file (for displaying only), but not
            // guarunteed to be correct.
            "port": 8080,

            // pod will look for this script before checking
            // in package.json of the app.
            "script": "dist/server.js",

            // *** any valid pm2 config here gets passed to pm2. ***

            // spin up 2 instances using cluster module
            "instances": 2,

            // pass in additional command line args to the app
            "args": "['--toto=heya coco', '-d', '1']",

            // file paths for stdout, stderr logs and pid.
            // will be in ~/.pm2/ if not specified
            "error_file": "/absolute/path/to/stderr.log",
            "out_file": "/absolute/path/to/stdout.log"
        },
        "example2": {
            // you can override global settings
            "min_uptime": 1000,
            "max_restarts": 200
        },
        "my-remote-app": {
            "remote": "yyx990803/my-remote-app", // github shorthand
            "branch": "test" // if not specified, defaults to master
        }
    },

    // pass environment variables to all apps
    "env": {
        "SERVER_NAME": "Commodore",
        "CERT_DIR": "/path/to/certs"
    }
}
```

Set up pod to start automatically:

```
# /etc/init/pod.conf
start on (local-filesystems and net-device-up IFACE!=lo)
exec sudo -u <username> /path/to/node /path/to/pod startall
```

Install canvas2 as a pod app:

`pod remote canvas2 tjsavage/canvas2`

Start pod web service:

`pod web`

Start pod app:

`pod start canvas2`

3) For the remote apps on the device, set up github webhook.

- Go to https://github.com and your repo
- Go to Settings > Webhooks & services
- In "Payload URL" enter `http://MYROUTERIP:MYFORWARDEDPORT/hooks/canvas2`
- In Content type enter "application/json"
- Don't enter a secret

- IMPORTANT: Add the ssh key of the device to Github: https://help.github.com/articles/generating-an-ssh-key/

?Deploy?

## Troubleshooting

### Webhooks not getting delivered from Github?

Make sure `pod web` service is running.

SSH into the machine and run `pod web`.
