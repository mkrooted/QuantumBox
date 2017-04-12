/**
 * Created by mkrooted on 3/8/2017.
 */

const express = require('express');
const router = express.Router();
const device_manager = require("../bin/network_manager");
const library_manager = require("../bin/library_manager");
const interface_manager = require("../bin/interface_manager");
const logger = require("../bin/logger");
const db = require("../bin/database");
const TAG = "ROUTER (QUANTUMBOX)";

router.get('/', function (req, res, next) {
    db.models.Device.getAll(function(err, devices) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.render('index', {title: 'QuantumBox: Control Panel', devices: devices});
    });
});
router.get('/manager', function (req, res, next) {
    res.render('manager', {title: 'QuantumBox: Entanglement manager'});
});
router.get('/libs', function (req, res, next) {
    db.models.Library.getAll(function (err, libraries) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return;
        }
        if (libraries.length > 0) {
            libraries.forEach(function (lib) {
                lib.lib_uids = JSON.parse(lib.lib_uids);
            });
        }
        res.render('libraries', {title: 'QuantumBox: Libraries manager', libraries: libraries});
    });
});
router.get('/interfaces', function (req, res, next) {
    db.models.Interface.getAll(function (err, interfaces) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return;
        }
        for (let interfc of interfaces) {
            interfc.interface_functions = JSON.parse(interfc.interface_functions);
        }

        res.render('interfaces', {title: 'QuantumBox: Interfaces manager', interfaces: interfaces});
    });
});
router.get('/lan-scan', function (req, res, next) {
    device_manager.scan(function (err, result) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return;
            }
            res.render('lan-scan', {title: 'QuantumBox: Add device', devices: result});
        }
    );
});
router.get('/update-libs', function (req, res, nxt) {
    library_manager.loadLibraries(function (data) {
        res.json(data);
    });
});
router.get('/update-interfaces', function (req, res, nxt) {
    interface_manager.loadInterfaces(function (data) {
        res.json(data);
    });
});
router.get('/add-device', function (req, res, next) {
    if (req.query.ip) {
        db.models.Device.add({
            "dev_last_ip": req.query.ip
        }, function (err, id) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            res.redirect("/");
        })
    }
});

module.exports = router;
