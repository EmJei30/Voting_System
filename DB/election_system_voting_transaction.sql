-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: election_system
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `voting_transaction`
--

DROP TABLE IF EXISTS `voting_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voting_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Voting_Position` varchar(255) DEFAULT NULL,
  `Voting_Start_Date` date DEFAULT NULL,
  `Voting_Start_Time` time DEFAULT NULL,
  `Voting_End_Date` date DEFAULT NULL,
  `Voting_End_Time` time DEFAULT NULL,
  `Voting_Status` varchar(255) DEFAULT NULL,
  `Created_At` datetime DEFAULT NULL,
  `Updated_At` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voting_transaction`
--

LOCK TABLES `voting_transaction` WRITE;
/*!40000 ALTER TABLE `voting_transaction` DISABLE KEYS */;
INSERT INTO `voting_transaction` VALUES (1,'BOARD OF DIRECTORS','2024-03-20','18:34:00','2024-03-20','18:35:00','Closed','2024-03-20 18:33:24','2024-03-20 18:33:24'),(2,'BOARD OF DIRECTORS','2024-03-20','20:00:00','2024-03-20','21:00:00','Closed','2024-03-20 20:06:55','2024-03-20 20:06:55'),(3,'BOARD OF DIRECTORS','2024-03-20','21:00:00','2024-03-20','22:00:00','Closed','2024-03-20 20:55:04','2024-03-20 20:55:04'),(4,'ELECTION COMMITTEE','2024-03-20','21:45:00','2024-03-20','22:00:00','Closed','2024-03-20 21:44:29','2024-03-20 21:44:29'),(5,'ELECTION COMMITTEE','2024-03-20','22:01:00','2024-03-20','22:30:00','Closed','2024-03-20 22:00:33','2024-03-20 22:00:33'),(6,'ELECTION COMMITTEE','2024-03-20','22:11:00','2024-03-20','22:14:00','Closed','2024-03-20 22:10:10','2024-03-20 22:10:10'),(8,'ELECTION COMMITTEE','2024-03-20','22:57:00','2024-03-20','06:00:00','Closed','2024-03-20 22:58:40','2024-03-20 22:58:40'),(9,'ELECTION COMMITTEE','2024-03-20','20:00:00','2024-03-21','00:00:00','Closed','2024-03-20 23:01:01','2024-03-20 23:01:01'),(11,'ALL','2024-03-20','23:00:00','2024-03-21','12:00:00','Closed','2024-03-20 23:06:35','2024-03-20 23:06:35'),(12,'BOARD OF DIRECTORS','2024-03-20','23:10:00','2024-03-21','00:00:00','Closed','2024-03-20 23:10:11','2024-03-20 23:10:11'),(13,'ELECTION COMMITTEE','2024-03-20','23:11:00','2024-03-21','00:00:00','Closed','2024-03-20 23:11:33','2024-03-20 23:11:33'),(14,'AUDIT COMMITTEE','2024-03-20','23:16:00','2024-03-21','00:00:00','Closed','2024-03-20 23:18:06','2024-03-20 23:18:06'),(15,'BOARD OF DIRECTORS','2024-03-21','06:15:00','2024-03-21','06:20:00','Closed','2024-03-21 06:15:55','2024-03-21 06:15:55'),(16,'ELECTION COMMITTEE','2024-03-21','06:18:00','2024-03-21','06:20:00','Closed','2024-03-21 06:19:06','2024-03-21 06:19:06'),(17,'AUDIT COMMITTEE','2024-03-21','06:25:00','2024-03-21','06:30:00','Closed','2024-03-21 06:25:37','2024-03-21 06:25:37'),(18,'BOARD OF DIRECTORS','2024-03-21','06:00:00','2024-03-21','19:00:00','Closed','2024-03-21 06:38:27','2024-03-21 06:38:27'),(19,'ELECTION COMMITTEE','2024-03-21','06:00:00','2024-03-21','19:00:00','Closed','2024-03-21 06:39:42','2024-03-21 06:39:42'),(20,'AUDIT COMMITTEE','2024-03-21','06:00:00','2024-03-21','19:00:00','Closed','2024-03-21 06:42:00','2024-03-21 06:42:00'),(21,'BOARD OF DIRECTORS','2024-03-21','19:22:00','2024-03-21','19:30:00','Closed','2024-03-21 19:21:15','2024-03-21 19:21:15'),(22,'ELECTION COMMITTEE','2024-03-21','19:45:00','2024-03-21','20:00:00','Closed','2024-03-21 19:44:10','2024-03-21 19:44:10'),(23,'ELECTION COMMITTEE','2024-03-21','19:48:00','2024-03-21','20:00:00','Closed','2024-03-21 19:47:26','2024-03-21 19:47:26'),(24,'BOARD OF DIRECTORS','2024-03-21','20:07:00','2024-03-21','20:10:00','Closed','2024-03-21 20:06:46','2024-03-21 20:06:46'),(25,'ELECTION COMMITTEE','2024-03-21','20:10:00','2024-03-21','20:20:00','Closed','2024-03-21 20:09:39','2024-03-21 20:10:02'),(26,'ELECTION COMMITTEE','2024-03-21','20:16:00','2024-03-21','21:00:00','Closed','2024-03-21 20:15:51','2024-03-21 20:15:51'),(27,'ELECTION COMMITTEE','2024-03-21','20:18:00','2024-03-21','21:00:00','Closed','2024-03-21 20:17:40','2024-03-21 20:17:40'),(28,'ELECTION COMMITTEE','2024-03-21','20:38:00','2024-03-21','21:00:00','Closed','2024-03-21 20:37:22','2024-03-21 20:37:22'),(29,'ELECTION COMMITTEE','2024-03-21','20:47:00','2024-03-21','21:00:00','Closed','2024-03-21 20:46:14','2024-03-21 20:46:14'),(30,'ELECTION COMMITTEE','2024-03-21','20:50:00','2024-03-21','21:00:00','Closed','2024-03-21 20:49:31','2024-03-21 20:49:31'),(31,'ELECTION COMMITTEE','2024-03-21','20:51:00','2024-03-21','21:00:00','Closed','2024-03-21 20:50:57','2024-03-21 20:50:57'),(32,'ELECTION COMMITTEE','2024-03-21','20:51:00','2024-03-21','21:00:00','Closed','2024-03-21 20:53:35','2024-03-21 20:53:35'),(33,'ELECTION COMMITTEE','2024-03-21','20:57:00','2024-03-21','21:00:00','Closed','2024-03-21 20:56:25','2024-03-21 20:56:25'),(34,'ELECTION COMMITTEE','2024-03-21','21:00:00','2024-03-21','21:05:00','Closed','2024-03-21 20:59:48','2024-03-21 20:59:48'),(35,'ELECTION COMMITTEE','2024-03-21','21:01:00','2024-03-21','21:10:00','Closed','2024-03-21 21:00:34','2024-03-21 21:00:34'),(36,'ELECTION COMMITTEE','2024-03-21','21:03:00','2024-03-21','22:00:00','Closed','2024-03-21 21:03:25','2024-03-21 21:03:25'),(37,'ELECTION COMMITTEE','2024-03-21','21:07:00','2024-03-21','21:40:00','Closed','2024-03-21 21:06:57','2024-03-21 21:06:57'),(38,'AUDIT COMMITTEE','2024-03-21','21:10:00','2024-03-21','21:15:00','Closed','2024-03-21 21:09:25','2024-03-21 21:09:25'),(39,'BOARD OF DIRECTORS','2024-03-21','21:17:00','2024-03-21','22:00:00','Closed','2024-03-21 21:20:12','2024-03-21 21:20:12'),(40,'AUDIT COMMITTEE','2024-03-21','21:43:00','2024-03-21','22:00:00','Closed','2024-03-21 21:42:57','2024-03-21 21:42:57'),(41,'ELECTION COMMITTEE','2024-03-21','21:59:00','2024-03-21','23:00:00','Closed','2024-03-21 21:58:41','2024-03-21 21:58:41'),(42,'ELECTION COMMITTEE','2024-03-21','22:02:00','2024-03-21','23:00:00','Closed','2024-03-21 22:01:10','2024-03-21 22:01:10'),(43,'AUDIT COMMITTEE','2024-03-21','22:32:00','2024-03-21','23:00:00','Closed','2024-03-21 22:31:21','2024-03-21 22:31:21'),(44,'AUDIT COMMITTEE','2024-03-21','22:36:00','2024-03-21','23:00:00','Closed','2024-03-21 22:36:06','2024-03-21 22:36:06');
/*!40000 ALTER TABLE `voting_transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-21 22:48:31
