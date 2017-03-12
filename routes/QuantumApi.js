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

// Libraries section
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

// Functions section
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

module.exports = router;