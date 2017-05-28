const db_config = quantum_config("db");
const cps = require("cps");
const async = require("async");
const sqlite3 = require("sqlite3");
const logger = quantum_module("logger");
const TAG = "DATABASE";

// General Database
function getConnection(callback) {
    //noinspection NonShortCircuitBooleanExpressionJS
    let db = new sqlite3.Database(db_config.filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (error) {
        callback(error, db)
    })
}
function checkConnection(callback) {
    getConnection(function (err, db) {
        if (err) {
            callback(err);
            logger.error(TAG, err);
            return
        }
        callback(null, true);
    });
}

// CommInterface model
function truncateInterfaces(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            return
        }
        db.run("DELETE from interfaces; VACUUM", function (err) {
            if (err) {
                logger.error(TAG, err);
                callback(err);
                db.close();
                return
            }
            db.close(callback);
        });
    });
}
function getInterfaces(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM interfaces", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function addInterface(obj, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("INSERT OR IGNORE INTO interfaces (interface_name, interface_functions, interface_is_active) VALUES (?,?,?)", [
            obj.interface_name,
            obj.interface_functions,
            "Y"
        ], function (err) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                db.close();
                callback(err, row['id']);
            })
        });
    });
}
function getInterfaceById(interface_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM interfaces WHERE interface_id=$interface_id", {$interface_id: interface_id}, function (err, row, fields) {
            db.close();
            callback(err, row);
        });
    }, callback);
}
function getInterfaceByName(interface_name, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM interfaces WHERE interface_name=$interface_name", {interface_name: interface_name}, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function deleteInterfaceById(interface_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE FROM interfaces WHERE interface_id=$interface_id", {interface_id: interface_id}, function (err, rows, fields) {
            db.close();
            if (err) {
                callback(err);
                return
            }
            if (rows.length > 0) callback(err, rows);
            else callback(err, false);
        });
    });
}

// Library model
function truncateLibraries(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE from libraries; VACUUM", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function getLibraries(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM libraries", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function addLibrary(object, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        let obj = {};
        if (object.lib_name) {
            obj.lib_name = object.lib_name;
        }
        if (object.lib_title) {
            obj.lib_title = object.lib_title;
        }
        if (object.lib_interface) {
            obj.lib_interface = object.lib_interface;
        }
        if (object.lib_uids) {
            obj.lib_uids = object.lib_uids;
        }
        db.run("INSERT OR IGNORE INTO libraries (lib_name, lib_title, lib_interface, lib_uids, lib_is_active) VALUES (?,?,?,?,?)", [
            obj.lib_name,
            obj.lib_title,
            obj.lib_interface,
            obj.lib_uids,
            "Y"
        ], function (err) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            db.get("SELECT last_insert_rowid() as id", function (err, row) {
                db.close();
                callback(err, row['id']);
            })
        });
    });
}
function getLibraryById(library_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM libraries WHERE lib_id=?", library_id, function (err, row, fields) {
            db.close();
            callback(err, row);
        });
    }, callback);
}
function getLibraryByName(library_name, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM libraries WHERE lib_name=?", library_name, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function getLibrariesBySingleUID(device_uid, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM libraries WHERE lib_is_active='Y'", function (err, rows) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            let libraries = rows.filter(function (lib) {
                let uids = JSON.parse(lib.lib_uids);
                for (let uid of uids) {
                    if (device_uid === uid) {
                        return true;
                    }
                }
                return false;
            });
            db.close();
            callback(null, libraries);
        });
    });
}
function deleteLibraryById(library_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE FROM libraries WHERE lib_id=?", library_id, function (err, rows, fields) {
            db.close();
            if (err) {
                callback(err);
                return
            }
            if (rows.length > 0) callback(err, rows);
            else callback(err, false);
        });
    });
}

