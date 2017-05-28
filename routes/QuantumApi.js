const express = require('express');
const async = require("async");
const network_manager = quantum_module("network_manager");
const library_manager = quantum_module("library_manager");
const interface_manager = quantum_module("interface_manager");
const executor = quantum_module("executor");
const logger = quantum_module("logger");
const db = quantum_module("database");
const router = express.Router();
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
    db.models.Device.getUserActions(req.params.id, function (err, funcs) {
        if(err){
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }
        res.json(funcs);
    })
});
router.post('/devices/:device_id/actions/:action_id', function (req, res, nxt) {
    executor.execute_action(req.params.device_id, req.params.action_id, function (err, result) {
        if (err) {
            logger.error(TAG, err);
            res.render('error', {message: "500 Something gone wrong", error: err});
            return
        }
        res.json(result);
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