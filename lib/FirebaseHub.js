'use strict'

var firebase = require('firebase');
var os = require('os');

var AbstractHub = require('./AbstractHub');

class FirebaseHub extends AbstractHub {
  constructor(options) {
    super(options);

    var firebaseDb = options.firebaseDb;

    if (!firebaseDb.ref) {
      throw new Error("Invalid firebase databased passed into FirebaseHub constructor");
    };

    this._firebaseEnabled = true;

    this._db = firebaseDb;
    this._stateRef = this._db.ref('state');
    this._logRef = this._db.ref('log');
    this._systemRef = this._db.ref('system');

    this._systemRef.update({
      lastConnected: this.timestamp(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces()
    });
  }

  setState(appId, obj) {
    var ref = this._stateRef.child(appId);
    return ref.set(obj);
  }

  updateState(appId, obj) {
    var ref = this._stateRef.child(appId);
    return ref.update(obj);
  }

  log(appId, string) {
    var ref = this._logRef.child(appId);
    var pushedRef = ref.push();
    return pushedRef.set({
      message: string,
      sent: this.timestamp(),
      type: "info"
    });
  }

  error(appId, string) {
    var ref = this._logRef.child(appId);
    var pushedRef = ref.push();
    return pushedRef.set({
      message: string,
      sent: this.timestamp(),
      type: "error"
    });
  }

  connect(appId) {
    var ref = this._systemRef.child(appId);
    return ref.update({
      lastConnected: this.timestamp(),
      hostname: os.hostname(),
      networkInterfaces: os.networkInterfaces()
    });
  }

  heartbeat(appId) {
    var ref = this._systemRef.child(appId);
    return ref.update({
      lastHeartbeat: this.timestamp()
    });
  }

  ping(appId) {
    var ref = this._systemRef.child(appId);
    return ref.update({
      lastPing: this.timestamp()
    });
  }

  timestamp() {
    return (new Date()).toString();
  }

}

module.exports = FirebaseHub;
