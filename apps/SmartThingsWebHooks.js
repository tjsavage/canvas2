'use strict'

const Base = require('./Base.js');
const http = require('http');

/**
* Provides an endpoint to use with https://github.com/harperreed/SmartThings-webhook
* Request bodies look something like:

{ id: '0749e3be-e2e1-4cc9-87d9-e1c3e01ad165',
  date: '2016-12-12T00:06:30.715Z',
  value: '63',
  name: 'temperature',
  display_name: 'Front Door Sensor',
  description: '{{ device.displayName }} was {{ value }}°F',
  source: 'DEVICE',
  state_changed: true,
  physical: false,
  location_id: '092ad138-a152-4353-890b-1164779b1047',
  hub_id: '2a587939-f82e-459e-856b-79d24e22a77b' }

* And this reports its state in the form of:

{
  "${id}": {
    "displayName": "${display_name}",
    "locationId": "${location_id}",
    "hubId": "${hub_id}",
    "state": {
      "${name}": "${value}"
      ...
    }
  }
}
*/

let SmartThingsWebHooks = class SmartThingsWebHooks extends Base {
  constructor(config) {
    config = Object.assign({
      port: 3032,
    }, config)

    super(config);

    var server = http.createServer(this.handleRequest.bind(this));
    var port = this._config.port
    server.listen(port, function(err) {
      if (err) {
        return console.log('Error: ', err);
      }

      console.log("SmartThingsWebHooks server listening on ", port);
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

        var stateUpdate = self.requestBodyToStateObject(data);

        self.updateState(stateUpdate);
      }
    });

    response.end("Done");
  }

  requestBodyToStateObject(body) {
    var deviceState = {};
    deviceState[body.name] = body.value;

    var device = {
      displayName: body.display_name,
      locationId: body.location_id,
      hubId: body.hub_id,
    }

    var overallUpdate = {}
    overallUpdate['/' + body.id + '/displayName'] = body.display_name;
    overallUpdate['/' + body.id + '/locationId'] = body.location_id;
    overallUpdate['/' + body.id + '/hubId'] = body.hub_id;
    overallUpdate['/' + body.id + '/state/' + body.name] = body.value;

    return overallUpdate;
  }
}

module.exports = SmartThingsWebHooks;
