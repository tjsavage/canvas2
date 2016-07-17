'use strict'

const Base = require('./Base.js');

let Clock = class Clock extends Base {
  constructor(config) {
    super(config);
    setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    this.state = {
      "date": (new Date()).toString(),
      "test": "abc"
    }
  }
}

module.exports = Clock;
