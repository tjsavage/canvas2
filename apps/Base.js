'use strict'

var firebase = require('firebase');

class Base {
  constructor(config) {
    console.log(config);
    this._config = config;

    firebase.initializeApp(this._config.firebase);
    this._connect();
  }

  _connect() {
    this._db = firebase.database();
    this._stateRef = this._db.ref('state/' + this._config.appId);
  }

  set state(obj) {
    console.log('setting state', obj);
    this._stateRef.set(obj);
  }
}

module.exports = Base;
