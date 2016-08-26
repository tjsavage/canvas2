'use strict'

var fs = require('fs');
var path = require('path');

let SystemConfig = class SystemConfig {
  constructor() {
    var filepath = process.env.CANVAS2_SYSTEM_CONFIG || process.argv.config;

    if (!filepath) {
      filepath = path.join(__dirname, 'system-config.json');

      try {
        fs.accessSync(filepath, fs.F_OK);

      } catch (e) {
        filepath = path.resolve(process.env['HOME'], 'system-config.json');
        try {
          fs.accessSync(filepath, fs.F_OK);
        } catch (e) {
          filepath = path.resolve(process.cwd(), 'system-config.json');

          try {
            fs.accessSync(filepath, fs.F_OK);
          } catch(e) {
            throw new Exception("Could find system-config.json");
          }
        }
      }
    }

    this.filepath = filepath;
    this.file = fs.readFileSync(this.filepath, 'UTF-8')

    this.data = JSON.parse(this.file);
  }

  get devices() {
    return this.data.devices;
  }

  get hubs() {
    return this.data.hubs;
  }
}

var config = module.exports = new SystemConfig();
