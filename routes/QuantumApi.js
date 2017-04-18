/**
 * Created by mkrooted on 12.03.2017.
 */

const express = require('express');
const router = express.Router();
const device_manager = require("../bin/network_manager");
const library_manager = require("../bin/library_manager");
const interface_manager = require("../bin/interface_manager");
const logger = require("../bin/logger");
const db = require("../bin/database");
const async = require("async");
const TAG = "ROUTER (API)";

// Devices API
router.get('/devices', function (req, res, next) {
    db.models.Device.getAll( function (err, devices) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(devices);
    });
});
router.get('/devices/:id', function (req, res, next) {
    db.models.Device.getById(req.params.id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(device);
    });
});
router.get('/devices/:id/actions', function (req, res, next) {
    db.models.Device.getActions(req.params.id, function (err, funcs) {
        if(err){
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(funcs);
    })
});
router.post('/devices/:device_id/actions/:action_id', function (req, res, next) {
    db.models.Device.getById(req.params.device_id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        if (device === false || typeof device === "undefined") {
            res.sendStatus(404);
            return
        }
        db.models.Function.getById(req.params.action_id, function (err, func) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            if (func === false || typeof func === "undefined") {
                res.sendStatus(404);
                return
            }
            logger.debug(TAG, "function_library:", func);
            db.models.Library.getById(func.function_library, function (err, library) {
                if (err) {
                    logger.error(TAG, err);
                    res.sendStatus(500);
                    return
                }
                logger.debug(TAG, "Gonna load:", "../hub_data/libraries/"+library.lib_name+"/functions", "../hub_data/interfaces/"+library.lib_interface+"/functions");
                var lib_bin = require("../hub_data/libraries/"+library.lib_name+"/functions");
                var intrfc = require("../hub_data/interfaces/"+library.lib_interface+"/functions");
                lib_bin[func.function_name](intrfc, device, function(body) {
                    res.json(body);
                });
            })
        })
    })
});

// Libraries API
router.get('/libraries', function (req, res, next) {
    db.models.Library.getAll( function (err, devices) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(devices);
    });
});
router.get('/libraries/:id', function (req, res, next) {
    db.models.Library.getById(req.params.id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(device);
    });
});

// Functions API
router.get('/functions', function (req, res, next) {
    db.models.Function.getAll( function (err, devices) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(devices);
    });
});
router.get('/functions/:id', function (req, res, next) {
    db.models.Function.getById(req.params.id, function (err, device) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(device);
    });
});

// Control panel API
router.get('/test', function (req, res, next) {
    res.sendStatus(200);
});

module.exports = router;