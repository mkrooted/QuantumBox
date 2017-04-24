const db = require("./database");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const cps = require("cps");
const TAG = "INTERFACE_MANAGER";

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(function (file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory()
        });
}

function loadInterfaces(callback) {
    cps.seq([
        (_, cb) => {
            db.models.Interface.truncate(function () {
                logger.log(TAG, "truncation of Interfaces completed");
                cb();
            });
        },
        (res, cb) => {
            const path_base = path.join(__dirname, "../hub_data/interfaces");
            const interfaces = getDirectories(path_base);

            for (let _interface of interfaces) {
                const str_path = path.join(path_base, _interface);
                const interface_data = JSON.parse(fs.readFileSync(str_path + "/interface.json"));
                let functions = [];
                for (let func in interface_data.functions) {
                    let args = "(";
                    let args_raw = Object.keys(interface_data.functions[func].args);

                    args += args_raw.join(", ");

                    args += ")";
                    functions.push(func+args);
                }

                db.models.Interface.add({
                    "interface_name": interface_data.name,
                    "interface_functions": JSON.stringify(functions),
                }, function (err, data) {
                    if (err) {
                        logger.error(TAG, err);
                        return;
                    }
                });
            }
            cb(interfaces);
        }
    ], function (res) {
        callback(res);
    });
}

module.exports.loadInterfaces = loadInterfaces;