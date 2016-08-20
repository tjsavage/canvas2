var expect = require('chai').expect;
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
  })
})
