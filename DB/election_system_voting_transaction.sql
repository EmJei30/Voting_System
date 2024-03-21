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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voting_transaction`
--

LOCK TABLES `voting_transaction` WRITE;
/*!40000 ALTER TABLE `voting_transaction` DISABLE KEYS */;
INSERT INTO `voting_transaction` VALUES (1,'BOARD OF DIRECTORS','2024-03-20','13:35:00','2024-03-20','18:00:00','Closed','2024-03-20 13:34:12','2024-03-20 13:34:12'),(2,'ALL','2024-03-20','13:55:00','2024-03-20','18:00:00','Closed','2024-03-20 13:54:46','2024-03-20 13:54:46'),(3,'BOARD OF DIRECTORS','2024-03-20','15:28:00','2024-03-20','17:30:00','Closed','2024-03-20 15:27:45','2024-03-20 15:27:45'),(4,'BOARD OF DIRECTORS','2024-03-21','06:00:00','2024-03-21','09:00:00','Closed','2024-03-21 07:58:00','2024-03-21 07:58:00'),(5,'ELECTION COMMITTEE','2024-03-21','06:00:00','2024-03-21','21:00:00','Closed','2024-03-21 07:58:51','2024-03-21 07:58:51'),(6,'AUDIT COMMITTEE','2024-03-21','08:00:00','2024-03-21','21:00:00','Closed','2024-03-21 08:00:53','2024-03-21 08:00:53'),(7,'BOARD OF DIRECTORS','2024-03-21','08:00:00','2024-03-21','21:00:00','Closed','2024-03-21 08:02:43','2024-03-21 08:02:43');
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

-- Dump completed on 2024-03-21  8:41:57
