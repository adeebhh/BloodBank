# BloodBank and Donation Management System (BDMS)

A full-stack web application designed to simplify blood bank operations by managing donors, blood units, inventory, blood requests, donation camps, notifications, and reports through a centralized platform.

## Overview

The **BloodBank and Donation Management System (BDMS)** provides an organized digital solution for managing blood bank and donation-related information. It helps reduce manual record maintenance, improves data accessibility, and supports efficient management of blood-related activities.

The application provides role-based access for Admin, Staff, and User, ensuring that users can access features according to their assigned permissions.

## Features

- **User Authentication:** Secure login and registration using JWT authentication.
- **Role-Based Access Control:** Different access permissions for Admin, Staff, and User.
- **Donor Management:** Add, view, update, search, and manage donor information.
- **Blood Unit Management:** Maintain records of blood units and their status.
- **Blood Inventory Management:** Monitor blood availability and inventory information.
- **Blood Request Management:** Create and manage blood requests.
- **Donation Camp Management:** Maintain information about blood donation camps.
- **Notification Management:** Create and manage system notifications according to user permissions.
- **Dashboard:** View important information about blood bank activities.
- **Reports:** Access reports through authorized administrative functionality.
- **API Documentation:** Explore and test backend REST APIs using Swagger UI.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5 and CSS3

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs
- Maven

### Database
- MySQL

### API Documentation
- Swagger / OpenAPI

## System Architecture

The application follows a frontend–backend architecture:

1. **Frontend:** React.js provides the user interface and communicates with the backend through HTTP requests.
2. **Backend:** Spring Boot processes requests, implements business logic, and enforces authentication and authorization.
3. **Database:** MySQL stores user, donor, blood unit, inventory, request, camp, and related information.
4. **Security:** JWT tokens authenticate users, while role-based permissions restrict access to protected endpoints.
5. **API Documentation:** Swagger UI allows developers to explore and test available backend endpoints.

## User Roles

| Role | Access |
|---|---|
| Admin | User management, reports, and authorized system operations |
| Staff | Donor, blood unit, inventory, blood request, and camp management |
| User | Dashboard, donor-related features, and blood request functionality according to permissions |

## Project Structure

The repository contains separate frontend and backend applications.

```text
BloodBank-Donation-Management-System/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

*Note: Adjust the folder names above to match the actual names in your repository.*

## Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) compatible with your Spring Boot project
- Node.js and npm
- MySQL Server
- Maven, if it is not provided through the project's Maven Wrapper
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
```

Replace the placeholders with your actual GitHub repository URL and folder name.

### 2. Configure the Database

1. Start your MySQL server.
2. Create a database for the application.
3. Configure the database name, username, and password in the backend's application configuration.
4. Ensure that the database settings match your local MySQL setup.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/<YOUR_DATABASE_NAME>
spring.datasource.username=<YOUR_MYSQL_USERNAME>
spring.datasource.password=<YOUR_MYSQL_PASSWORD>
```

Use your actual database configuration. **Do not commit real passwords, API keys, or other secrets to GitHub.**

### 3. Run the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Run the application using Maven:

```bash
mvn spring-boot:run
```

If the project includes a Maven Wrapper, you can use the corresponding wrapper command instead.

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

### 5. Access Swagger UI

Once the backend is running, open:

```text
http://localhost:8080/swagger-ui/index.html
```

If your backend uses a different port or Swagger configuration, use the corresponding URL.

## Authentication and Security

The application uses Spring Security and JWT-based authentication to secure protected API endpoints.

- Users authenticate through the login endpoint.
- A successful login returns a JWT token and the user's role.
- The frontend stores the token for authenticated API requests.
- Protected endpoints validate authentication and enforce role-based permissions.
- Administrative features are restricted to authorized users.

## Testing

The following key functionalities can be tested:

- User registration and login
- JWT authentication and role-based access
- Donor registration and management
- Blood unit and inventory operations
- Blood request processing
- Donation camp management
- Notification functionality
- Dashboard and report access

## Future Enhancements

- Automated email and SMS notifications
- Real-time blood availability updates
- Advanced donor search and filtering
- Hospital integration
- Mobile application support
- Enhanced reporting and data visualization
- Advanced analytics for blood demand and inventory planning

## Learning Outcomes

This project provides practical experience in:

- Full-stack web application development
- React.js frontend development
- Java and Spring Boot backend development
- REST API design and integration
- MySQL database management
- JWT authentication and role-based authorization
- API documentation and testing
- Connecting frontend, backend, and database components

## Contributing

Contributions, suggestions, and feedback are welcome. You can fork the repository, create a feature branch, and submit a pull request with your improvements.

## License

A license has not yet been specified. Add a suitable open-source license if you intend to permit reuse and redistribution of this project.

---

**BloodBank and Donation Management System (BDMS)**  
Developed as an academic full-stack web development project.
