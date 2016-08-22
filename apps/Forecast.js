'use strict'

const Base = require('./Base.js');

var ForecastIO = require('forecast');

let Forecast = class Forecast extends Base {
  constructor(config) {
    config = Object.assign({
      service: 'forecast.io',
      units: 'f',
      cache: true,
      ttl: {
        minutes: 10
      },
      location: [37.755819, -122.438105],
      updateFrequency: 10000
    }, config);
    super(config);

    if (!this._config.key) {
      throw new Error("No key provided in Forecast config");
    }

    this.forecast = new ForecastIO(this._config);

    setInterval(this.updateForecast.bind(this), this._config.updateFrequency);

    this.updateForecast();
  }

  updateForecast() {
    var self = this;

    this.forecast.get(this._config.location, function(err, weather) {
      self.setState(weather)
    });
  }
}

module.exports = Forecast;
