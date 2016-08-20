'use strict'

var AbstractHub = require('./AbstractHub');

var jsonfile = require('jsonfile');

/**
* The LocalHug class creates a hub that writes to the local filesystem
* and can be shared between multiple processes.
*/
class LocalHub extends AbstractHub {
  constructor(config) {
    config = Object.assign({
      filename: '/tmp/canvas2-localhub.json'
    });
    super(config);

    jsonfile.writeFileSync(this._config.filename, {});

    this.config = config;
    this.state = {};
    this.logs = {};
    this.errors = {};
    this.pings = {};
    this.heartbeats = {};
    this.connections = {};
  }

  updateLocalFile() {
    var self = this;
    return new Promise(function(resolve, reject) {
      jsonfile.readFile(self._config.filename, function(err, data) {
        if (err) reject(err);
        data.state = self.state;
        jsonfile.writeFile(self._config.filename, data, function(err) {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }

  readLocalFile() {
    var self = this;

    return new Promise(function(resolve, reject) {
      jsonfile.readFile(self._config.filename, function(err, data) {
        if (err) reject(err);
        resolve(data);
      })
    })
  }

  /**
  * @return Promise - returns a promise that resolves when the state has been set.
  */
  setState(appId, obj) {
    this.state[appId] = obj;
    return this.updateLocalFile();
  }

  getState(appId) {
    return this.readLocalFile().then(function(data) {
      return data.state[appId];
    });
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
    return this.updateLocalFile();
  }

  /**
  * @return Promise - returns a promise that resolves when the log has been sent.
  */
  log(appId, str) {
    this._lookupAndPush(appId, this.logs, str);
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the error log has been sent.
  */
  error(appId, string) {
    this._lookupAndPush(appId, this.logs, str);
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the heartbeat has been sent.
  */
  heartbeat(appId) {
    this._lookupAndPush(appId, this.heartbeats, (new Date()).toString());
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the ping has been sent.
  */
  ping(appId) {
    this._lookupAndPush(appId, this.pings, "ping");
    return Promise.resolve();
  }

  /**
  * @return Promise - returns a promise that resolves when the connection has been registered.
  */
  connect(appId) {
    this._lookupAndPush(appId, this.connections, "connect");
    return Promise.resolve();
  }

  _lookupAndPush(appId, dict, obj) {
    if (!(appId in dict)) {
      dict[appId] = [];
    }
    dict[appId].push(obj);
  }
}

module.exports = LocalHub;
