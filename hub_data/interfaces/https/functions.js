const http = require("https");
const config = quantum_config("general");
const logger = quantum_module("logger");

function GET_json(device_ip, port, path, callback) {
    let req = http.request({
        "hostname": device_ip,
        "path": path,
        "port": port
    });
    req.setTimeout(config.endpoint.request_timeout, function () {
        console.log("timeout and end!");
        callback(JSON.stringify({
            status: "NO_DATA"
        }));
    });
    req.on('error', (e) => {
        console.log('problem with request:', e);
    });
    req.on('response', function (res) {
        let str = '';
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            callback(JSON.parse(str));
        });
    });
    req.end();
}
function GET_string(device_ip, port, path, callback) {
    let req = http.request({
        "hostname": device_ip,
        "path": path,
        "method": "GET",
        "port": port
    });
    req.setTimeout(config.endpoint.request_timeout, function () {
        console.log("timeout and end!");
        callback(JSON.stringify({
            status: "NO_DATA"
        }));
    });
    req.on('error', (e) => {
        console.log('problem with request:', e);
    });
    req.on('response', res =>{
        console.log("statuscode: "+res);
        let str = '';

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
    let req = http.request({
        "hostname": device_ip,
        "path": path,
        "method": "POST",
        "port": port
    });
    req.setTimeout(config.endpoint.request_timeout, function () {
        console.log("timeout and end!");
        callback(JSON.stringify({
            status: "NO_DATA"
        }));
    });
    req.on('error', (e) => {
        console.log('problem with request:', e);
    });
    req.on('response', function (res) {
        let str = '';
        res.on('data', function (chunk) {
            str += chunk;
        });
        res.on('end', function () {
            callback(str);
        });
    });
    req.write(data);
    req.end();
}

module.exports.GET_json = GET_json;
module.exports.GET_string = GET_string;
module.exports.POST_json = POST_json;