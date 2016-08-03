var expect = require('chai').expect;
var os = require('os');

var MockHub = require('./MockHub');

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
      }).to.throw(/appId/);
    })
  });

  describe('instance without a hub', function() {
    var instance;

    beforeEach(function() {
      instance = new Base({appId: "appId"});
    });

    it("should still set a state", function(done) {
      instance.setState({a: "a"}).then(function() {
        expect(instance.state).to.deep.equal({a: "a"});
        done();
      })


    });

    it('should update state when it was not previously set', function(done) {
      instance.updateState({a: "a"}).then(function() {
        expect(instance.state).to.deep.equal({a: "a"});
        done();
      });
    });

    it('should update an existing state value', function(done) {
      instance.setState({a: "a"}).then(function() {
        return instance.updateState({a: "b"})
      }).then(function() {
        expect(instance.state).to.deep.equal({a: "b"});
        done();
      });
    });

    it('should update an existing state with a not previously set value', function(done) {
      instance.setState({a: "a"}).then(function() {
        return instance.updateState({b: "b"})
      }).then(function() {
        expect(instance.state).to.deep.equal({a: "a", b: "b"});
        done();
      })
    });

  });

  describe('instance with a hub', function() {
    var instance;
    var hub;

    beforeEach(function(done) {
      instance = new Base({appId: "appId"});
      hub = new MockHub();
      instance.registerHub(hub).then(done);
    });

    it('should have sent a connection when the hub was registered', function() {
      expect(hub.connections['appId'].length).to.equal(1);
      expect(hub.connections['appId'][0]).to.equal('connect');
    });

    describe('setState', function() {
      it('should correctly send a state to the hub', function(done) {
        instance.setState({a: 'a'}).then(function() {
          expect(hub.state['appId']).to.deep.equal({a: 'a'});
          done();
        }).then(null, done);
      });

      it('should correctly override a state', function(done) {
        instance.setState({a: 'a'}).then(function() {
          return instance.setState({b: 'b'});
        }).then(function(){
          expect(hub.state['appId']).to.deep.equal({b: 'b'});
          done();
        }).then(null, done);
      });
    });

    describe('updateState', function() {
      it('should correctly set state if no previous state', function(done) {
        instance.updateState({a: 'a'}).then(function() {
          expect(hub.state['appId']).to.deep.equal({a: 'a'});
          done()
        }).then(null, done);
      })

      it('should correctly override existing state', function(done) {
        instance.setState({a:'a', b:'b'}).then(function() {
          return instance.updateState({a:'c'});
        }).then(function() {
          expect(hub.state['appId']).to.deep.equal({a:'c', b:'b'});
          done();
        }).then(null, done);
      });

      it('should correctly add to existing state', function(done) {
        instance.setState({a:'a'}).then(function() {
          return instance.updateState({b:'b'});
        }).then(function() {
          expect(hub.state['appId']).to.deep.equal({a:'a', b:'b'});
          done();
        }).then(null, done);
      });
    })
  })
})
