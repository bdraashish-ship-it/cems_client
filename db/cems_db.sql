-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2026 at 06:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cems_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alembic_version`
--

CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alembic_version`
--

INSERT INTO `alembic_version` (`version_num`) VALUES
('f75e3f506516');

-- --------------------------------------------------------

--
-- Table structure for table `client_documents_tb`
--

CREATE TABLE `client_documents_tb` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `document_type_id` int(11) NOT NULL,
  `document_file` varchar(500) NOT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client_tb`
--

CREATE TABLE `client_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `contact_person` varchar(200) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `information` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `gender_id` int(11) DEFAULT NULL,
  `occupation` varchar(200) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `salutation_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_tb`
--

CREATE TABLE `company_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `contact_address` varchar(400) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `currency_name` varchar(50) DEFAULT NULL,
  `currency_symbol` varchar(10) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_tb`
--

INSERT INTO `company_tb` (`id`, `name`, `code`, `email`, `contact_address`, `phone`, `website`, `logo`, `currency_name`, `currency_symbol`, `currency_code`, `created_at`, `last_updated_at`) VALUES
(1, 'Homeland Engineering Pvt Ltd', 'HOME001', 'info@homelandengineering.com', 'Kathmandu, Nepal', '+977-9812345678', 'https://homelandengineering.com', '55e52549-11e0-44fc-a859-74b5500d8a95.png', 'Nepalese Rupee', 'Rs.', 'NPR', '2026-05-13 21:10:05', '2026-05-13 22:15:26');

-- --------------------------------------------------------

--
-- Table structure for table `country_tb`
--

CREATE TABLE `country_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `country_tb`
--

INSERT INTO `country_tb` (`id`, `name`, `code`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Nepal', 'NP', 1, 0, '2026-05-13 22:24:50', 0, '2026-05-13 22:24:50'),
(2, 'India', 'IN', 1, 0, '2026-05-13 22:24:50', 0, '2026-05-13 22:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `description`, `created_at`, `last_updated_at`, `created_by`, `last_updated_by`, `is_active`) VALUES
(1, 'Project Manager', 'Oversees entire projects', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(2, 'Site Engineer', 'Manages day-to-day site operations', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(3, 'Civil Engineer', 'Structural and design specialist', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(4, 'Quantity Surveyor', 'Estimates material costs', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(5, 'Safety Officer', 'Ensures site safety compliance', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(6, 'HR Manager', 'Handles personnel', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1),
(7, 'Accountant', 'Manages project finances', '2026-05-10 14:34:10', '2026-05-10 14:34:10', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_types`
--

