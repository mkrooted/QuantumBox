/**
 * Created by mkrooted on 2/21/2017.
 */

var crypto = require("crypto");
var eventEmitter = new require('events').EventEmitter();

module.exports = eventEmitter;

module.exports.acknowledge = function (hard_interface, device) {
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_json(device.lastIp, "/acknowledge", requestId);
  hard_interface.on("GET_json_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('acknowledge_response', body);
    }
  })
};

module.exports.getStatus = function (hard_interface, device){
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_string(device.lastIp, "/getStatus", requestId);
  hard_interface.on("GET_json_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('getStatus_response', body);
    }
  })
};

module.exports.toggleMode = function (hard_interface, device){
  var requestId = crypto.randomBytes(8).toString('hex');
  hard_interface.GET_string(device.lastIp, "/toggleMode", requestId);
  hard_interface.on("GET_string_response", function (request_id, body) {
    if (request_id == requestId) {
      eventEmitter.emit('toggleMoe_response', body);
    }
  })
};
