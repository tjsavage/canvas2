'use strict'

const Base = require('./Base.js');

let Clock = class Clock extends Base {
  constructor(config) {
    super(config);
    setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    this.setState({
      "date": (new Date()).toString()
    })
  }
}

module.exports = Clock;
