/**
 * Created by mkrooted on 2/21/2017.
 */

var http = require("http");
/*  Events:
 *   - GET_json_response (requestId, body)
 * */

function GET_json(device_ip, path, callback) {
    http.request({
        "hostname": device_ip,
        "path": path
    }, function (res) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        res.on('end', function () {
            callback(JSON.parse(str));
        });
    });
}
function GET_string(device_ip, path, callback) {
    console.log("I'm here");

    var req = http.request({
        "hostname": device_ip,
        "path": path,
        "method": "GET",
    }, function (res) {
        console.log("statuscode: "+res);
        var str = '';

        res.on('data', function (chunk) {
            console.log("Hmmm...");
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        res.on('end', function () {
            console.log("end!");
            callback(str);
        });
    });
    req.on('error', (e) => {
        console.log('problem with request:', e);
    });
    req.on('response', function (msg){

    });
    req.end();
}

module.exports.GET_json = GET_json;
module.exports.GET_string = GET_string;
