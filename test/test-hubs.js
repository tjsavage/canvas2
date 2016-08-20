var chai = require('chai');

var expect = chai.expect;

var os = require('os');

describe('hubs', function() {
  describe('index', function() {
    var HubFactory;

    beforeEach(function() {
      var HubFactory = require('../hubs').HubFactory;
      factory = new HubFactory();
    });

    it('should be able to load hubs module', function() {
      expect(factory).to.not.be.null;
    });

    it('should have the getHubInstance method in the hubs module', function() {
      expect('getHubInstance' in factory).to.be.true;
    });

    it('should be able to load a hub instance if not previously instantiated', function() {
      var hubInstance = factory.getHubInstance({'hubId': 'a', 'hubClass': 'MemoryHub'});
      expect(typeof hubInstance).to.equal('object');
      expect(hubInstance instanceof require('../hubs/MemoryHub')).to.be.true;
    });

    it('should throw if not provided a hubId', function() {
      expect(function(){factory.getHubInstance({hubClass: 'MemoryHub'})}).to.throw(/hubId/);
    });

    it('should throw if not provided a hub class', function() {
      expect(function(){factory.getHubInstance({hubId: 'abc'})}).to.throw(/hubClass/);
    });

    it('should throw if not provided a valid hub class', function() {
      expect(function(){factory.getHubInstance({hubId: 'a', hubClass:'notaclass'})}).to.throw(/hubClass/);
    });

    it('should return only a single instance of a hubId', function() {
      var hubInstance1 = factory.getHubInstance({'hubId': 'a', 'hubClass': 'MemoryHub'});
      var hubInstance2 = factory.getHubInstance({'hubId': 'a', 'hubClass': 'MemoryHub'});
      expect(hubInstance1).to.equal(hubInstance2);
    })
  }),

  describe('LocalHub', function() {
    var HubFactory = require('../hubs').HubFactory;
    var factory;
    var hub;

    beforeEach(function() {
      factory = new HubFactory();
      hub = factory.getHubInstance({'hubId': 'a', 'hubClass': 'LocalHub'});
    });

    it('should set the state', function(done) {
      hub.setState('app1', {test: "1"}).then(function() {
        return hub.getState('app1').then(function(data) {
          expect(data).to.deep.equal({test: '1'});
          done();
        });
      }).then(null, done);
    })

    it('should update state', function(done) {
      hub.setState('app1', {test1: "1"}).then(function() {
        return hub.updateState('app1', {test2: "2"});
      }).then(function() {
        return hub.getState('app1');
      }).then(function(data) {
        expect(data).to.deep.equal({test1: "1", test2: "2"});
        done();
      }).then(null, done);
    });

    it('should correctly write state for multiple apps', function(done) {
      hub.setState('app1', {test1: "1"}).then(function() {
        return hub.setState('app2', {test2: "2"})
      }).then(function() {
        return hub.getState('app1');
      }).then(function(app1Data) {
        expect(app1Data).to.deep.equal({test1: "1"})
        return hub.getState('app2');
      }).then(function(app2Data) {
        expect(app2Data).to.deep.equal({test2: "2"});
        done();
      }).then(null, done);
    })
  })
})
