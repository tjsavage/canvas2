'use strict'
const request = require('request');

const Base = require('./Base.js');

let MuniMonitor = class MuniMonitor extends Base {
  /*
  * Config options:
  * {
  *   restbusUrl: "http://localhost:3030" //The URL of the restbus API to communicate with
  *   updateFrequency: 2000 //How frequently (in ms) the monitor should ping the restbus API
  *   stopPredictions: [{agency: 'sf-muni', route: 'KT', stop: '5728'}] // A list of objects that represent the stops to monitor predictions for
  * }
  */
  constructor(config) {
    config = Object.assign({
      restbusUrl: "http://localhost:3030",
      updateFrequency: 2000,
      stopPredictions: [{agency: 'sf-muni', route: 'KT', stop: '5728'}]
    }, config);
    super(config);

    this.predictions = {};

    setInterval(this.updatePredictions.bind(this), this._config.updateFrequency);
  }

  updatePredictions() {
    for(var stopObjIndex = 0; stopObjIndex < this._config.stopPredictions.length; stopObjIndex++) {
      var stopObj = this._config.stopPredictions[stopObjIndex];

      var stopKey = stopObj.agency + '/' + stopObj.route + '/' + stopObj.stop;

      request(this._config.restbusUrl + '/agencies/' + stopObj.agency + '/routes/' + stopObj.route + '/stops/' + stopObj.stop + '/predictions', function(err, res, body) {
        if (!err && res.statusCode == 200) {
          var result = JSON.parse(body);
          if (!result.length) {
            this.log("Muni monitor - no result from request to restbus");
            return;
          }
          var predictions = result[0].values;

          var stateObj = {};
          stateObj[stopKey] = predictions;
          this.updateState(stateObj);

        } else {
          console.error(err);
        }
      }.bind(this))
    }
  }
}

module.exports = MuniMonitor;
