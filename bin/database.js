const mysql = require("node-mysql");
const DB = mysql.DB;
const db = new DB(require('../configs/db'));
const cps = require("cps");
const logger = require("./logger");
const async = require("async");
const TAG = "DATABASE";

// General Database
function checkConnection(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            callback(err);
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT last_insert_id()", function (err, data) {
            if (err) {
                callback(err);
                logger.error(TAG, err);
                conn.release();
                return
            }
            conn.release();
            callback(true);
        })
    });
}

// CommInterface model
function truncateInterfaces(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("TRUNCATE TABLE interfaces", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getInterfaces(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM interfaces", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addInterface(obj, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("INSERT INTO interfaces SET ?", obj, function (err) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                return
            }
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, rows) {
                conn.release();
                callback(err, rows[0]['id']);
            })
        });
    });
}
function getInterfaceById(interface_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM interfaces WHERE ?", {interface_id: interface_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows[0]);
        });
    }, callback);
}
function getInterfaceByName(interface_name, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM interfaces WHERE ?", {interface_name: interface_name}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function deleteInterfaceById(interface_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("DELETE FROM interfaces WHERE ?", {interface_id: interface_id}, function (err, rows, fields) {
            conn.release();
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
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("TRUNCATE TABLE libraries", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getLbraries(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM libraries", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addLibrary(obj, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("INSERT INTO libraries SET ?", obj, function (err) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                return
            }
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, rows) {
                conn.release();
                callback(err, rows[0]['id']);
            })
        });
    });
}
function getLibraryById(library_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM libraries WHERE ?", {lib_id: library_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows[0]);
        });
    }, callback);
}
function getLibraryByName(library_name, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM libraries WHERE ?", {lib_name: library_name}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function getLibrariesBySingleUID(device_uid, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            callback(err);
            return
        }
        conn.query("SELECT * FROM libraries WHERE ?", {lib_is_active: 'Y'}, function (err, rows) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                callback(err);
                return
            }
            let libraries = rows.filter(function (lib) {
                let uids = JSON.parse(lib.lib_uids);
                for (let uid of uids) {
                    if (device_uid == uid) {
                        return true;
                    }
                }
                return false;
            });
            conn.release();
            callback(null, libraries);
        });
    });
}
function deleteLibraryById(library_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("DELETE FROM libraries WHERE ?", {lib_id: library_id}, function (err, rows, fields) {
            conn.release();
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
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM devices", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addDevice(obj, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("INSERT INTO devices SET ?", obj, function (err) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                return
            }
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, data) {
                conn.release();
                callback(err, data[0]['id']);
            })
        });
    });
}
function getDeviceById(device_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM devices WHERE ?", {dev_id: device_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows[0]);
        });
    });
}
function getDeviceByName(device_name, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM devices WHERE ?", {dev_name: device_name}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function getDeviceByMAC(device_mac, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM devices WHERE ?", {dev_mac: device_mac}, function (err, res) {
            conn.release();
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
        if (typeof device == "undefined") {
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
            var functions = [];
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
        if (typeof device == "undefined") {
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
            var functions = [];
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
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            callback(err);
            return
        }
        conn.query("DELETE FROM devices WHERE ?", {dev_id: device_id}, function (err, rows, fields) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                callback(err);
                return
            }
            conn.release();
            if (rows.length > 0) callback(null, rows);
            else callback(null, false);
        });
    });
}
function updateDevice(device_id, device, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            callback(err);
            return
        }

        let parameter = {};
        parameter.dev_id = device_id;
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

        conn.query("UPDATE devices SET ? WHERE ?", [parameter, {dev_id: device_id}], function (err, rows, fields) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                callback(err);
                return
            }
            conn.release();
            callback(null);
        });
    });
}


// Function model
function truncateFunctions(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("TRUNCATE TABLE functions", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getFunctions(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM functions", function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addFunction(obj, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("INSERT INTO functions SET ?", obj, function (err) {
            if (err) {
                logger.error(TAG, err);
                conn.release();
                return
            }
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, data) {
                conn.release();
                callback(err, data[0]['id']);
            })
        });
    });
}
function getFunctionById(function_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM functions WHERE ?", {function_id: function_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows[0]);
        });
    });
}
function getFunctionByName(function_name, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM functions WHERE ?", {function_name: function_name}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function deleteFunctionById(function_id, callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("DELETE FROM functions WHERE ?", {function_id: function_id}, function (err, rows, fields) {
            conn.release();
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
    db.getConnection(function (err, conn) {
        if (err) {
            logger.error(TAG, err);
            conn.release();
            return
        }
        conn.query("SELECT * FROM functions WHERE ?", {function_library: library_id}, function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}

const Library = {
    add: addLibrary,
    getAll: getLbraries,
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