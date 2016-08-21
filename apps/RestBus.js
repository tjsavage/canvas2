'use strict'
/*
* A simple restful JSON server for the NextBus API using `restbus` module
*/
const Base = require('./Base.js');

let RestBus = class RestBus extends Base {
  constructor(config) {
    config = Object.assign({
      port: 3030,
    }, config)

    super(config);

    var restbus = require('restbus');

    restbus.listen(this._config.port, function() {
      console.log('restbus is now listening on ', this._config.port);
    }.bind(this));
  }
}

module.exports = RestBus;
