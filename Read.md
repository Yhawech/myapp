Three-Tier Scalable News Aggregation & Political Bias Detection System

A cloud-based news aggregation platform built with Node.js and Amazon Web Services (AWS), featuring rule-based political bias classification and scalable three-tier cloud infrastructure.

Overview

This project focuses on developing a scalable news aggregation platform hosted on AWS. It follows a three-tier architecture that separates the web, application, and database layers to improve infrastructure organization, scalability, and maintainability.

The application incorporates a rule-based, keyword-driven classification system that categorizes incoming news articles into four categories:

- Left: Articles classified as left-leaning.
- Right: Articles classified as right-leaning.
- Neutral: Articles classified as neutral.
- Potentially Fake: Articles flagged by predefined classification rules for potential misinformation.

The AWS infrastructure was provisioned and configured to support application availability, traffic distribution, database management, and secure access through a custom domain.

Key Features

- News Aggregation: Node.js-based news aggregation platform.
- Political Bias Classification: Keyword-driven classification of news articles.
- Four Classification Categories: Left, Right, Neutral, and Potentially Fake.
- Three-Tier Architecture: Separate web, application, and database layers.
- Load Balancing: Application Load Balancer distributes incoming traffic.
- Auto Scaling: EC2 Auto Scaling Groups support changing traffic requirements.
- Managed Database: Amazon RDS for database infrastructure.
- Custom Domain: Amazon Route 53 for DNS management.
- HTTPS Configuration: AWS Certificate Manager for SSL/TLS certificates.

System Architecture

The project follows a three-tier architecture deployed on Amazon Web Services.

1. Web Tier

Responsible for the web-facing application layer.

- Hosted on Amazon EC2.
- Receives incoming application traffic through an Application Load Balancer.
- Provides the web-facing component of the platform.

2. Application Tier

Responsible for application processing and business logic.

- Runs the Node.js application.
- Handles news aggregation and application logic.
- Implements keyword-based classification rules.
- Categorizes incoming news articles.

3. Database Tier

Responsible for database infrastructure and data management.

- Uses Amazon RDS.
- Maintains a separate database layer.
- Keeps database infrastructure separate from the web and application tiers.

AWS Infrastructure

AWS Service| Purpose
Amazon EC2| Compute infrastructure
Amazon VPC| Isolated network environment
Application Load Balancer| Incoming traffic distribution
EC2 Auto Scaling| Infrastructure scalability
Amazon RDS| Managed relational database
Amazon Route 53| DNS and custom domain management
AWS Certificate Manager| SSL/TLS certificate management

Technology Stack

Backend Development

- Node.js
- REST APIs

Cloud Platform

- Amazon Web Services (AWS)
- Amazon EC2
- Amazon VPC
- Application Load Balancer
- EC2 Auto Scaling
- Amazon RDS
- Amazon Route 53
- AWS Certificate Manager

News Classification Methodology

The platform implements a rule-based, keyword-driven classification approach to categorize incoming news articles.

Articles are evaluated against predefined keywords and classification rules to assign one of four categories:

Category| Description
Left| Classified as left-leaning
Right| Classified as right-leaning
Neutral| Classified as neutral
Potentially Fake| Flagged by predefined rules for potential misinformation

Important: The classification system uses predefined keywords and rules. Its results are heuristic classifications and should not be interpreted as definitive political bias assessments or verified misinformation detection.

AWS Deployment & Configuration

The infrastructure was provisioned and configured on AWS to support the three-tier application architecture.

Key implementation activities included:

1. Creating and configuring the AWS VPC.
2. Provisioning and configuring EC2 instances.
3. Configuring the Application Load Balancer.
4. Implementing EC2 Auto Scaling Groups.
5. Setting up Amazon RDS.
6. Configuring Route 53 for custom domain DNS management.
7. Configuring AWS Certificate Manager for HTTPS.

Project Details

Attribute| Details
Project Name| Three-Tier Scalable News Aggregation & Political Bias Detection System
Project Type| Cloud Computing / Web Application
Development Period| January 2025 – May 2025
Backend| Node.js
Cloud Platform| Amazon Web Services
Architecture| Three-Tier Architecture
Database| Amazon RDS
Classification| Rule-Based Keyword Classification

Learning Outcomes

This project provided practical exposure to:

- Designing and deploying three-tier cloud architectures.
- Provisioning and configuring AWS infrastructure.
- Working with VPC networking and EC2 instances.
- Configuring load balancing and auto scaling.
- Working with Amazon RDS.
- Configuring custom domains and HTTPS.
- Developing rule-based news classification logic.
- Understanding scalable application deployment on AWS.

Future Improvements

Potential areas for further development include:

- Improving news classification rules and keyword coverage.
- Integrating additional news sources.
- Introducing more advanced classification techniques.
- Enhancing application monitoring and logging.
- Improving infrastructure security and deployment automation.

Author

Prerak Thaker

Cloud & DevOps | AWS Infrastructure

---

Developed as a cloud computing project to explore scalable AWS infrastructure, three-tier application architecture, and rule-based news classification.