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
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Mateo, Arsula Porecema','BOARD OF DIRECTORS',NULL,NULL,NULL,'Mateo, Arsula Porecema.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(2,'Salvador, Jaqueline','BOARD OF DIRECTORS',NULL,NULL,NULL,'Salvador, Jaqueline.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(3,'Ladignon, Evelyn','BOARD OF DIRECTORS',NULL,NULL,NULL,'Ladignon, Evelyn.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(4,'Labios, Florida','BOARD OF DIRECTORS',NULL,NULL,NULL,'Labios, Florida.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(5,'Fernandez, Nieves','BOARD OF DIRECTORS',NULL,NULL,NULL,'Fernandez, Nieves.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(6,'Sebastian, Leticia','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sebastian, Leticia.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(7,'Eglio, Edgar P.','BOARD OF DIRECTORS',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(8,'Pascua, Arthur B.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Pascua, Arthur B..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(9,'Montano, Raquel','BOARD OF DIRECTORS',NULL,NULL,NULL,'Montano, Raquel.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(10,'Sunio, Eufrosina M.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sunio, Eufrosina M..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(11,'Consigna, Ronnie','BOARD OF DIRECTORS',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(12,'Balauag, Carmelita D.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Balauag, Carmelita D..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(13,'Sales, Elarde','BOARD OF DIRECTORS',NULL,NULL,NULL,'Sales, Elarde.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(14,'Dumlao, Joycee Lyn R.','BOARD OF DIRECTORS',NULL,NULL,NULL,'Dumlao, Joycee Lyn R..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(15,'Guillermo, Rosalinda','BOARD OF DIRECTORS',NULL,NULL,NULL,'Guillermo, Rosalinda S..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(16,'De Vera, Charito','BOARD OF DIRECTORS',NULL,NULL,NULL,'De Vera, Charito S..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(17,'Hummer, Lourder','BOARD OF DIRECTORS',NULL,NULL,NULL,'Louder, Hummer.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(18,'Baguiwong, Ernesto B.','ELECTION COMMITTEE',NULL,NULL,NULL,'Baguiwong, Ernesto B..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(19,'Victoriano, Luzviminda R.','ELECTION COMMITTEE',NULL,NULL,NULL,'Victoriano, Luzviminda R..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(20,'Comienda, Leila Gaygay','ELECTION COMMITTEE',NULL,NULL,NULL,'Comienda, Leila Gaygay.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(21,'Mapalo, Lilibeth','ELECTION COMMITTEE',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(22,'Andres, Esmeralda C.','ELECTION COMMITTEE',NULL,NULL,NULL,'Andres, Esmeralda C..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(23,'Ramiro, Jesusita M.','ELECTION COMMITTEE',NULL,NULL,NULL,'Ramiro, Jesusita M..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(24,'Guzman, Mary Jane','ELECTION COMMITTEE',NULL,NULL,NULL,'Guzman, Mary Jane.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(25,'Javier, Susana B.','AUDIT COMMITTEE',NULL,NULL,NULL,'Javier, Susana B..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(26,'Bernardo, Ofelia','AUDIT COMMITTEE',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(27,'Roberts, William','AUDIT COMMITTEE',NULL,NULL,NULL,'Roberts, William.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(28,'Nicolas, Joe S.','AUDIT COMMITTEE',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(29,'Hamili, Lea','AUDIT COMMITTEE',NULL,NULL,NULL,'Hamili, Lea.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(30,'Malana, Amy F.','AUDIT COMMITTEE',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(31,'Badua, Tenie E.','AUDIT COMMITTEE',NULL,NULL,NULL,'Badua, Tenie E..png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(32,'Tadena, Milagros L.','AUDIT COMMITTEE',NULL,NULL,NULL,'No_Image.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43'),(33,'Guzman, Mary Jane','AUDIT COMMITTEE',NULL,NULL,NULL,'Guzman, Mary Jane.png',0,'2024-03-19 14:22:43','2024-03-19 14:22:43');
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

-- Dump completed on 2024-03-20  9:15:51
