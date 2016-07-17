'use strict'

var Gpio = require('onoff').Gpio;

const Base = require('./Base.js');

let PIRSensor = class PIRSensor extends Base {
  constructor(config) {
    super(config);

    this._setupSensor();
  }

  _setupSensor() {
    this._gpioPin = this._config.appConfig.gpioPin;

    if (!this._gpioPin) {
      this.log("No GPIO pin number provided - exiting", "error");
      process.exit();
    }

    this._sensor = new Gpio(this._gpioPin, 'in', 'both');

    var self = this;
    this._sensor.read(function(err, value) {
      if (err) {
        self.log("Pin read error: " + err, "error");
      }

      self.state = {
        "value": value
      }

      self.log("Sensor state initialized: " + value);
    });

    this._sensor.watch(function(err, value) {
      if (err) {
        self.log("Pin read error: " + err, "error");
      }

      self.state = {
        "value": value
      }

      self.log("Sensor state changed: " + value);
    });
  }
}

module.exports = PIRSensor
