const TAG = "COMMON_ROUTE_FUNCTIONS";
const logger = require("../bin/logger");
const db = require("../bin/database");

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
                logger.debug(TAG, "Gonna load:", "../hub_data/libraries/"+library.lib_name+"/functions", "../hub_data/interfaces/"+library.lib_interface+"/functions");
                const lib_bin = require("../hub_data/libraries/" + library.lib_name + "/functions");
                const intrfc = require("../hub_data/interfaces/" + library.lib_interface + "/functions");
                lib_bin[func.function_name](intrfc, device, function(body) {
                    callback(null, body);
                });
            })
        })
    })
};