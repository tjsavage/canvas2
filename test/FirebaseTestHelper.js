'use strict'

/*
var TEST_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDPGwxkb135cJuBbncCv21t2jofkIn4mH8",
  authDomain: "canvas2-test.firebaseapp.com",
  databaseURL: "https://canvas2-test.firebaseio.com",
  storageBucket: ""
};

var firebase = require('firebase');


firebase.initializeApp(TEST_FIREBASE_CONFIG);
*/
class FirebaseTestHelper {
  /**
  * A test helper to use in testing things that use firebase.
  * @constructor
  */
  constructor() {
    this.initializeApp();
  }

  /**
  * Cleanup the app and server.
  * @returns {Promise} a promise that resolves when this is done.
  */
  destroy() {
    if (this._firebase) {
      //return this.wipe();
    }
  }

  wipe() {
    this._database.ref('/').set(null);
  }

  /**
  * Returns a promise for the data at ref in the firebase database
  */
  get(ref) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self._database.ref('system').on("value", function(data) {
        console.log(data.val());
        resolve(data.val());
      })
    });

  }

  /**
  * Initialize the firebase app using data from the server.
  * @returns the instance of the Firebase app.
  */
  initializeApp() {
    this._database = firebase.database();
    //this._database.goOffline();

    return this._app;
  }

  /**
  * @returns {object} Returns the local firebase app
  */
  get firebase() {
    return this._firebase;
  }

  get serverName() {
    return this._serverName;
  }

  get serverPort() {
    return this._serverPort;
  }

  get url() {
    return 'https://' + this.serverName + ':' + this.serverPort;
  }

  get app() {
    return this._app;
  }

  get database() {
    return this._database;
  }


}

module.exports = FirebaseTestHelper;
