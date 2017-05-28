const logger = require('./logger');
const xml2js = require('xml2js');
const exec = require('child_process').exec;
const path = require("path");
const TAG = "NETWORK_MANAGER";
const lan_config = quantum_config("lan");

function device_scanner(callback) {
    if (!NMAP_AVAILABLE) {
        callback("NMAP not available", []);
    }
    exec('nmap -oX - -sn ' + lan_config.scan_query, {"cwd": __dirname}, function (err, stdout, stderr) {
        if (err) {
            logger.error(TAG, err);
            callback(err);
            return;
        }
        if (stderr) {
            console.error(TAG, stderr);
            callback(stderr);
            return;
        }
        xml2js.parseString(stdout, function (err1, result) {
            if (err1) {
                logger.error(TAG, err1);
                callback(err1);
                return;
            }
            let hosts = [];
            result['nmaprun']['host'].forEach(function (value) {
                let obj = {
                    "addr": value.address[0]['$']['addr']
                };
                if (value.address[1] && value.address[1]['$']['addr']) {
                    obj['mac'] = value.address[1]['$']['addr']
                } else return;
                if (value.address[1] && value.address[1]['$']['vendor']) {
                    obj['vendor'] = value.address[1]['$']['vendor']
                }
                hosts.push(obj)
            });
            callback(null, hosts);
        })

    });
}

module.exports.scan = device_scanner;
