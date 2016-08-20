'use strict'

class HubFactory {
  constructor() {
    this.hubInstances = {};
  }

  static get HUB_CLASSES() {
    return {
      'FirebaseHub': require('./FirebaseHub'),
      'MemoryHub': require('./MemoryHub'),
      'LocalHub': require('./LocalHub')
    }
  }

  getHubInstance(hubConfig) {
    if(!hubConfig.hubId) {
      throw new Error("Hub Config requires a hubId:", hubConfig);
    }

    if(hubConfig.hubId in this.hubInstances) {
      return this.hubInstances[hubConfig.hubId];
    }

    if (!HubFactory.HUB_CLASSES[hubConfig.hubClass]) {
      throw new Error("hubClass " + hubConfig.hubClass + " not found in Hub Factory classes");
    }

    var HubClass = HubFactory.HUB_CLASSES[hubConfig.hubClass];

    var hub = new HubClass(hubConfig);
    this.hubInstances[hubConfig.hubId] = hub;
    return hub;
  }

}

module.exports = {
  HubFactory: HubFactory
}
