/**
 * Created by mkrooted on 2/21/2017.
 */

var crypto = require("crypto");
var eventEmitter = new require('events').EventEmitter();

module.exports = eventEmitter;

module.exports.hello = function (hard_interface, device) {
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_json(device.lastIp, "/hello", requestId);
  hard_interface.on("GET_json_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('hello_response', body);
    }
  })
};

module.exports.get_status = function (hard_interface, device){
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_string(device.lastIp, "/get_status", requestId);
  hard_interface.on("GET_string_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('get_status_response', (body == "1"));
    }
  })
};

module.exports.light_on = function (hard_interface, device){
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_string(device.lastIp, "/light_on", requestId);
  hard_interface.on("GET_string_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('light_on_response', body);
    }
  })
};

module.exports.light_off = function (hard_interface, device){
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_string(device.lastIp, "/light_off", requestId);
  hard_interface.on("GET_string_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('light_off_response', body);
    }
  })
};
