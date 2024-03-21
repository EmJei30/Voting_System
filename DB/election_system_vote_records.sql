-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: erp-voting.mysql.database.azure.com    Database: election_system
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `vote_records`
--

DROP TABLE IF EXISTS `vote_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vote_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Voters_Id` varchar(255) DEFAULT NULL,
  `Voters_Name` varchar(255) DEFAULT NULL,
  `Candidate_Name` varchar(255) DEFAULT NULL,
  `Candidate_Position` varchar(255) DEFAULT NULL,
  `Voting_Duration` varchar(255) DEFAULT NULL,
  `Image_File` varchar(500) DEFAULT NULL,
  `Vote_Count` int DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote_records`
--

LOCK TABLES `vote_records` WRITE;
/*!40000 ALTER TABLE `vote_records` DISABLE KEYS */;
INSERT INTO `vote_records` VALUES (1,'3','Cardo Dalisay','Mateo, Arsula Porecema','BOARD OF DIRECTORS','6',NULL,1,'2024-03-20 05:35:39','2024-03-20 05:35:39'),(2,'3','Cardo Dalisay','Labios, Florida','BOARD OF DIRECTORS','6',NULL,1,'2024-03-20 05:35:39','2024-03-20 05:35:39'),(3,'3','Cardo Dalisay','Sebastian, Leticia','BOARD OF DIRECTORS','6',NULL,1,'2024-03-20 05:35:39','2024-03-20 05:35:39'),(4,'3','Cardo Dalisay','Pascua, Arthur B.','BOARD OF DIRECTORS','6',NULL,1,'2024-03-20 05:35:39','2024-03-20 05:35:39'),(5,'3','Cardo Dalisay','Guillermo, Rosalinda','BOARD OF DIRECTORS','6',NULL,1,'2024-03-20 05:35:40','2024-03-20 05:35:40'),(6,'1','Juan Dela Cruz','Salvador, Jaqueline','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:36:22','2024-03-20 05:36:22'),(7,'1','Juan Dela Cruz','Fernandez, Nieves','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:36:22','2024-03-20 05:36:22'),(8,'1','Juan Dela Cruz','Sales, Elarde','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:36:22','2024-03-20 05:36:22'),(9,'1','Juan Dela Cruz','Balauag, Carmelita D.','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:36:22','2024-03-20 05:36:22'),(10,'1','Juan Dela Cruz','Labios, Florida','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:36:22','2024-03-20 05:36:22'),(11,'2','Pedro Penduco','Salvador, Jaqueline','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 05:36:44','2024-03-20 05:36:44'),(12,'2','Pedro Penduco','Ladignon, Evelyn','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 05:36:44','2024-03-20 05:36:44'),(13,'2','Pedro Penduco','Labios, Florida','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 05:36:45','2024-03-20 05:36:45'),(14,'2','Pedro Penduco','Fernandez, Nieves','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 05:36:45','2024-03-20 05:36:45'),(15,'2','Pedro Penduco','Sebastian, Leticia','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 05:36:45','2024-03-20 05:36:45'),(16,'4','Data Smart','Mateo, Arsula Porecema','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:37:12','2024-03-20 05:37:12'),(17,'4','Data Smart','Ladignon, Evelyn','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:37:12','2024-03-20 05:37:12'),(18,'4','Data Smart','Sebastian, Leticia','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:37:12','2024-03-20 05:37:12'),(19,'4','Data Smart','Pascua, Arthur B.','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:37:12','2024-03-20 05:37:12'),(20,'4','Data Smart','De Vera, Charito','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:37:12','2024-03-20 05:37:12'),(21,'5','Bongbong marcos','Mateo, Arsula Porecema','BOARD OF DIRECTORS','62',NULL,1,'2024-03-20 05:39:32','2024-03-20 05:39:32'),(22,'5','Bongbong marcos','Salvador, Jaqueline','BOARD OF DIRECTORS','62',NULL,1,'2024-03-20 05:39:32','2024-03-20 05:39:32'),(23,'5','Bongbong marcos','Ladignon, Evelyn','BOARD OF DIRECTORS','62',NULL,1,'2024-03-20 05:39:32','2024-03-20 05:39:32'),(24,'5','Bongbong marcos','Labios, Florida','BOARD OF DIRECTORS','62',NULL,1,'2024-03-20 05:39:32','2024-03-20 05:39:32'),(25,'5','Bongbong marcos','Fernandez, Nieves','BOARD OF DIRECTORS','62',NULL,1,'2024-03-20 05:39:32','2024-03-20 05:39:32'),(26,'6','Leni Robredo','Mateo, Arsula Porecema','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:39:59','2024-03-20 05:39:59'),(27,'6','Leni Robredo','Salvador, Jaqueline','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:39:59','2024-03-20 05:39:59'),(28,'6','Leni Robredo','Ladignon, Evelyn','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:39:59','2024-03-20 05:39:59'),(29,'6','Leni Robredo','Fernandez, Nieves','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:40:00','2024-03-20 05:40:00'),(30,'6','Leni Robredo','Eglio, Edgar P.','BOARD OF DIRECTORS','8',NULL,1,'2024-03-20 05:40:00','2024-03-20 05:40:00'),(31,'7','Sara Duterte','Mateo, Arsula Porecema','BOARD OF DIRECTORS','14',NULL,1,'2024-03-20 05:43:07','2024-03-20 05:43:07'),(32,'7','Sara Duterte','Salvador, Jaqueline','BOARD OF DIRECTORS','14',NULL,1,'2024-03-20 05:43:07','2024-03-20 05:43:07'),(33,'7','Sara Duterte','Ladignon, Evelyn','BOARD OF DIRECTORS','14',NULL,1,'2024-03-20 05:43:07','2024-03-20 05:43:07'),(34,'7','Sara Duterte','Dumlao, Joycee Lyn R.','BOARD OF DIRECTORS','14',NULL,1,'2024-03-20 05:43:07','2024-03-20 05:43:07'),(35,'7','Sara Duterte','Guillermo, Rosalinda','BOARD OF DIRECTORS','14',NULL,1,'2024-03-20 05:43:07','2024-03-20 05:43:07'),(36,'1','Juan Dela Cruz','Mateo, Arsula Porecema','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:46:35','2024-03-20 05:46:35'),(37,'1','Juan Dela Cruz','Salvador, Jaqueline','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:46:36','2024-03-20 05:46:36'),(38,'1','Juan Dela Cruz','Ladignon, Evelyn','BOARD OF DIRECTORS','7',NULL,1,'2024-03-20 05:46:36','2024-03-20 05:46:36'),(39,'1','Juan Dela Cruz','Labios, Florida','BOARD OF DIRECTORS','10',NULL,1,'2024-03-20 05:47:08','2024-03-20 05:47:08'),(40,'1','Juan Dela Cruz','Fernandez, Nieves','BOARD OF DIRECTORS','10',NULL,1,'2024-03-20 05:47:08','2024-03-20 05:47:08'),(41,'3','Cardo Dalisay','Mateo, Arsula Porecema','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 23:58:12','2024-03-20 23:58:12'),(42,'3','Cardo Dalisay','Salvador, Jaqueline','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 23:58:12','2024-03-20 23:58:12'),(43,'3','Cardo Dalisay','Ladignon, Evelyn','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 23:58:12','2024-03-20 23:58:12'),(44,'3','Cardo Dalisay','Labios, Florida','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 23:58:12','2024-03-20 23:58:12'),(45,'3','Cardo Dalisay','Fernandez, Nieves','BOARD OF DIRECTORS','5',NULL,1,'2024-03-20 23:58:12','2024-03-20 23:58:12'),(46,'1','Juan Dela Cruz','Sebastian, Leticia','ELECTION COMMITTEE','16',NULL,1,'2024-03-20 23:59:14','2024-03-20 23:59:14'),(47,'1','Juan Dela Cruz','Eglio, Edgar P.','ELECTION COMMITTEE','16',NULL,1,'2024-03-20 23:59:14','2024-03-20 23:59:14'),(48,'1','Juan Dela Cruz','Pascua, Arthur B.','ELECTION COMMITTEE','16',NULL,1,'2024-03-20 23:59:14','2024-03-20 23:59:14'),(49,'2','Pedro Penduco','Sunio, Eufrosina M.','AUDIT COMMITTEE','7',NULL,1,'2024-03-21 00:01:18','2024-03-21 00:01:18'),(50,'2','Pedro Penduco','Consigna, Ronnie','AUDIT COMMITTEE','7',NULL,1,'2024-03-21 00:01:18','2024-03-21 00:01:18'),(51,'2','Pedro Penduco','Montano, Raquel','AUDIT COMMITTEE','7',NULL,1,'2024-03-21 00:01:18','2024-03-21 00:01:18'),(52,'7','Sara Duterte','Fernandez, Nieves','BOARD OF DIRECTORS','9',NULL,1,'2024-03-21 00:03:19','2024-03-21 00:03:19'),(53,'7','Sara Duterte','Labios, Florida','BOARD OF DIRECTORS','9',NULL,1,'2024-03-21 00:03:19','2024-03-21 00:03:19');
/*!40000 ALTER TABLE `vote_records` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-21  8:41:59
