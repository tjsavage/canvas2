'use strict'

var AbstractHub = require('./AbstractHub');

/**
* The MockHub class mocks a hub.
*/
class MemoryHub extends AbstractHub {
  constructor(config) {
    super(config);

    this.config = config;
    this.state = {};
    this.logs = {};
    this.errors = {};
    this.pings = {};
    this.heartbeats = {};
    this.connections = {};
  }

  /**
  * @return Promise - returns a promise that resolves when the state has been set.
  */
  setState(appId, obj) {
    this.state[appId] = obj;
    if(this._config.verbose) {
      console.log("Set state:", this.state);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the state has been updated.
  */
  updateState(appId, obj) {
    if (appId in this.state) {
      this.state[appId] = Object.assign(this.state[appId], obj);
    } else {
      this.state[appId] = obj;
    }
    if(this._config.verbose) {
      console.log("Updated state:", this.state);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the log has been sent.
  */
  log(appId, str) {
    this._lookupAndPush(appId, this.logs, str);
    if(this._config.verbose) {
      console.log("Logged:", appId, str);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the error log has been sent.
  */
  error(appId, string) {
    this._lookupAndPush(appId, this.logs, str);
    if(this._config.verbose) {
      console.log("Errored:", appId, str);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the heartbeat has been sent.
  */
  heartbeat(appId) {
    this._lookupAndPush(appId, this.heartbeats, (new Date()).toString());
    if(this._config.verbose) {
      console.log("Heartbeat:", appId);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the ping has been sent.
  */
  ping(appId) {
    this._lookupAndPush(appId, this.pings, "ping");
    if(this._config.verbose) {
      console.log("Pinged:", appId);
    }
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the connection has been registered.
  */
  connect(appId) {
    this._lookupAndPush(appId, this.connections, "connect");
    if(this._config.verbose) {
      console.log("Connected:", appId);
    }
    return Promise.resolve();
  }

  _lookupAndPush(appId, dict, obj) {
    if (!(appId in dict)) {
      dict[appId] = [];
    }
    dict[appId].push(obj);
  }
}

module.exports = MemoryHub;
