# canvas2

System for using raspberry pi's and other embeddable micro-pc's to manage a house.

Canvas2 relies heavily on [pod](https://github.com/yyx990803/pod) for deployment and [Firebase](https://console.firebase.google.com) for storing the state of the system.

The basics:

The **System** is made up of a number of different **Devices**. Each **Device** can run a number of different **Applications**. Each **Application** has a unique name. The **State** of each application is synced to a particular [**Firebase Database**](https://console.firebase.google.com), so that the state of the overall System is always reflected in the Firebase database.

Pieces of the canvas system:

- **Database** - the firebase database that reflects the state of the overall system.
- **Device** - each addressable device that the hub communicates with.
- **App** - each particular application that can run on a device. Each app is simply an command-line executable that runs on a device.

Important files:

`system-config.json` - the overall config file that describes the entire system.
`app.js` - the file that runs on a particular device, that boots up an app. Takes a command-line argument that is the name of the app to run, and any config arguments for that particular app.
`deploy.js` - the local command-line script to deploy the configurations to all the appropriate devices on the network.

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

Reboot.

1) Set up device

`my-device-name` corresponds to the key in your `system-config.json` file.

```
node devices.js --setupDevice=my-device-name
```

2) Deploy pod

```
node devices.js --deployDevice=my-device-name
```

3) For the remote apps on the device, set up github webhook.

- Go to https://github.com and your repo
- Go to Settings > Webhooks & services
- In "Payload URL" enter `http://MYROUTERIP:MYFORWARDEDPORT/hooks/my-app-name`
- In Content type enter "application/json"
- Don't enter a secret

?Deploy?
