const db = require("./database");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const cps = require("cps");
const TAG = "LIBRARY_MANAGER";

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(function (file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory()
        });
}

function loadLibraries(callback) {
    cps.seq([
        (_, cb) => {
            db.models.Library.truncate(function () {
                logger.log(TAG, "truncation of Libraries completed");
                cb();
            });
        },
        (res, cb) => {
            db.models.Function.truncate(function () {
                logger.log(TAG, "truncation of Functions completed");
                cb();
            });
        },
        (res, cb) => {
            const path_base = path.join(__dirname, "../hub_data/libraries");
            const libs = getDirectories(path_base);
            for (let lib in libs) {
                const str_path = path.join(path_base, libs[lib]);
                const library_data = JSON.parse(fs.readFileSync(str_path + "/library.json"));
                db.models.Library.add({
                    "lib_name": library_data.name,
                    "lib_interface": library_data.interface,
                    "lib_uids": JSON.stringify(library_data.supported_devices),
                    "lib_title": library_data.title
                }, function (err, data) {
                    if (err) {
                        logger.error(TAG, err);
                        return;
                    }
                    var lib_id = data;
                    const functions_names = library_data.functions;
                    for (let func in functions_names) {
                        db.models.Function.add({
                            "function_library": lib_id,
                            "function_name": func,
                            "function_type": library_data.functions[func].type
                        }, function (err, data) {
                            if (err) {
                                logger.error(TAG, err);
                                return
                            }
                        })
                    }
                });
            }
            cb(libs);
        }
    ], function (res) {
        callback(res);
    });
}

module.exports.loadLibraries = loadLibraries;