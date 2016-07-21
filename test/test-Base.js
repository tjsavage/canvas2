var expect = require('expect.js');
var FirebaseTestHelper = require('./FirebaseTestHelper');

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

  describe('#connect', function() {
    var instance;
    var fbTestHelper;
    var client;

    beforeEach(function() {
      instance = new Base({foo: "bar", appId: "appId"})
      fbTestHelper = new FirebaseTestHelper();
    });

    afterEach(function() {
      fbTestHelper.destroy();
    })
    /*
    it('should throw if not passed a valid firebase database', function() {
      expect(function() {
        instance.connect({});
      }).to.throwException(/firebase/);
    });
    */
    it('should successfully connect to a valid firebase database', function() {
      expect(instance.connect(fbTestHelper.app.database())).to.be.true;
    });
  })

})
