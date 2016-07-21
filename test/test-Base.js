var expect = require('expect.js');
var os = require('os');

var TEST_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDPGwxkb135cJuBbncCv21t2jofkIn4mH8",
  authDomain: "canvas2-test.firebaseapp.com",
  databaseURL: "https://canvas2-test.firebaseio.com",
  storageBucket: ""
};

var firebase = require('firebase');



describe('Base', function() {
  var Base;

  beforeEach(function() {
    Base = require('../apps/Base');
  });

  describe('#constructor', function() {
    it('should set the config property based with what is passed to the constructor', function() {
      var instance = new Base({appId: "appId"});

      expect(instance.config.appId).to.equal("appId");
    });

    it('should throw an error if appId is not set', function() {
      expect(function() {
        var instance = new Base({foo: "bar"});
      }).to.throwException(/appId/);
    })
  });

  describe('instance', function() {
    var instance;
    var client;
    var app;
    var database;
    var rootRef;
    var testCallback;

    beforeEach(function() {
      instance = new Base({foo: "bar", appId: "appId"})
      firebase.initializeApp(TEST_FIREBASE_CONFIG);
      database = app.database();
      rootRef = database.ref('/');
    });

    afterEach(function() {
      database.ref("/").set({});
      rootRef.off('value', testCallback);
    })

    describe('#connect', function() {
      it('should throw if not passed a valid firebase database', function() {
        expect(function() {
          instance.connect({});
        }).to.throwException(/firebase/);
      });

      it('should successfully connect to a valid firebase database', function() {
        expect(instance.connect(database)).to.be.true;
      });

      it('should successfully update the system data in the database upon connecting', function(done) {
        rootRef.on('value', function(snapshot){
          console.log(snapshot.val());
          expect(snapshot.val().system.appId.hostname).to.equal(os.hostname());
          expect(snapshot.val().system.appId.lastConnected).to.not.be.null;
          done();
        });

        instance.connect(database);
      })
    });

    describe('#log', function() {
      it('should log a basic message', function(done) {
        instance.connect(database);
      })
    })

  })
})
