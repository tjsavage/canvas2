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

Edit `/etc/dhcpcd.conf` to add the following lines:

```
interface eth0 #Or wlan0 if wifi
static ip_address=10.0.1.51/24
static routers=10.0.1.1
static domain_name_servers=10.0.1.1
```

Set up your wifi router to assign this static IP to the device's HW address.

Set up your wifi router to connect an external port to the internal POD web service port on your device: 19999

Set up the devices hostname (very important! Hostname is used as a key in system-config.json to read everything about the device.):

- `sudo vim /etc/hosts` and replace `127.0.1.1 raspberrypi` with `127.0.0.1 MYHOSTNAME`
- `sudo vim /etc/hostname` and replace the contents with MYHOSTNAME
- run `sudo /etc/init.d/hostname.sh`
- run `sudo reboot`

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
