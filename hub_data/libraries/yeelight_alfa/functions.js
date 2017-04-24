module.exports.powered_on = function (hard_interface, device, callback) {
    var data = {
        "id": 0,
        "method": "get_prop",
        "params": ["name"]
    };

    hard_interface.POST_json(device.dev_address, 55443, '/', JSON.stringify(data), callback)
};
module.exports.light_on = function (hard_interface, device, callback) {
    var data = {
        "id": 0,
        "method": "set_power",
        "params": ["on"]
    };

    hard_interface.POST_json(device.dev_address, 55443, '/', JSON.stringify(data), callback)
};
module.exports.light_off = function (hard_interface, device, callback) {
    var data = {
        "id": 0,
        "method": "set_power",
        "params": ["off"]
    };

    hard_interface.POST_json(device.dev_address, 55443, '/', JSON.stringify(data), callback)
};