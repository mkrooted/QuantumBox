/**
 * Created by mkrooted on 2/21/2017.
 */


module.exports.hello = function (hard_interface, device, callback) {
    hard_interface.GET_json(device.dev_last_ip, "/hello", callback);
};

module.exports.get_status = function (hard_interface, device, callback) {
    hard_interface.GET_string(device.dev_last_ip, "/get_status", function (body) {
        callback((body == "1"));
    });
};

module.exports.light_on = function (hard_interface, device, callback) {
    hard_interface.GET_string(device.dev_last_ip, "/light_on", callback);
};

module.exports.light_off = function (hard_interface, device, callback) {
    hard_interface.GET_string(device.dev_last_ip, "/light_off", callback);
};
