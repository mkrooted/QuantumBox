## Here we write as many changes made as possible

### Version 0.1.2
On 24.04.2017
* Major: New Library for Xiaomi Yeelight Bulb
    * powered_on
    * light_on
    * light_off
* Change: Argument "port" for wifi functions
* Change: Now user need to select libray and uid before adding new device
* Change: Quick actions on index page
* Add: Field "acknowledge_func" in library.json
* Add: Function "POST_json" in wifi library
* Add: database.models.Device.update
* Cleanup: removed "request_id" argument from arguments list in interface.json

### Version 0.1.1 
On 18.04.2017
* Major: Renamed all IP into Address. Now any suitable address should be stored in db, not only ip
* Add: "Delete device"
* Add: "Edit device"
* Fix: Typo in deleteDeviceById()
* Fix: Error handling in deleteDeviceById()
* Fix: Error handling in some routes
* Fix: Now libraries' and interfaces' header files don't have "events" section, now using callbacks
* Cleanup: Do not need "bluetooth" and "button_library" any more
* Project: Directory init with MySQL Dump File for rapid database setup
