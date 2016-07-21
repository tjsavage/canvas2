'use strict'

var TEST_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDPGwxkb135cJuBbncCv21t2jofkIn4mH8",
  authDomain: "canvas2-test.firebaseapp.com",
  databaseURL: "https://canvas2-test.firebaseio.com",
  storageBucket: ""
};

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
      return this._app.delete().then(function() {
        return new Promise(function(resolve, reject) {
          this._server.close(resolve);
        })
      });
    }
  }

  /**
  * Initialize the firebase app using data from the server.
  * @returns the instance of the Firebase app.
  */
  initializeApp() {
    if (this._firebase || this._app) {
      throw new Error("FirebaseTestHelper app already initialized");
    }

    this._firebase = require('firebase');
    console.log(this.url);
    this._app = this._firebase.initializeApp({
      databaseUrl: this.url
    });
    console.log(this._firebase.databaseUrl);
    console.log(this._app);

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


}

module.exports = FirebaseTestHelper;
