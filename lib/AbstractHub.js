'use strict'

/**
* The AbstractHub class represents a connection to the centralized Hub
* that stores information about the overall canvas system.
* Hub is a singleton - there is only one running per hub type per device.
*/
class AbstractHub {
  constructor(options) {

  }

  /**
  * @return Promise - returns a promise that resolves when the state has been set.
  */
  setState(appId, obj) {
    throw new Error("Hub::setState not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the state has been updated.
  */
  updateState(appId, obj) {
    throw new Error("Hub::updateState not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the log has been sent.
  */
  log(appId, string) {
    throw new Error("Hub::log not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the error log has been sent.
  */
  error(appId, string) {
    throw new Error("Hub::updateState not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the heartbeat has been sent.
  */
  heartbeat(appId) {
    throw new Error("Hub::heartbeat not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the ping has been sent.
  */
  ping(appId) {
    throw new Error("Hub::ping is not implemented");
  }

  /**
  * @return Promise - returns a promise that resolves when the connection has been registered.
  */
  connect(appId) {
    throw new Error("Hub::connect is not implemented");
  }
}

module.exports = AbstractHub;
