/**
 * Created by kores on 12.03.2017.
 */

const express = require('express');
const router = express.Router();
const device_manager = require("../bin/network_manager");
const library_manager = require("../bin/library_manager");
const interface_manager = require("../bin/interface_manager");
const logger = require("../bin/logger");
const db = require("../bin/database");
const TAG = "ROUTER (API)";

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


module.exports = router;