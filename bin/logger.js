/**
 * Created by mkrooted on 3/8/2017.
 */

function error(tag, ...args) {
    for (let arg of args) {
        console.error("ERROR -", tag, "-", arg);
    }
}
function warn(tag, ...args) {
    for (let arg of args) {
        console.warn("WARN -", tag, "-", arg);
    }
}
function log(tag, ...args) {
    for (let arg of args) {
        console.log("LOG -", tag, "-", arg);
    }
}
function info(tag, ...args) {
    for (let arg of args) {
        console.info("INFO -", tag, "-", arg);
    }
}
function debug(tag, ...args) {
    for (let arg of args) {
        console.log("DEBUG -", tag, "-", arg);
    }
}

module.exports = {
    "error": error,
    "warn": warn,
    "log": log,
    "info": info,
    "debug": debug
};