// Device model
function getDevices(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM devices", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function addDevice(object, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        let obj = {};
        if (object.dev_mac) {
            obj.dev_mac = object.dev_mac;
        }
        if (object.dev_address) {
            obj.dev_address = object.dev_address;
        }
        if (object.dev_name) {
            obj.dev_name = object.dev_name;
        }
        if (object.dev_hash) {
            obj.dev_hash = object.dev_hash;
        }
        if (object.dev_uid) {
            obj.dev_uid = object.dev_uid;
        }
        if (object.dev_vendor) {
            obj.dev_vendor = object.dev_vendor;
        }
        db.run("INSERT INTO devices (dev_mac, dev_address, dev_name, dev_hash, dev_uid, dev_vendor) VALUES (?,?,?,?,?,?)", [
            obj.dev_mac,
            obj.dev_address,
            obj.dev_name,
            obj.dev_hash,
            obj.dev_uid,
            obj.dev_vendor,
        ], function (err) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            db.get("SELECT last_insert_rowid() as id", function (err, data) {
                db.close();
                callback(err, data['id']);
            })
        });
    });
}
function getDeviceById(device_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM devices WHERE dev_id=?", device_id, function (err, row, fields) {
            db.close();
            callback(err, row);
        });
    });
}
function getDeviceByName(device_name, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM devices WHERE dev_name=$dev_name", {dev_name: device_name}, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function getDeviceByMAC(device_mac, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM devices WHERE dev_mac=$dev_mac", {dev_mac: device_mac}, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function getDeviceActions(device_id, callback) {
    getDeviceById(device_id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            callback(err);
            return
        }
        if (typeof device === "undefined" || !device) {
            callback(null, []);
            return
        }
        getLibrariesBySingleUID(device.dev_uid, function (err, libraries) {
            if (err) {
                logger.error(TAG, err);
                callback(err);
                return
            }
            // logger.debug(TAG, "found libs of "+device.dev_uid, libraries);
            let functions = [];
            async.each(libraries, function (lib, cb) {
                getFunctionsByLibrary(lib.lib_id, function (err, rows) {
                    if (err) {
                        logger.error(TAG, err);
                        cb(err);
                        return
                    }
                    // logger.debug(TAG, "funcs of "+lib.lib_name, rows);

                    functions = functions.concat(rows);

                    // logger.debug(TAG, "functions now", functions);

                    cb();
                })
            }, function (err) {
                if (err) {
                    logger.error(TAG, err);
                    callback(err);
                    return
                }
                callback(null, functions);
            })
        })
    })
}
function getDeviceUserActions(device_id, callback) {
    getDeviceById(device_id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            callback(err);
            return
        }
        if (typeof device === "undefined" || !device) {
            callback(null, []);
            return
        }
        getLibrariesBySingleUID(device.dev_uid, function (err, libraries) {
            if (err) {
                logger.error(TAG, err);
                callback(err);
                return
            }
            // logger.debug(TAG, "found libs of "+device.dev_uid, libraries);
            let functions = [];
            async.each(libraries, function (lib, cb) {
                getFunctionsByLibrary(lib.lib_id, function (err, rows) {
                    if (err) {
                        logger.error(TAG, err);
                        cb(err);
                        return
                    }
                    // logger.debug(TAG, "funcs of "+lib.lib_name, rows);

                    let parsedRows = [];
                    for (let row of rows) {
                        if (row.function_type === 'ACT') {
                            parsedRows.push(row)
                        }
                    }

                    functions = functions.concat(parsedRows);

                    // logger.debug(TAG, "functions now", functions);

                    cb();
                })
            }, function (err) {
                if (err) {
                    logger.error(TAG, err);
                    callback(err);
                    return
                }

                callback(null, functions);
            })
        })
    })
}
function deleteDeviceById(device_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE FROM devices WHERE ?", {dev_id: device_id}, function (err, rows, fields) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            db.close();
            if (rows.length > 0) callback(null, rows);
            else callback(null, false);
        });
    });
}
function updateDevice(device_id, device, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }

        let parameter = {};
        if (device.dev_hash) {
            parameter.dev_hash = device.dev_hash;
        }
        if (device.dev_mac) {
            parameter.dev_mac = device.dev_mac;
        }
        if (device.dev_vendor) {
            parameter.dev_vendor = device.dev_vendor;
        }
        if (device.dev_name) {
            parameter.dev_name = device.dev_name;
        }
        if (device.dev_address) {
            parameter.dev_address = device.dev_address;
        }
        if (device.dev_uid) {
            parameter.dev_uid = device.dev_uid;
        }

        let formatted_fields = "";
        for (let field in parameter) {
            if (formatted_fields.length === 0)
                formatted_fields += `${field}='${device[field]}'`;
            else
                formatted_fields += `, ${field}='${device[field]}'`;
        }

        db.run(`UPDATE devices SET ${formatted_fields} WHERE dev_id=?`, device_id, function (err, rows, fields) {
            db.close();
            if (err) {
                logger.error(TAG, err);
                callback(err);
                return
            }
            callback(null);
        });
    });
}


