/**
 * Created by mkrooted on 3/8/2017.
 */
const mysql = require("node-mysql");
const DB = mysql.DB;
var db = new DB(require('../configs/db'));
const cps = require("cps");
const logger = require("./logger");
const TAG = "DATABASE";

// General Database
function checkConnection(callback) {
    db.getConnection(function (err, conn) {
        if (err) {
            callback(err);
            // logger.error(TAG, err);
            return
        }
        conn.query("SELECT last_insert_id()", function (err, data) {
            if (err) {
                callback(err);
                logger.error(TAG, err);
                return
            }
            callback(true);
        })
    });
}

// CommInterface model
function truncateInterfaces(callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM interfaces",  function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addInterface(obj, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("INSERT INTO interfaces SET ?", obj, function (err) {
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, rows) {
                conn.release();
                callback(err, rows[0]['id']);
            })
        });
    });
}
function getInterfaceById(interface_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM libraries",  function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addLibrary(obj, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("INSERT INTO libraries SET ?", obj, function (err) {
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, rows) {
                conn.release();
                callback(err, rows[0]['id']);
            })
        });
    });
}
function getLibraryById(library_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM libraries WHERE ?", {lib_name: library_name}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function deleteLibraryById(library_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM devices",  function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addDevice(obj, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("INSERT INTO devices SET ?", obj, function (err) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getDeviceById(device_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM devices WHERE ?", {dev_id: device_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getDeviceByName(device_name, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM devices WHERE ?", {dev_mac: device_mac}, function (err, res) {
            conn.release();
            callback(err, res);
        });
    });
}
function deleteDeviceById(device_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("DELETE FROM devices WHERE ?", {lib_id: device_id}, function (err, rows, fields) {
            if (rows.length > 0) callback(rows);
            else callback(false);
        });
    });
}

// Function model
function truncateFunctions(callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("TRUNCATE TABLE functions",  function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getFunctions(callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM functions",  function (err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
}
function addFunction(obj, callback) {
    db.getConnection(function (err, conn) {
        if(err) {
            logger.error(TAG, err);
            return
        }
        conn.query("INSERT INTO functions SET ?", obj, function (err) {
            conn.query("SELECT LAST_INSERT_ID() as id", function (err, data) {
                conn.release();
                callback(err, data[0]['id']);
            })
        });
    });
}
function getFunctionById(function_id, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("SELECT * FROM functions WHERE ?", {function_id: function_id}, function (err, rows, fields) {
            conn.release();
            callback(err, rows);
        });
    });
}
function getFunctionByName(function_name, callback) {
    db.getConnection(function (err, conn) {
        if(err){
            logger.error(TAG, err);
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
        if(err){
            logger.error(TAG, err);
            return
        }
        conn.query("DELETE FROM functions WHERE ?", {function_id: function_id}, function (err, rows, fields) {
            conn.release();
            if( err) {
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
        if(err){
            logger.error(TAG, err);
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
    deleteById: deleteDeviceById
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