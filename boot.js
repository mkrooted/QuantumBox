#!/usr/bin/env node
"use strict";

process.binding('http_parser').HTTPParser = require("http-parser-js").HTTPParser;
global.quantum_module = function (name) {
    return require(__dirname + '/bin/public/' + name)
};
global.quantum_config = function (name) {
    return require(__dirname + '/configs/' + name)
};
global.quantum_library = function (name) {
    return require(__dirname + "/hub_data/libraries/" + name + "/functions")
};
global.quantum_interface = function (name) {
    return require(__dirname + "/hub_data/interfaces/" + name + "/functions")
};

const TAG = "BOOT";
const logger = quantum_module("logger");
const db = quantum_module("database");
const child_process = require("child_process");

logger.log(TAG, "Checking system...");
db.checkConnection(function (error, dbStatus) {
    if (error || dbStatus !== true) {
        logger.warn(TAG, "No database access! Creating database...");
        child_process.exec("sqlite3 database/quantumbase.db < init/quantumbase.sql", {
            cwd: __dirname
        }, function (error, stdout, stderr) {
            if (error || stderr) {
                logger.error(TAG, "Error creating database:", error, "STDERR:" + stderr);
                process.exit(1);
                return;
            }
            logger.log(TAG, "Database created", "Connected to database");
        });
    } else {
        logger.log(TAG, "Connected to database");
    }
});
child_process.exec("nmap -sn 127.0.0.1", function (error, stdout, stderr) {
    if (error || stderr) {
        logger.error(TAG, "Cannot start nmap! LAN scanning disabled");
        global.NMAP_AVAIABLE = false;
        return;
    }
    global.NMAP_AVAIABLE = true;
});

const app = require('./app');
const debug = require('debug')('quantumbox:server');
const http = require('http');
const port = normalizePort(process.env.PORT || '80');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port))
        return val;
    if (port >= 0)
        return port;
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    logger.log(TAG, 'Listening on ' + bind);
}
