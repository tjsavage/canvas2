'use strict'

var firebase = require('firebase');
var os = require('os');

class Base {
  constructor(config) {
    this._config = config;

    setInterval(this.heartbeat.bind(this), 60000);
  }

  connect(firebaseDb) {
    this._db = firebaseDb;
    this._stateRef = this._db.ref('state/' + this._config.appId);
    this._logRef = this._db.ref('log/' + this._config.appId);
    this._systemRef = this._db.ref('system/' + this._config.appId);

    this._systemRef.update({
      lastConnected: new Date(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces()
    });
  }

  set state(obj) {
    this._stateRef.set(obj);
    this.ping();
  }

  /*
  * Log a message to firebase.
  * @param {string} str - The message to log
  * @param {string} type - The type of message 'info', 'error', 'warning'. Defaults to 'info'.
  */
  log(str, type) {
    var newLogRef = this._logRef.push();

    newLogRef.set({
      message: str,
      time: new Date(),
      type: type || "info"
    });
  }

  /*
  * Ping the system/ reference whenever I sent an update
  */
  ping() {
    this._systemRef.update({
      lastPing: new Date()
    });
  }

  /*
  * Heartbeat to let the system know I'm Alive
  */
  heartbeat() {
    this._systemRef.update({
      lastHeartbeat: new Date()
    })
  }

}

module.exports = Base;
