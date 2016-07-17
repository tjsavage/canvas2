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

### Installing Node

```
wget https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-armv6l.tar.xz
sudo mv node-v4.4.7-linux-armv6l.tar.gz /opt
cd /opt
sudo tar -xzf node-v4.4.7-linux-armv6l.tar.gz
sudo mv node-v4.4.7-linux-armv6l nodejs
sudo rm node-v4.4.7-linux-armv6l.tar.gz
sudo rm /usr/bin/node
sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm
```
