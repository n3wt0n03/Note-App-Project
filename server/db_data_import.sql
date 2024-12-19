-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: note_taking_db
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `notes_count` int NOT NULL,
  `order_index` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (19,'Uncategorized','#8b4b4b',3,1),(40,'Work','#9b3131',5,3),(41,'asdfasfd','#ba3b3b',1,2),(42,'Eating','#e000c6',2,0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `user_id` bigint NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (2,'Meeting Notes','Discussed project timelines, deliverables, and assigned tasks. Follow-up scheduled for next week.','2024-12-12',23,NULL,NULL,NULL),(23,'asdf','asfdsadfaf','2024-12-10',23,NULL,NULL,NULL),(125,'Updated Meeting Notes','Discuss Q1 and Q2 targets','2024-12-16',22,'#33FF57',40,NULL),(127,'adfasfd','sadf','2024-12-15',22,'#e1bee7',40,NULL),(128,'asdfasfd','asdfasdfasfa','2024-12-15',22,'#e1bee7',40,NULL),(129,'ASDFSF','ASDFASFD','2024-12-15',22,'#ffffff',40,NULL),(130,'SADFSAF','ASDFASDF','2024-12-15',22,'#e1bee7',19,NULL),(131,'Marc gana kka hap','marc nelson ochavo<div><br></div>','2024-12-19',27,'#e1bee7',19,NULL),(132,'Hello World','Gana pls','2024-12-15',27,'#e1bee7',42,NULL),(133,'Eat a full eating','Hello eating shiiiiisss','2024-12-15',27,'#daae61',42,NULL),(134,'Hello','hello','2024-12-18',27,'#ffffff',19,NULL);
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'jadenceniza77@gmail.com','$2a$10$5WuXa308dh6SJ5xtoqtNYesIGd6V2T8crA8SdpCJjq2FYLKTXUmc2','jaden','Lorem Ipsum\n','Jaden','Ceniza','+63 9912088238'),(23,'22102267@usc.edu.ph','$2a$10$Qq81k6ilIViVJD6pwqjvWuEmv7/j/rqNI24JI1XcnQJrtfsIYjPza','McNugget77',NULL,NULL,NULL,NULL),(24,'admin@gmail.com','$2a$10$JWp.d/hrO2cvNXrCT4yrT.cq2fhtjGwX6EkaW20p5AJKLki2ItfLm','admin',NULL,NULL,NULL,NULL),(25,'sadfasf@gmail.com','$2a$10$FLRtJerrSBPHxCuIr2ThPOICmTb6aAx/2WWC6vUo3SgWETG4qyRwy','eafsa',NULL,NULL,NULL,NULL),(26,'test@example.com','$2a$10$TyuonAkspT/RbJ/OF28LnON6OO8RdtzkuZkx5Wciys3PhKCaE7M6y','testuser',NULL,NULL,NULL,NULL),(27,'marcnelsonochavo@gmail.com','$2a$10$GWgi015DDwvevp9zxWUZWeiIJX6sQCjVtPCrLhU5gnlxfrfRpu9Q.','kyuki','Hello World','Marc','Nelson','09876856767'),(28,'test_newton@gmail.com','$2a$10$kSucf4C6fg4j3nfIkZiT9.gbz6BdWdNPHYEHxw.7kaIq2EmHq06q2','NewtonOchavo',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-20  0:38:21
