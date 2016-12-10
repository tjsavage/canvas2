'use strict'
/*
* A simple restful JSON server for the NextBus API using `restbus` module
*/
const Base = require('./Base.js');

const url = require('url');
const say = require('say');

let TTS = class TTS extends Base {
  constructor(config) {
    config = Object.assign({
      port: 3040,
    }, config)

    super(config);


    var http = require('http');

    this.server = http.createServer(this._requestHandler.bind(this))

    this.server.listen(this._config.port, function() {
      this.log("TTS module is listening on " + this._config.port);
    }.bind(this));
  }

  _requestHandler(request, response) {
    response.end("It works!");
    var urlParts = url.parse(request.url, true);
    this.log("Saying: " + urlParts.query.say);
    if (urlParts.query.say) {
      say.speak(urlParts.query.say);
    }
  }
}

module.exports = TTS;
