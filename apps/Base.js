'use strict'

var firebase = require('firebase');
var os = require('os');

class Base {
  /**
  * @constructor
  * @param {object} config - A configuration object. Should at least have a property
  *   for `appId`, which is the unique identifier for the instance and all of its
  *   reporting.
  */
  constructor(config) {
    if (!config) {
      throw new Error("Missing a configuration object in constructor.");
    }
    if (!config.appId) {
      throw new Error("No appId set in the configuration.");
    }

    this._config = config;
    this._state = {};

    setInterval(this.heartbeat.bind(this), 60000);
  }

  registerHub(hubInstance) {
    this.hub = hubInstance;
    return this.connect();
  }

  setState(obj) {
    this._state = obj;
    if (this.hub) {
      return this.hub.setState(this._config.appId, obj);
    }
    return Promise.resolve();
  }

  updateState(obj) {
    this._state = Object.assign(this._state, obj);
    if (this.hub) {
      return this.hub.updateState(this._config.appId, obj);
    }
    return Promise.resolve();
  }

  log(str) {
    if (this._config.verbose || !this.hub) {
      console.log(this._config.appId, str);
    }
    if (this.hub) {
      return this.hub.log(this._config.appId, str);
    }
    return Promise.resolve();
  }

  error(str) {
    if (this._config.verbose || !this.hub) {
      console.error(this._config.appId, str);
    }
    if (this.hub) {
      return this.hub.error(this._config.appId, str);
    }
    return Promise.resolve();
  }

  heartbeat() {
    if (this._config.verbose || !this.hub) {
      console.log(this._config.appId, "heartbeat");
    }
    if (this.hub) {
      return this.hub.heartbeat(this._config.appId);
    }
    return Promise.resolve();
  }

  ping() {
    if (this._config.verbose || !this.hub) {
      console.log(this._config.appId, "ping")
    }
    if (this.hub) {
      return this.hub.ping(this._config.appId);
    }
    return Promise.resolve();
  }

  connect() {
    if (this._config.verbose || !this.hub) {
      console.log(this._config.appId, "connect");
    }
    if (this.hub) {
      return this.hub.connect(this._config.appId);
    }
    return Promise.resolve();
  }

  get config() {
    return this._config;
  }

  get state() {
    return this._state;
  }
}

module.exports = Base;
