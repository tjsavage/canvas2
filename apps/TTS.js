'use strict'
/*
* A simple restful JSON server for the NextBus API using `restbus` module
*/
const Base = require('./Base.js');

const url = require('url');
const speak = require('../lib/speak');
const Sound = require('../lib/play');

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
    var urlParts = url.parse(request.url, true);

    if (urlParts.path == "/ding") {
      var ding = new Sound('../resources/sound/ding.wav');
      ding.play();
    }

    if (urlParts.query.say) {
      console.log(urlParts.query.say);
      speak.speak(urlParts.query.say);
    }

    response.end("It works!");
  }
}

module.exports = TTS;
