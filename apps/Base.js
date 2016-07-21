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

    setInterval(this.heartbeat.bind(this), 60000);
  }

  connect(firebaseDb) {
    this._firebaseEnabled = true;

    this._db = firebaseDb;
    this._stateRef = this._db.ref('state/' + this._config.appId);
    this._logRef = this._db.ref('log/' + this._config.appId);
    this._systemRef = this._db.ref('system/' + this._config.appId);

    this._systemRef.update({
      lastConnected: new Date(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces()
    });

    return false;
  }

  _setFirebaseRef(ref, data) {
    if (this._firebaseEnabled) {
      ref.set(data);
    }
  }

  _pushFirebaseRef(ref, data) {
    if (this._firebaseEnabled) {
      var pushedRef = ref.push();
      pushedRef.set(data);
    }
  }

  _updateFirebaseRef(ref, data) {
    if (this._firebaseEnabled) {
      ref.update(data);
    }
  }

  /*
  * Log a message to firebase.
  * @param {string} str - The message to log
  * @param {string} type - The type of message 'info', 'error', 'warning'. Defaults to 'info'.
  */
  log(str, type) {
    this._pushFirebaseRef(this._logRef, {
      "message": str,
      "sent": (new Date()).toString(),
      "type": type || "info"
    });
  }

  /*
  * Ping the system/ reference whenever I sent an update
  */
  ping() {
    this._updateFirebaseRef(this._systemRef, {
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

  set state(obj) {
    var newState = Object.assign({}, obj);

    newState["lastUpdated"] = (new Date()).toString();
    this._setFirebaseRef(this._stateRef, newState);
    this.ping();
  }

  get config() {
    return this._config;
  }
}

module.exports = Base;