// Function model
function truncateFunctions(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE from functions; VACUUM", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function getFunctions(callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM functions", function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}
function addFunction(obj, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("INSERT INTO functions (function_library, function_name, function_title, function_type) VALUES (?, ?, ?, ?)", [
            obj.function_library,
            obj.function_name,
            obj.function_title,
            obj.function_type
        ], function (err) {
            if (err) {
                logger.error(TAG, err);
                db.close();
                callback(err);
                return
            }
            db.get("SELECT last_insert_rowid() as id", function (err, data) {
                db.close();
                callback(err, data['id']);
            })
        });
    });
}
function getFunctionById(function_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM functions WHERE function_id=?", function_id, function (err, row, fields) {
            db.close();
            callback(err, row);
        });
    });
}
function getFunctionByName(function_name, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.get("SELECT * FROM functions WHERE function_name=?", function_name, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function deleteFunctionById(function_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.run("DELETE FROM functions WHERE function_id=?", function_id, function (err, rows, fields) {
            db.close();
            if (err) {
                callback(err);
                return
            }
            if (rows.length > 0) callback(err, rows);
            else callback(err, false);
        });
    });
}
function getFunctionsByLibrary(library_id, callback) {
    getConnection(function (err, db) {
        if (err) {
            logger.error(TAG, err);
            db.close();
            callback(err);
            return
        }
        db.all("SELECT * FROM functions WHERE function_library=?", library_id, function (err, rows) {
            db.close();
            callback(err, rows);
        });
    });
}

const Library = {
    add: addLibrary,
    getAll: getLibraries,
    getById: getLibraryById,
    getByName: getLibraryByName,
    getBySingleUID: getLibrariesBySingleUID,
    deleteById: deleteLibraryById,
    truncate: truncateLibraries
};
const CommInterface = {
    add: addInterface,
    getAll: getInterfaces,
    getById: getInterfaceById,
    getByName: getInterfaceByName,
    deleteById: deleteInterfaceById,
    truncate: truncateInterfaces
};
const Device = {
    add: addDevice,
    getAll: getDevices,
    getById: getDeviceById,
    getByName: getDeviceByName,
    getByMAC: getDeviceByMAC,
    getActions: getDeviceActions,
    getUserActions: getDeviceUserActions,
    deleteById: deleteDeviceById,
    update: updateDevice
};
const Func = {
    add: addFunction,
    getAll: getFunctions,
    getById: getFunctionById,
    getByName: getFunctionByName,
    getByLibrary: getFunctionsByLibrary,
    deleteById: deleteFunctionById,
    truncate: truncateFunctions
};

module.exports.checkConnection = checkConnection;
module.exports.models = {
    Library: Library,
    Device: Device,
    Function: Func,
    Interface: CommInterface
};