/**
 * node-aplay
 * Javascript ALSA aplay wrapper for Node.js
 *
 * @author Patrik Melander (lotAballs)
 * @originalAuthor Maciej Sopyło @ KILLAHFORGE.
 *
 * MIT License
 */

var	spawn = require('child_process').spawn,
	events = require('events'),
	util = require('util');

module.exports = function Sound(filename) {
	events.EventEmitter.call(this);
	this.filename = filename;
};

util.inherits(module.exports, events.EventEmitter);

module.exports.prototype.play = function () {
  this.process = spawn('aplay', [ this.filename ]);
  this.stopped = false;

  this.process.on('error', function(err) {
    console.log('Error spawning aplay');
    this.stopped = true;
  });

	var self = this;
	this.process.on('exit', function (code, sig) {
		if (code !== null && sig === null) {
			self.emit('complete');
		}
	});
};

module.exports.prototype.stop = function () {
	this.stopped = true;
  if (this.process) {
    this.process.kill('SIGTERM');
  }
	this.emit('stop');
};

module.exports.prototype.pause = function () {
	if (this.stopped) return;
	this.process.kill('SIGSTOP');
	this.emit('pause');
};

module.exports.prototype.resume = function () {
	if (this.stopped) return this.play();
	this.process.kill('SIGCONT');
	this.emit('resume');
};
