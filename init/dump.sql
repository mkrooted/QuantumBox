-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: qboxhub
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `dev_id` int(11) NOT NULL AUTO_INCREMENT,
  `dev_mac` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dev_address` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dev_vendor` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dev_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dev_hash` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dev_uid` varchar(64) COLLATE utf8_unicode_ci DEFAULT 'aaaa-aaaa-aaaa-aaaa',
  PRIMARY KEY (`dev_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` (`dev_id`, `dev_mac`, `dev_address`, `dev_vendor`, `dev_name`, `dev_hash`, `dev_uid`) VALUES (1,'AA:AA:AA:AA:AA:AA','192.168.1.23','QThing','Executor1',NULL,'aaaa-aaaa-aaaa-aaaa');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entanglements`
--

DROP TABLE IF EXISTS `entanglements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entanglements` (
  `entanglement_id` int(11) NOT NULL AUTO_INCREMENT,
  `entanglement_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `trigger_device` int(11) DEFAULT NULL,
  `trigger_function` int(11) DEFAULT NULL,
  `trigger_args` json DEFAULT NULL,
  `executor_device` int(11) DEFAULT NULL,
  `executor_function` int(11) DEFAULT NULL,
  `executor_args` json DEFAULT NULL,
  `is_active` char(1) COLLATE utf8_unicode_ci DEFAULT 'Y',
  PRIMARY KEY (`entanglement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entanglements`
--

LOCK TABLES `entanglements` WRITE;
/*!40000 ALTER TABLE `entanglements` DISABLE KEYS */;
/*!40000 ALTER TABLE `entanglements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `functions` (
  `function_id` int(11) NOT NULL AUTO_INCREMENT,
  `function_library` int(11) NOT NULL,
  `function_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `function_type` char(3) COLLATE utf8_unicode_ci DEFAULT 'OTH',
  PRIMARY KEY (`function_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` (`function_id`, `function_library`, `function_name`, `function_type`) VALUES (1,1,'hello','SYS'),(2,1,'get_status','GET'),(3,1,'light_on','ACT'),(4,1,'light_off','ACT'),(5,2,'acknowledge','SYS'),(6,2,'getState','GET'),(7,2,'toggleMode','ACT');
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interfaces`
--

DROP TABLE IF EXISTS `interfaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `interfaces` (
  `interface_id` int(11) NOT NULL AUTO_INCREMENT,
  `interface_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `interface_functions` json DEFAULT NULL,
  `interface_is_active` char(1) COLLATE utf8_unicode_ci DEFAULT 'Y',
  PRIMARY KEY (`interface_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interfaces`
--

LOCK TABLES `interfaces` WRITE;
/*!40000 ALTER TABLE `interfaces` DISABLE KEYS */;
INSERT INTO `interfaces` (`interface_id`, `interface_name`, `interface_functions`, `interface_is_active`) VALUES (1,'wifi','[\"GET_json(device_ip, path, requestId)\", \"GET_string(device_ip, path, requestId)\"]','Y');
/*!40000 ALTER TABLE `interfaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libraries`
--

DROP TABLE IF EXISTS `libraries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libraries` (
  `lib_id` int(11) NOT NULL AUTO_INCREMENT,
  `lib_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lib_interface` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `lib_uids` json DEFAULT NULL,
  `lib_is_active` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`lib_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libraries`
--

LOCK TABLES `libraries` WRITE;
/*!40000 ALTER TABLE `libraries` DISABLE KEYS */;
INSERT INTO `libraries` (`lib_id`, `lib_name`, `lib_interface`, `lib_uids`, `lib_is_active`) VALUES (1,'led_library','wifi','[\"aaaa-aaaa-aaaa-aaaa\", \"bbbb-bbbb-bbbb-bbbb\", \"cccc-cccc-cccc-cccc\"]','Y'),(2,'button_library','wifi','[\"1111-2222-3333-4444\", \"9999-8888-7777-6666\", \"1223-3445-5667-7889\"]','Y');
/*!40000 ALTER TABLE `libraries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-19  0:21:46
