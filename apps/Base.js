'use strict'

var firebase = require('firebase');

class Base {
  constructor(config) {
    this._config = config;

    firebase.initializeApp(this._config.firebase);
    this._connect();
  }

  _connect() {
    this._db = firebase.database();
    this._stateRef = this._db.ref('state/' + this._config.appId);
    this._logRef = this._db.ref('log/' + this._config.appId);
  }

  set state(obj) {
    this._stateRef.set(obj);
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
      timestamp: (new Date()).toString(),
      type: type || "info"
    });

   }
}

module.exports = Base;
