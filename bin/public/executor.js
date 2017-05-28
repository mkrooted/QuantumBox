const TAG = "EXECUTOR";
const logger = require("./logger");
const db = require("./database");

module.exports.execute_action = function (device_id, action_id, callback) {
    db.models.Device.getById(device_id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            callback(err);
            return
        }
        if (device === false || typeof device === "undefined") {
            callback(null);
            return
        }
        db.models.Function.getById(action_id, function (err, func) {
            if (err) {
                logger.error(TAG, err);
                callback(err);
                return
            }
            if (func === false || typeof func === "undefined") {
                callback(null);
                return
            }
            logger.debug(TAG, "function_library:", func);
            db.models.Library.getById(func.function_library, function (err, library) {
                if (err) {
                    logger.error(TAG, err);
                    callback(err);
                    return
                }
                logger.debug(TAG, "Gonna load:", library.lib_name + "." + func.function_name + "()", "Interface: "+library.lib_interface);
                const lib_bin = quantum_library(library.lib_name);
                const intrfc = quantum_interface(library.lib_interface);
                lib_bin[func.function_name](intrfc, device, function(body) {

                    if (!body) {
                        body = "OK"
                    }

                    logger.debug(TAG, library.lib_name + "." + func.function_name + "() - Out of executor scope");
                    callback(null, body);
                });
            })
        })
    })
};