const express = require('express');
const async = require("async");
const device_manager = quantum_module("network_manager");
const library_manager = quantum_module("library_manager");
const interface_manager = quantum_module("interface_manager");
const logger = quantum_module("logger");
const db = quantum_module("database");
const executor = quantum_module("executor");
const router = express.Router();
const TAG = "ROUTER (QUANTUMBOX)";

router.get('/', function (req, res) {
    db.models.Device.getAll(function (err, devices) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return
        }

        let compiled_actions = {};
        async.each(devices, function (dev, cb) {
            db.models.Device.getActions(dev.dev_id, function (err, actions) {
                if (err) {
                    logger.error(TAG + ": In '/'.async.each", err);
                    cb(err);
                    return
                }
                let valid_functions = [];


                for (let func of actions) {
                    if (func.function_type === "ACT") {
                        valid_functions.push(func);
                    }
                }

                compiled_actions[dev.dev_id] = valid_functions;
                cb();
            })
        }, function (err) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            devices.map(function (item) {
                item.actions = compiled_actions[item.dev_id];
            });

            // logger.debug(TAG, devices);

            res.render('index', {title: 'QuantumBox: Control Panel', devices: devices});
        });
    });
});
router.get('/manual-add', function(req, res){
    res.render('manual-add', {title: "New device"});
});
router.get('/manager', function (req, res) {
    res.render('manager', {title: 'QuantumBox: Entanglement manager'});
});
router.get('/libs', function (req, res) {
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
router.get('/interfaces', function (req, res) {
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
router.get('/lan-scan', function (req, res) {
    device_manager.scan(function (err, result) {
        if (err) {
            logger.error(TAG, err);
            res.sendStatus(500);
            return;
        }
        db.models.Device.getAll(function (err, db_devices) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return;
            }

            let devices = [];
            for (let item of result) {
                let found = false;
                for (let dev of db_devices) {
                    if (item.addr === dev.dev_address) {
                        found = true;
                        break
                    }
                }
                if (found) {
                    continue
                }
                devices.push(item)
            }

            res.render('lan-scan', {title: 'QuantumBox: Add device', devices: devices});
        });
    });
});
router.get('/update-libs', function (req, res) {
    library_manager.loadLibraries(function (data) {
        logger.log(TAG, data);
        res.redirect('/libs');
    });
});
router.get('/update-interfaces', function (req, res) {
    interface_manager.loadInterfaces(function (data) {
        logger.log(TAG, data);
        res.redirect('/interfaces');
    });
});
router.get('/dev-add', function (req, res) {
    if (req.query.addr && req.query.mac && req.query.vendor) {
        db.models.Library.getAll(function (err, libs) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            libs.map(function (lib) {
                lib.lib_uids = JSON.parse(lib.lib_uids)
            });
            res.render('dev-add', {
                device: {
                    dev_vendor: req.query.vendor,
                    dev_mac: req.query.mac,
                    dev_address: req.query.addr
                },
                libraries: libs
            })
        });
    }
});
router.get('/add-device', function (req, res) {
    if (req.query.addr && req.query.mac && req.query.vendor) {
        db.models.Device.add({
            "dev_address": req.query.addr,
            "dev_mac": req.query.mac,
            "dev_vendor": req.query.vendor,
            "dev_uid": req.query.uid
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
router.post('/edit-device/:id', function (req, res) {
    if (req.params.id) {
        let device = {
            dev_mac: req.body.dev_mac,
            dev_address: req.body.dev_address,
            dev_uid: req.body.dev_uid,
            dev_vendor: req.body.dev_vendor,
            dev_name: req.body.dev_name,
        };

        db.models.Device.update(req.params.id, device, function (err) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            res.redirect("/edit-device/" + req.params.id)
        })
    }
});
router.get('/edit-device/:id', function (req, res) {
    if (req.params.id) {
        db.models.Device.getById(req.params.id, function (err, device) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }

            if (!device.dev_name) {
                device.dev_name = device.dev_vendor + " Device";
            }

            res.render('dev-edit', {title: "Device " + device.dev_name, device: device})
        });
    } else {
        res.sendStatus(404);
    }
});
router.get('/delete-device/:id', function (req, res) {
    if (req.params.id) {
        db.models.Device.deleteById(req.params.id, function (err, device) {
            if (err) {
                logger.error(TAG, err);
                res.sendStatus(500);
                return
            }
            res.redirect('/');
        });
    } else {
        res.sendStatus(404);
    }
});

router.get('/execute', function (req, res) {
    if (req.query.dev_id && req.query.act_id) {
        executor.execute_action(req.query.dev_id, req.query.act_id, function (err, result) {
            if (err) {
                logger.error(TAG, err);
            }
        })
    } else {
        logger.error(TAG, "Trying to '/execute' with no arguments from " + req.ip + "!");
    }
    res.redirect('/')
});

module.exports = router;
