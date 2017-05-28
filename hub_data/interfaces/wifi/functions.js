var http = require("http");
const config = require("../../../configs/general.js");

function GET_json(device_ip, port, path, callback) {
    http.request({
        "hostname": device_ip,
        "path": path,
        "port": port
    }, function (res) {
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            callback(JSON.parse(str));
        });
    });
}
function GET_string(device_ip, port, path, callback) {
    var req = http.request({
        "hostname": device_ip,
        "path": path,
        "method": "GET",
        "port": port
    });
    req.setTimeout(config.endpoint.request_timeout, function () {
        console.log("timeout and end!");
        callback("{\"status\": \"NO_DATA\"}");
    });
    req.on('error', (e) => {
        console.log('problem with request:', e);
    });
    req.on('response', res =>{
        console.log("statuscode: "+res);
        var str = '';

        res.on('data', function (chunk) {
            console.log("Hmmm...");
            str += chunk;
        });

        res.on('end', function () {
            console.log("end!");
            callback(str);
        });
    });
    req.end();
}

function POST_json(device_ip, port, path, data, callback) {
    var req = http.request({
        "hostname": device_ip,
        "path": path,
        "method": "POST",
        "port": port
    }, function (res) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        res.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        res.on('end', function () {
            callback(str);
        });
    });

    req.on('error', (e) => {
        console.log('problem with request:', e);
    });

    req.write(data);
    req.end();
}

module.exports.GET_json = GET_json;
module.exports.GET_string = GET_string;
module.exports.POST_json = POST_json;