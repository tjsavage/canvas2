'use strict'
/*
* Manages a security system
*/
const Base = require('./Base.js');
const http = require('http');

/*
* State object:

{
    managedSensors: { //The sensors this system in particular is responsible for.
        sensorId: {
            name: "Human readable sensor name"
            tripped: false,
            lastTripped: TIMESTAMP,
            state: {
                ... general state information ...
            }
        },
        ...
    },
    externalSensors: { //Devices managed by other applications, but with their state mirrored here
        sensorId: {
            ... sensor state ...
        }
    },
    armedState: "" // One of 'home', 'away', 'disarmed', or 'asleep'
    alertLevel: 0.1 // Between 0 and 1, recalculated every new sensor update depending on armedState.
    warningThreshold: 0.5 // Level the alert level should get to before a warning happens.
    dangerThreshold: 0.9 // Level the alert level should get to before the situation is dangerous.
    currentAlertState: "" // One of "disarmed," "safe", "warning", "danger" 
}
*/
let SecuritySystem = class SecuritySystem extends Base {
  constructor(config) {
    config = Object.assign({
      port: 3033,
      warningThreshold: 0.5,
      dangerThreshold: 0.9
    }, config)

    super(config);

    var server = http.createServer(this.handleRequest.bind(this));
    var port = this._config.port
    server.listen(port, function(err) {
      if (err) {
        return console.log('Error: ', err);
      }

      console.log("Security System server listening on ", port);
    })
  }

  handleRequest(request, response) {
    var body = '';
    var self = this;
    request.on('data', function(chunk) {
      body += chunk;
    }).on('end', function() {
      if (body) {
        var data = JSON.parse(body);
        console.log("here");
        self.log(body);
        let stateUpdate = self._createManagedDeviceUpdateFromRequest(data);

        self.updateState(stateUpdate);
      }
    });

    response.end("Done");
  }

  /*
  * Expect data to be in the form:
  {
      "sensorId": "XXX",
      "sensorName": "Name",
      "tripped": boolean,
      "timestamp": timestamp,
      ...
  }
  */
  _createManagedDeviceUpdateFromRequest(data) {
      var overallStateUpdate = {};
      overallStateUpdate['managedSensors/' + data.sensorId + '/'] = data;
      return overallStateUpdate;
  }
}

module.exports = SecuritySystem;