INSERT INTO `document_types` (`id`, `name`, `description`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Citizenship', 'National Identity Card', 1, NULL, '2026-05-10 17:49:54', NULL, '2026-05-10 17:49:54'),
(2, 'Passport', 'International Travel Document', 1, NULL, '2026-05-10 17:49:54', NULL, '2026-05-10 17:49:54'),
(3, 'Driving License', 'Vehicle operator license', 1, NULL, '2026-05-10 17:49:54', NULL, '2026-05-10 17:49:54'),
(4, 'Contract', 'Employment contract document', 1, NULL, '2026-05-10 17:49:54', NULL, '2026-05-10 17:49:54'),
(5, 'Academic Certificate', 'Educational qualifications', 1, NULL, '2026-05-10 17:49:54', NULL, '2026-05-10 17:49:54');

-- --------------------------------------------------------

--
-- Table structure for table `employee_tb`
--

CREATE TABLE `employee_tb` (
  `id` int(11) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `join_date` varchar(20) DEFAULT NULL,
  `information` text DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `document_file` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `employee_code` varchar(50) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `emergency_contact_name` varchar(200) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `salutation_id` int(11) DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL,
  `document_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_tb`
--

INSERT INTO `employee_tb` (`id`, `full_name`, `email`, `phone`, `join_date`, `information`, `profile_photo`, `document_file`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`, `employee_code`, `blood_group`, `emergency_contact_name`, `emergency_contact_phone`, `designation_id`, `salutation_id`, `gender_id`, `document_type_id`) VALUES
(1, 'Aashish Bdr Chettri', 'aashish@cems.com', '9841234567', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-09 20:58:02', NULL, '2026-05-09 20:58:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Ram Kumar Shrestha', 'ram@cems.com', '9801234567', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-09 20:58:02', NULL, '2026-05-09 20:58:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Sita Maya', 'sita@cems.com', '9811234567', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-09 20:58:02', NULL, '2026-05-09 20:58:02', NULL, NULL, NULL, NULL, 7, NULL, NULL, NULL),
(4, 'Hari Prasad Luitel', 'hari@cems.com', '9851234567', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-09 20:58:02', NULL, '2026-05-09 20:58:02', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL),
(5, 'Maya Devi', 'maya@cems.com', '9861234567', NULL, NULL, NULL, NULL, 1, NULL, '2026-05-09 20:58:02', NULL, '2026-05-09 20:58:02', NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `gender_tb`
--

CREATE TABLE `gender_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` varchar(100) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gender_tb`
--

INSERT INTO `gender_tb` (`id`, `name`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Male', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24'),
(2, 'Female', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24'),
(3, 'Other', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `material_categories`
--

CREATE TABLE `material_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material_categories`
--

INSERT INTO `material_categories` (`id`, `name`, `description`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'f', 'f', 1, NULL, '2026-05-13 21:42:13', NULL, '2026-05-13 21:42:13');

-- --------------------------------------------------------

--
-- Table structure for table `material_details_tb`
--

CREATE TABLE `material_details_tb` (
  `id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `site_id` int(11) DEFAULT NULL,
  `order_quantity` decimal(15,3) NOT NULL,
  `received_quantity` decimal(15,3) DEFAULT NULL,
  `is_received` tinyint(1) NOT NULL,
  `delivery_start_date` date DEFAULT NULL,
  `delivery_end_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `material_tb`
--

CREATE TABLE `material_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `quantity` decimal(15,3) DEFAULT NULL,
  `unit_price` decimal(15,2) DEFAULT NULL,
  `supplier` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `unit_id` int(11) DEFAULT NULL,
  `supplier_location` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `material_units`
--

CREATE TABLE `material_units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `symbol` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material_units`
--

INSERT INTO `material_units` (`id`, `name`, `symbol`, `created_at`, `last_updated_at`, `created_by`, `last_updated_by`, `is_active`) VALUES
(1, 'Kilogram', 'kg', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(2, 'Ton', 'ton', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(3, 'Metric Ton', 'MT', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(4, 'Cubic Meter', 'm3', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(5, 'Bag', 'bag', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(6, 'Number', 'nos', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(7, 'Liter', 'L', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(9, 'dd', 'dd', '2026-05-13 21:27:38', '2026-05-13 21:27:38', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_category_tb`
--

CREATE TABLE `project_category_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_category_tb`
--

INSERT INTO `project_category_tb` (`id`, `name`, `description`, `color`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Road & Highway', 'Road construction, expansion, and maintenance projects', '#F59E0B', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(2, 'Bridge & Culvert', 'Bridge design and structural construction projects', '#3B82F6', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(3, 'Building & Infra', 'Commercial and residential building construction', '#10B981', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(4, 'Water & Sanitation', 'Water supply, drainage, and sewage projects', '#06B6D4', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(5, 'Irrigation', 'Irrigation canal and dam construction projects', '#6366F1', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(6, 'Electrical Works', 'Electrical infrastructure and substation projects', '#F97316', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(7, 'Survey & Design', 'Feasibility, survey, and engineering design projects', '#8B5CF6', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(8, 'Maintenance', 'Repair and maintenance of existing infrastructure', '#64748B', 1, NULL, '2026-05-10 12:45:15', NULL, '2026-05-10 12:45:15'),
(9, 'Test', 'test', '#ec4899', 1, 1, '2026-05-10 12:48:03', 1, '2026-05-10 12:48:03'),
(10, 'Updated', 'sdf', '#6366f1', 0, 1, '2026-05-10 12:57:48', 1, '2026-05-10 17:45:56');

-- --------------------------------------------------------

--
-- Table structure for table `project_members_tb`
--

CREATE TABLE `project_members_tb` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `is_leader` tinyint(1) NOT NULL,
  `role_description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_sites_tb`
--

CREATE TABLE `project_sites_tb` (
  `project_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_tb`
--

CREATE TABLE `project_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) NOT NULL,
  `location` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` varchar(20) DEFAULT NULL,
  `end_date` varchar(20) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status_date` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_tb`
--

INSERT INTO `project_tb` (`id`, `name`, `code`, `location`, `description`, `start_date`, `end_date`, `budget`, `is_active`, `client_id`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`, `status_id`, `category_id`, `status_date`) VALUES
(1, 'htaccess', '25262', 'ee', '', '2026-05-09', '2026-05-16', 12.00, 1, NULL, 1, '2026-05-09 20:21:13', 1, '2026-05-09 20:39:42', 2, NULL, NULL),
(2, 'Nepal', '2er', 'ee', 's', '2026-05-09', '2026-05-02', 23.00, 1, NULL, 1, '2026-05-09 20:51:15', 1, '2026-05-09 20:51:15', 2, NULL, NULL),
(3, 'Kathmandu View Tower', 'KVT-01', 'Old Bus Park, Kathmandu', 'dd', '', '', 500000000.00, 0, NULL, NULL, '2026-05-09 20:57:39', 1, '2026-05-09 22:25:44', 3, NULL, NULL),
(4, 'Pokhara International Airport Road', 'PAR-02', 'Chinnechaur, Pokhara', NULL, NULL, NULL, 120000000.00, 0, NULL, NULL, '2026-05-09 20:57:39', NULL, '2026-05-09 20:57:39', NULL, NULL, NULL),
(5, 'Bhairahawa Special Economic Zone', 'BSEZ-03', 'Bhairahawa, Lumbini', NULL, NULL, NULL, 85000000.00, 0, NULL, NULL, '2026-05-09 20:57:39', NULL, '2026-05-09 20:57:39', NULL, NULL, NULL),
(6, 'Dharan-Chatara-Gaighat Road', 'DCG-04', 'East-West Highway Connection', NULL, NULL, NULL, 250000000.00, 0, NULL, NULL, '2026-05-09 20:57:39', NULL, '2026-05-09 20:57:39', NULL, NULL, NULL),
(7, 'Lumbini Master Plan Phase II', 'LMP-05', 'Lumbini, Rupandehi', NULL, NULL, NULL, 300000000.00, 0, NULL, NULL, '2026-05-09 20:57:39', NULL, '2026-05-09 20:57:39', NULL, NULL, NULL),
(9, 'New Project', 'np', 'GORKHA', 'gahasks', '2026-05-10', '2026-05-16', 1200.00, 1, NULL, 1, '2026-05-10 12:49:42', 1, '2026-05-10 15:36:03', 5, 9, NULL),
(10, 'Homeland ', 'HL', 'Bharatpur', '', '2026-05-13', '2026-05-16', 1300000.00, 1, NULL, 1, '2026-05-10 15:38:34', 1, '2026-05-10 17:43:39', 3, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_tb`
--

CREATE TABLE `role_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` varchar(100) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_tb`
--

INSERT INTO `role_tb` (`id`, `name`, `description`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Admin', 'System Administrator with full access', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24'),
(2, 'Software User', 'Standard software user', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24'),
(3, 'Employee', 'Company employee profile', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24'),
(4, 'Client', 'External client representative', 1, NULL, '2026-05-09 20:02:24', NULL, '2026-05-09 20:02:24');

-- --------------------------------------------------------

--
-- Table structure for table `salutation_tb`
--

CREATE TABLE `salutation_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salutation_tb`
--

INSERT INTO `salutation_tb` (`id`, `name`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`) VALUES
(1, 'Mr.', 1, 0, '2026-05-11 22:03:36', 0, '2026-05-11 22:03:36'),
(2, 'Mrs.', 1, 0, '2026-05-11 22:03:36', 0, '2026-05-11 22:03:36'),
(3, 'Miss', 1, 0, '2026-05-11 22:03:36', 0, '2026-05-11 22:03:36'),
(4, 'Dr.', 1, 0, '2026-05-11 22:03:36', 0, '2026-05-11 22:03:36'),
(5, 'Er.', 1, 0, '2026-05-11 22:03:36', 0, '2026-05-11 22:03:36');

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `site_type_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `site_code` varchar(50) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `start_date` varchar(20) DEFAULT NULL,
  `end_date` varchar(20) DEFAULT NULL,
  `status_date` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `name`, `description`, `site_type_id`, `created_at`, `last_updated_at`, `created_by`, `last_updated_by`, `site_code`, `client_id`, `status_id`, `is_active`, `start_date`, `end_date`, `status_date`) VALUES
(1, 'npela ', 'ss', 1, '2026-05-10 15:18:40', '2026-05-10 15:18:40', 1, 1, NULL, NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site_employees_tb`
--

CREATE TABLE `site_employees_tb` (
  `site_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_images_tb`
--

CREATE TABLE `site_images_tb` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `caption` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_types`
--

CREATE TABLE `site_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_types`
--

INSERT INTO `site_types` (`id`, `name`, `description`, `created_at`, `last_updated_at`, `created_by`, `last_updated_by`, `is_active`) VALUES
(1, 'Construction Sited', 'Main construction area', '2026-05-10 14:24:50', '2026-05-13 23:39:55', NULL, 1, 1),
(2, 'Storage Yard', 'Area for material storage', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(3, 'Office Site', 'Temporary site office', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1),
(4, 'Fabrication Yard', 'Area for pre-fabrication works', '2026-05-10 14:24:50', '2026-05-10 14:24:50', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `software_user_documents_tb`
--

CREATE TABLE `software_user_documents_tb` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type_id` int(11) NOT NULL,
  `document_file` varchar(500) NOT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `software_user_tb`
--

CREATE TABLE `software_user_tb` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `gender_id` int(11) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `document_file` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `has_software_access` tinyint(1) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `normalized_password` varchar(255) DEFAULT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `document_type_id` int(11) DEFAULT NULL,
  `document_number` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `software_user_tb`
--

INSERT INTO `software_user_tb` (`id`, `first_name`, `last_name`, `middle_name`, `gender_id`, `phone_number`, `email`, `document_file`, `profile_photo`, `username`, `has_software_access`, `role_id`, `normalized_password`, `hashed_password`, `is_active`, `created_by`, `created_at`, `last_updated_by`, `last_updated_at`, `document_type_id`, `document_number`) VALUES
(1, 'System', 'Admin', NULL, 1, NULL, 'admin@cems.com', NULL, NULL, 'admin', 1, 1, NULL, '$pbkdf2-sha256$29000$sdaa0/o/51zL.X9PqRUiJA$L9Z2BtOawa10MUpzloWS8Ne00cRpyADccTIil/txlcY', 1, NULL, '2026-05-09 20:03:01', NULL, '2026-05-09 20:06:49', NULL, NULL),
(2, 'aashish ', 'pokherel', NULL, 1, 'string', 'aashish@gmail.com', 'bdc5c84e-87fa-4f5f-9d92-7e9374abdd9a.png', '6a5c4099-9248-438c-bf2c-c91ca14aa542.jpg', 'aashishpokherel', 1, 1, 'Aashish@123', '$pbkdf2-sha256$29000$IETo/T8HgFDKWcv5P0eIEQ$Rs0FWg6XGlja9zgzB6UGvEDWLfzheLRImJZ.I8DrWdI', 0, 1, '2026-05-10 18:53:51', 1, '2026-05-11 21:40:42', NULL, NULL),
(3, 'update', 'string', 'string', 2, '9824202038', 'main@gmail.com', NULL, '957c0ec8-0c99-49f6-976f-4b2ff9d5e2f1.png', 'string', 1, 2, 'string@123', '$pbkdf2-sha256$29000$6R3DmBPCGCNkDMEYozSm1A$3dp6XJbyaT5ES.k1RQqmJhzVkDGVggUrjS72BhcGvXI', 0, 1, '2026-05-12 22:54:14', 1, '2026-05-13 21:57:32', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `status_tb`
--

CREATE TABLE `status_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `color_code` varchar(20) DEFAULT '#6366f1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status_tb`
--

INSERT INTO `status_tb` (`id`, `name`, `description`, `module`, `is_active`, `created_at`, `last_updated_at`, `created_by`, `last_updated_by`, `color_code`) VALUES
(1, 'string', 'string', 'string', 1, '2026-05-13 20:50:26', '2026-05-13 21:00:21', 1, 1, '#6366f1'),
(2, 'dd', 'dd', NULL, 1, '2026-05-13 20:50:49', '2026-05-13 20:54:33', 1, 1, '#f26464');

-- --------------------------------------------------------

--
-- Table structure for table `task_assignments_tb`
--

CREATE TABLE `task_assignments_tb` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `is_leader` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_images_tb`
--

CREATE TABLE `task_images_tb` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `caption` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_tb`
--

CREATE TABLE `task_tb` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `site_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `task_type_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `status_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_types`
--

CREATE TABLE `task_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alembic_version`
--
ALTER TABLE `alembic_version`
  ADD PRIMARY KEY (`version_num`);

--
-- Indexes for table `client_documents_tb`
--
ALTER TABLE `client_documents_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_doc_type` (`document_type_id`),
  ADD KEY `ix_client_documents_tb_id` (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `client_tb`
--
ALTER TABLE `client_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_client_tb_email` (`email`),
  ADD KEY `ix_client_tb_id` (`id`),
  ADD KEY `fk_client_salutation` (`salutation_id`),
  ADD KEY `fk_client_country` (`country_id`),
  ADD KEY `gender_id` (`gender_id`);

--
-- Indexes for table `company_tb`
--
ALTER TABLE `company_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `ix_company_tb_id` (`id`);

--
-- Indexes for table `country_tb`
--
ALTER TABLE `country_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `ix_country_tb_id` (`id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_designations_name` (`name`),
  ADD KEY `ix_designations_id` (`id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_document_types_id` (`id`);

--
-- Indexes for table `employee_tb`
--
ALTER TABLE `employee_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_employee_tb_email` (`email`),
  ADD UNIQUE KEY `ix_employee_tb_employee_code` (`employee_code`),
  ADD KEY `ix_employee_tb_id` (`id`),
  ADD KEY `fk_emp_salutation` (`salutation_id`),
  ADD KEY `fk_emp_gender` (`gender_id`),
  ADD KEY `designation_id` (`designation_id`),
  ADD KEY `document_type_id` (`document_type_id`);

--
-- Indexes for table `gender_tb`
--
ALTER TABLE `gender_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_gender_tb_id` (`id`);

--
-- Indexes for table `material_categories`
--
ALTER TABLE `material_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `name_2` (`name`);

--
-- Indexes for table `material_details_tb`
--
ALTER TABLE `material_details_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `site_id` (`site_id`),
  ADD KEY `ix_material_details_tb_id` (`id`);

--
-- Indexes for table `material_tb`
--
ALTER TABLE `material_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_material_tb_id` (`id`),
  ADD KEY `unit_id` (`unit_id`),
  ADD KEY `fk_material_category` (`category_id`);

--
-- Indexes for table `material_units`
--
ALTER TABLE `material_units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_material_units_name` (`name`),
  ADD KEY `ix_material_units_id` (`id`);

--
-- Indexes for table `project_category_tb`
--
ALTER TABLE `project_category_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_project_category_tb_id` (`id`);

--
-- Indexes for table `project_members_tb`
--
ALTER TABLE `project_members_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `ix_project_members_tb_id` (`id`);

--
-- Indexes for table `project_sites_tb`
--
ALTER TABLE `project_sites_tb`
  ADD PRIMARY KEY (`project_id`,`site_id`),
  ADD KEY `site_id` (`site_id`);

--
-- Indexes for table `project_tb`
--
ALTER TABLE `project_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_project_tb_code` (`code`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `ix_project_tb_id` (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `role_tb`
--
ALTER TABLE `role_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_role_tb_id` (`id`);

--
-- Indexes for table `salutation_tb`
--
ALTER TABLE `salutation_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_salutation_tb_id` (`id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_sites_site_code` (`site_code`),
  ADD KEY `ix_sites_id` (`id`),
  ADD KEY `ix_sites_name` (`name`),
  ADD KEY `site_type_id` (`site_type_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `site_employees_tb`
--
ALTER TABLE `site_employees_tb`
  ADD PRIMARY KEY (`site_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `site_images_tb`
--
ALTER TABLE `site_images_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `site_id` (`site_id`),
  ADD KEY `ix_site_images_tb_id` (`id`);

--
-- Indexes for table `site_types`
--
ALTER TABLE `site_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_site_types_name` (`name`),
  ADD KEY `ix_site_types_id` (`id`);

--
-- Indexes for table `software_user_documents_tb`
--
ALTER TABLE `software_user_documents_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_doc_type` (`document_type_id`),
  ADD KEY `ix_software_user_documents_tb_id` (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `software_user_tb`
--
ALTER TABLE `software_user_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_software_user_tb_username` (`username`),
  ADD UNIQUE KEY `ix_software_user_tb_email` (`email`),
  ADD KEY `gender_id` (`gender_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `ix_software_user_tb_id` (`id`),
  ADD KEY `fk_user_doc_type_main` (`document_type_id`);

--
-- Indexes for table `status_tb`
--
ALTER TABLE `status_tb`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ix_status_tb_id` (`id`);

--
-- Indexes for table `task_assignments_tb`
--
ALTER TABLE `task_assignments_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `ix_task_assignments_tb_id` (`id`);

--
-- Indexes for table `task_images_tb`
--
ALTER TABLE `task_images_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `ix_task_images_tb_id` (`id`);

--
-- Indexes for table `task_tb`
--
ALTER TABLE `task_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `site_id` (`site_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `ix_task_tb_id` (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `task_type_id` (`task_type_id`);

--
-- Indexes for table `task_types`
--
ALTER TABLE `task_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_task_types_name` (`name`),
  ADD KEY `ix_task_types_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client_documents_tb`
--
ALTER TABLE `client_documents_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client_tb`
--
ALTER TABLE `client_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_tb`
--
ALTER TABLE `company_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `country_tb`
--
ALTER TABLE `country_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `document_types`
--
ALTER TABLE `document_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_tb`
--
ALTER TABLE `employee_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gender_tb`
--
ALTER TABLE `gender_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `material_categories`
--
ALTER TABLE `material_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `material_details_tb`
--
ALTER TABLE `material_details_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `material_tb`
--
ALTER TABLE `material_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `material_units`
--
ALTER TABLE `material_units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `project_category_tb`
--
ALTER TABLE `project_category_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `project_members_tb`
--
ALTER TABLE `project_members_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_tb`
--
ALTER TABLE `project_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `role_tb`
--
ALTER TABLE `role_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `salutation_tb`
--
ALTER TABLE `salutation_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `site_images_tb`
--
ALTER TABLE `site_images_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_types`
--
ALTER TABLE `site_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `software_user_documents_tb`
--
ALTER TABLE `software_user_documents_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `software_user_tb`
--
ALTER TABLE `software_user_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `status_tb`
--
ALTER TABLE `status_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `task_assignments_tb`
--
ALTER TABLE `task_assignments_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_images_tb`
--
ALTER TABLE `task_images_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_tb`
--
ALTER TABLE `task_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_types`
--
ALTER TABLE `task_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_documents_tb`
--
ALTER TABLE `client_documents_tb`
  ADD CONSTRAINT `client_documents_tb_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client_tb` (`id`),
  ADD CONSTRAINT `fk_client_doc_type` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`);

--
-- Constraints for table `client_tb`
--
ALTER TABLE `client_tb`
  ADD CONSTRAINT `client_tb_ibfk_1` FOREIGN KEY (`gender_id`) REFERENCES `gender_tb` (`id`),
  ADD CONSTRAINT `fk_client_country` FOREIGN KEY (`country_id`) REFERENCES `country_tb` (`id`),
  ADD CONSTRAINT `fk_client_salutation` FOREIGN KEY (`salutation_id`) REFERENCES `salutation_tb` (`id`);

--
-- Constraints for table `employee_tb`
--
ALTER TABLE `employee_tb`
  ADD CONSTRAINT `employee_tb_ibfk_1` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`),
  ADD CONSTRAINT `employee_tb_ibfk_2` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`),
  ADD CONSTRAINT `fk_emp_gender` FOREIGN KEY (`gender_id`) REFERENCES `gender_tb` (`id`),
  ADD CONSTRAINT `fk_emp_salutation` FOREIGN KEY (`salutation_id`) REFERENCES `salutation_tb` (`id`);

--
-- Constraints for table `material_details_tb`
--
ALTER TABLE `material_details_tb`
  ADD CONSTRAINT `material_details_tb_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `material_tb` (`id`),
  ADD CONSTRAINT `material_details_tb_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project_tb` (`id`),
  ADD CONSTRAINT `material_details_tb_ibfk_3` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`);

--
-- Constraints for table `material_tb`
--
ALTER TABLE `material_tb`
  ADD CONSTRAINT `fk_material_category` FOREIGN KEY (`category_id`) REFERENCES `material_categories` (`id`),
  ADD CONSTRAINT `material_tb_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `material_units` (`id`);

--
-- Constraints for table `project_members_tb`
--
ALTER TABLE `project_members_tb`
  ADD CONSTRAINT `project_members_tb_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_tb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_members_tb_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project_tb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_sites_tb`
--
ALTER TABLE `project_sites_tb`
  ADD CONSTRAINT `project_sites_tb_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project_tb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_sites_tb_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_tb`
--
ALTER TABLE `project_tb`
  ADD CONSTRAINT `project_tb_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client_tb` (`id`),
  ADD CONSTRAINT `project_tb_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `project_category_tb` (`id`),
  ADD CONSTRAINT `project_tb_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status_tb` (`id`);

--
-- Constraints for table `sites`
--
ALTER TABLE `sites`
  ADD CONSTRAINT `sites_ibfk_2` FOREIGN KEY (`site_type_id`) REFERENCES `site_types` (`id`),
  ADD CONSTRAINT `sites_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `client_tb` (`id`),
  ADD CONSTRAINT `sites_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `status_tb` (`id`);

--
-- Constraints for table `site_employees_tb`
--
ALTER TABLE `site_employees_tb`
  ADD CONSTRAINT `site_employees_tb_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_tb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `site_employees_tb_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `site_images_tb`
--
ALTER TABLE `site_images_tb`
  ADD CONSTRAINT `site_images_tb_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `software_user_documents_tb`
--
ALTER TABLE `software_user_documents_tb`
  ADD CONSTRAINT `fk_user_doc_type` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`),
  ADD CONSTRAINT `software_user_documents_tb_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `software_user_tb` (`id`);

--
-- Constraints for table `software_user_tb`
--
ALTER TABLE `software_user_tb`
  ADD CONSTRAINT `fk_user_doc_type_main` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`),
  ADD CONSTRAINT `software_user_tb_ibfk_1` FOREIGN KEY (`gender_id`) REFERENCES `gender_tb` (`id`),
  ADD CONSTRAINT `software_user_tb_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role_tb` (`id`);

--
-- Constraints for table `task_assignments_tb`
--
ALTER TABLE `task_assignments_tb`
  ADD CONSTRAINT `task_assignments_tb_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee_tb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_assignments_tb_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `task_tb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_images_tb`
--
ALTER TABLE `task_images_tb`
  ADD CONSTRAINT `task_images_tb_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task_tb` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_tb`
--
ALTER TABLE `task_tb`
  ADD CONSTRAINT `task_tb_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project_tb` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_tb_ibfk_2` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_tb_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status_tb` (`id`),
  ADD CONSTRAINT `task_tb_ibfk_4` FOREIGN KEY (`client_id`) REFERENCES `client_tb` (`id`),
  ADD CONSTRAINT `task_tb_ibfk_5` FOREIGN KEY (`task_type_id`) REFERENCES `task_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
