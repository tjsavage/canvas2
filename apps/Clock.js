'use strict'

const Base = require('./Base.js');

let Clock = class Clock extends Base {
  constructor(config) {
    console.log(config);
    super(config);
    console.log('constructed');
    setInterval(this.tick.bind(this), 1000);
  }

  tick() {
    console.log(new Date());
    this.state = {
      "date": (new Date()).toString()
    }
  }
}

module.exports = Clock;
