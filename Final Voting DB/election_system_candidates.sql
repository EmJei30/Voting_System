-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: election_system
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Candidate_Name` varchar(255) DEFAULT NULL,
  `Candidate_Position` varchar(255) DEFAULT NULL,
  `Candidate_Address` varchar(255) DEFAULT NULL,
  `Candidate_Incumbent` varchar(255) DEFAULT NULL,
  `Reserved_Position` varchar(255) DEFAULT NULL,
  `Image_File` varchar(500) DEFAULT NULL,
  `Vote_Count` int DEFAULT NULL,
  `Is_Multi_Run` varchar(255) DEFAULT NULL,
  `Voting_Status` varchar(255) DEFAULT NULL,
  `Is_Original` varchar(255) DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Pascua, Arthur B.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Pascua, Arthur B..png',63,'Yes','Elected','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(2,'Sunio, Eufrosina M.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sunio, Eufrosina M..png',35,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(3,'Guillermo, Rosalinda','BOARD OF DIRECTORS',NULL,NULL,NULL,'Guillermo, Rosalinda S..png',60,'Yes','Elected','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(4,'De Vera, Charito','BOARD OF DIRECTORS',NULL,NULL,NULL,'De Vera, Charito S..png',95,'Yes','Elected','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(5,'Mateo, Arsula Porecema','BOARD OF DIRECTORS',NULL,NULL,NULL,'Mateo, Arsula Porecema.png',55,'Yes','Elected','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(6,'Fernandez, Nieves','BOARD OF DIRECTORS',NULL,NULL,NULL,'Fernandez, Nieves.png',12,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(7,'Sebastian, Leticia','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sebastian, Leticia.png',44,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(8,'Salvador, Jaqueline','BOARD OF DIRECTORS',NULL,NULL,NULL,'Salvador, Jaqueline.png',46,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(9,'Hummer, Lourder','BOARD OF DIRECTORS',NULL,NULL,NULL,'Louder, Hummer.png',6,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(10,'Nantes, Manuel','BOARD OF DIRECTORS',NULL,NULL,NULL,'Nantes, Manuel.png',47,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(11,'Santiago, Lopito','BOARD OF DIRECTORS',NULL,NULL,NULL,'Santiago, Lopito.png',52,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(12,'Cue, Frank G.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Cue, Frank G..png',38,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(13,'Sales, Elarde','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sales, Elarde.png',44,'Yes','Done','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(14,'Ladignon, Evelyn','BOARD OF DIRECTORS',NULL,NULL,NULL,'Ladignon, Evelyn.png',56,'Yes','Elected','Original','2024-03-23 11:17:05','2024-03-25 07:47:06'),(15,'Ramiro, Jesusita M.','ELECTION COMMITTEE',NULL,NULL,NULL,'Ramiro, Jesusita M..png',48,NULL,'Elected','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(16,'Andres, Esmeralda C.','ELECTION COMMITTEE',NULL,NULL,NULL,'Andres, Esmeralda C..png',22,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(17,'Baguiwong, Ernesto B.','ELECTION COMMITTEE',NULL,NULL,NULL,'Baguiwong, Ernesto B..png',32,NULL,'Elected','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(18,'Comienda, Leila Gaygay','ELECTION COMMITTEE',NULL,NULL,NULL,'Comienda, Leila Gaygay.png',4,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(19,'Victoriano, Luzviminda R.','ELECTION COMMITTEE',NULL,NULL,NULL,'Victoriano, Luzviminda R..png',20,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(20,'Guzman, Mary Jane','ELECTION COMMITTEE',NULL,NULL,NULL,'Guzman, Mary Jane.png',41,NULL,'Elected','Original','2024-03-23 11:17:05','2024-03-25 09:11:01'),(21,'Javier, Susana B.','AUDIT COMMITTEE',NULL,NULL,NULL,'Javier, Susana B..png',30,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 08:20:31'),(22,'Roberts, William','AUDIT COMMITTEE',NULL,NULL,NULL,'Roberts, William.png',17,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 08:20:31'),(23,'Badua, Tenie E.','AUDIT COMMITTEE',NULL,NULL,NULL,'Badua, Tenie E..png',14,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 08:20:31'),(24,'Hamili, Lea','AUDIT COMMITTEE',NULL,NULL,NULL,'Hamili, Lea.png',23,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 08:20:31'),(25,'Guzman, Mary Jane','AUDIT COMMITTEE',NULL,NULL,NULL,'Guzman, Mary Jane.png',22,NULL,'Done','Original','2024-03-23 11:17:05','2024-03-25 08:20:31'),(26,'Sunio, Eufrosina M.','ELECTION COMMITTEE',NULL,NULL,NULL,'Sunio, Eufrosina M..png',25,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(27,'Fernandez, Nieves','ELECTION COMMITTEE',NULL,NULL,NULL,'Fernandez, Nieves.png',4,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(28,'Sebastian, Leticia','ELECTION COMMITTEE',NULL,NULL,NULL,'Sebastian, Leticia.png',13,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(29,'Salvador, Jaqueline','ELECTION COMMITTEE',NULL,NULL,NULL,'Salvador, Jaqueline.png',21,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(30,'Hummer, Lourder','ELECTION COMMITTEE',NULL,NULL,NULL,'Louder, Hummer.png',2,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(31,'Nantes, Manuel','ELECTION COMMITTEE',NULL,NULL,NULL,'Nantes, Manuel.png',23,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(32,'Santiago, Lopito','ELECTION COMMITTEE',NULL,NULL,NULL,'Santiago, Lopito.png',28,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(33,'Cue, Frank G.','ELECTION COMMITTEE',NULL,NULL,NULL,'Cue, Frank G..png',16,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(34,'Sales, Elarde','ELECTION COMMITTEE',NULL,NULL,NULL,'Sales, Elarde.png',23,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 09:11:01'),(35,'Sunio, Eufrosina M.','AUDIT COMMITTEE',NULL,NULL,NULL,'Sunio, Eufrosina M..png',35,'Yes','Elected','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(36,'Fernandez, Nieves','AUDIT COMMITTEE',NULL,NULL,NULL,'Fernandez, Nieves.png',2,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(37,'Sebastian, Leticia','AUDIT COMMITTEE',NULL,NULL,NULL,'Sebastian, Leticia.png',6,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(38,'Salvador, Jaqueline','AUDIT COMMITTEE',NULL,NULL,NULL,'Salvador, Jaqueline.png',22,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(39,'Hummer, Lourder','AUDIT COMMITTEE',NULL,NULL,NULL,'Louder, Hummer.png',2,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(40,'Nantes, Manuel','AUDIT COMMITTEE',NULL,NULL,NULL,'Nantes, Manuel.png',33,'Yes','Elected','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(41,'Santiago, Lopito','AUDIT COMMITTEE',NULL,NULL,NULL,'Santiago, Lopito.png',38,'Yes','Elected','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(42,'Cue, Frank G.','AUDIT COMMITTEE',NULL,NULL,NULL,'Cue, Frank G..png',13,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31'),(43,'Sales, Elarde','AUDIT COMMITTEE',NULL,NULL,NULL,'Sales, Elarde.png',31,'Yes','Done','','2024-03-23 03:17:05','2024-03-25 08:20:31');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-26  7:54:50
