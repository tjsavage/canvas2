'use strict'

var Gpio = require('onoff').Gpio;

const Base = require('./Base.js');

let PIRSensor = class Clock extends Base {
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

    this.sensor.watch(function(err, value) {
      if (err) {
        this.log("Pin read error: " + err, "error");
      }

      this.state = {
        value: value
      }

      this.log("Sensor state changed: ", value);
    });
  }
}

module.exports = PIRSensor
