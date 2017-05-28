## Here we write as many changes made as possible

### Version 0.2.0
On 28.05.2017

Yay! Our project is successfully migrated to SQLite DBMS! This decision was made primarily because of high computational power requirements and unneeded complexity of MySQL.
Also we are making first steps to public API - now using fashionable wrappers for "require" statements which eliminate paths like "./../../.."
* Major: Migration to SQLite. Redesigned database API.
* Structure: Now all modules that planned to be used in public API moved to bin/public
* Add: Prerequisites checking on startup (database connection, nmap availability)
* Add: Special wrappers "quantum_module" for bin/public, "quantum_config" for configs/, "quantum_library" for libraries and "quantum_interface" for interfaces
* Fix: Callback issues in database.js
* Move: Main startup script /bin/www to /boot.js
* Cleanup: A lot.
    * Less strange files in project
    * Less strange modules in package.json
    * Less strange ECMAScript5-like code
    * More strange ECMAScript6-like code
    * Improved style of every source code file
    * Eventually contains working sql dump file!

### Version 0.1.4
On 28.05.2017
* Critical: Localized and fixed bug appeared in case of no or invalid response from endpoint devices in "wifi" interface
* Minor: Now using custom http parser (http-parser-js)
* Add: configs/general.js for general settings. Now contains endpoint request timeout
* Add: Now user can add device manually from admin interface
* Add: Virtual interface "https". Now is used only with workarounds. True virtual interfaces are going to arrive in next versions
* Move: routes/Common.js to bin/executor.js
* Project: Now version number is also in package.json

### Version 0.1.3
On 29.04.2017
* Minor fixes, optimization and cleanup

### Version 0.1.2
On 24.04.2017
* QuantumBox proudly presents new Library for "Xiaomi Yeelight White Bulb"
* Change: Argument "port" for wifi functions
* Change: Now user need to select libray and uid before adding new device
* Change: Quick actions on index page
* Add: Field "acknowledge_func" in library.json
* Add: Function "POST_json" in wifi library
* Add: database.models.Device.update
* Cleanup: removed "request_id" argument from arguments list in interface.json

### Version 0.1.1 
On 18.04.2017
* Change: Renamed all IP into Address. Now any suitable address should be stored in db, not only ip
* Add: "Delete device"
* Add: "Edit device"
* Fix: Typo in deleteDeviceById()
* Fix: Error handling in deleteDeviceById()
* Fix: Error handling in some routes
* Fix: Now libraries' and interfaces' header files don't have "events" section, now using callbacks
* Cleanup: Do not need "bluetooth" and "button_library" any more
* Project: Directory init with MySQL Dump File for rapid database setup
