/**
 * Created by mkrooted on 2/21/2017.
 */

var http = require("http");
var EventEmitter = require("events");
var wifiEventEmitter = new EventEmitter();
/*  Events:
*   - GET_json_response (requestId, body)
* */

function GET_json(device_ip, path, requestId) {
  http.request({
    "hostname": device_ip,
    "path": path
  }, function (res) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    rows.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    rows.on('end', function () {
      wifiEventEmitter.emit('GET_json_response', requestId, JSON.parse(str));
    });
  });
}
function GET_string(device_ip, path, requestId) {
  http.request({
    "hostname": device_ip,
    "path": path
  }, function (res) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    rows.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    rows.on('end', function () {
      wifiEventEmitter.emit('GET_string_response', requestId, str);
    });
  });
}

module.exports = wifiEventEmitter;
module.exports.GET_json = GET_json;
module.exports.GET_string = GET_string;
