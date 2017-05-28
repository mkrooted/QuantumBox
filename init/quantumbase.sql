PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
CREATE TABLE devices (
  dev_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  dev_mac     VARCHAR(64),
  dev_address VARCHAR(64) NOT NULL,
  dev_vendor  VARCHAR(64),
  dev_name    VARCHAR(64),
  dev_hash    VARCHAR(64),
  dev_uid     VARCHAR(64) NOT NULL
);
CREATE TABLE functions (
  function_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  function_library INT         NOT NULL,
  function_name    VARCHAR(64) NOT NULL,
  function_title   VARCHAR(255),
  function_type    CHAR(3)     NOT NULL
);
CREATE TABLE interfaces (
  interface_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  interface_name       VARCHAR(64) NOT NULL,
  interface_functions  TEXT        NOT NULL,
  interface_is_virtual CHAR(1)     NOT NULL DEFAULT 'N',
  interface_is_active  CHAR(1)     NOT NULL DEFAULT 'Y'
);
CREATE TABLE libraries (
  lib_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  lib_name      VARCHAR(64) NOT NULL,
  lib_title     VARCHAR(255),
  lib_interface VARCHAR(32) NOT NULL,
  lib_uids      TEXT        NOT NULL,
  lib_is_active CHAR(1)     NOT NULL
);
COMMIT;
