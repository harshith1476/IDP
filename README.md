# Department Research Information Management System (DRIMS)

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Academic-blue.svg)](LICENSE)

A complete, production-ready web application for managing academic research data, replacing Excel-based data collection with a secure, modern web platform.

🌐 **Live Demo:** [ajp-pro.vercel.app](https://ajp-pro.vercel.app)  
📦 **Repository:** [GitHub](https://github.com/harshith1476/DRIMS)  
🚀 **Frontend Dashboard:** [Vercel](https://vercel.com/harshith1476s-projects/frontend/2H6cGLQq7JwkEcCd74mDy6wc2qM8)  
⚙️ **Backend Dashboard:** [Render](https://dashboard.render.com/web/srv-d5f2d3h5pdvs73fssjng)

## 📸 Screenshots

### Login Pages

#### Admin Login
![Admin Login](admin%20login.png)
*Administrator Portal - System Administration & Analytics*

#### Faculty Login
![Faculty Login](faculty%20login.png)
*Faculty Portal - Research Publication Management*

#### Student Login
![Student Login](student%20login.png)
*Student Portal - Research & Academic Management*

### Key Features
- **Multi-role Authentication**: Separate login interfaces for Admin, Faculty, and Students
- **Clean UI Design**: Professional, university-grade interface with responsive design
- **Mobile-Responsive**: Fully optimized for mobile, tablet, and desktop devices
- **Secure Access**: JWT-based authentication with role-based access control

## 📑 Table of Contents

- [Screenshots](#-screenshots)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Setup Instructions](#-detailed-setup-instructions)
- [Default Credentials](#-default-credentials)
- [Project Structure](#-project-structure)
- [Maven Commands](#-maven-commands)
- [NPM Commands](#-npm-commands)
- [MongoDB Schema](#️-mongodb-schema)
- [Security Features](#-security-features)
- [API Endpoints](#-api-endpoints)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting](#-troubleshooting)
- [Additional Documentation](#-additional-documentation)
- [Contributing](#-contributing)

## 🎯 Project Overview

DRIMS is a full-stack application designed to streamline research data management for academic departments. It provides separate interfaces for faculty members and administrators (Research Coordinators) to manage research publications, targets, and analytics.

## ✨ Features

### Faculty Features
- ✅ Secure JWT-based authentication
- ✅ Profile management (Name, Employee ID, Designation, Department, Research Areas, ORCID, Scopus, Google Scholar)
- ✅ Yearly research target setting and tracking
- ✅ Publication management:
  - Journals
  - Conferences
  - Patents
  - Book Chapters
- ✅ PDF document upload for proof documents
- ✅ View own historical data

### Admin Features
- ✅ View all faculty profiles (read-only)
- ✅ View all research targets and publications
- ✅ Department-level analytics:
  - Year-wise publication totals
  - Category-wise breakdown
  - Faculty-wise contribution
  - Status-wise distribution
- ✅ Excel export functionality (filtered by year & category)

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data MongoDB**
- **Lombok**
- **Maven**
- **Apache POI** (Excel export)

### Database
- **MongoDB** (NoSQL)

### Frontend
- **React 18** with Vite
- **Tailwind CSS**
- **Axios** (HTTP client)
- **React Router** (Navigation)
- **Recharts** (Data visualization)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Java 17** or higher
   ```bash
   java -version
   ```

2. **Maven 3.6+**
   ```bash
   mvn -version
   ```

3. **Node.js 18+** and npm
   ```bash
   node -version
   npm -version
   ```

4. **MongoDB** (Local installation or MongoDB Atlas)
   - Local: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Cloud: Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/harshith1476/DRIMS.git
cd AJP-Proj

# Backend setup
cd backend
mvn clean install
mvn spring-boot:run

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

**Default Login:**
- Admin: `admin@drims.edu` / `admin123`
- Faculty: `faculty@drims.edu` / `faculty123`

## 📖 Detailed Setup Instructions

### Step 1: Clone/Download the Project

Navigate to the project directory:
```bash
cd AJP-Proj
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/drims
   ```

### Step 3: Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   Or using the JAR file:
   ```bash
   mvn clean package
   java -jar target/drims-backend-1.0.0.jar
   ```

   Or using the provided scripts (Linux/Mac):
   ```bash
   chmod +x build.sh start.sh
   ./build.sh
   ./start.sh
   ```

4. Backend will start on `http://localhost:8080`

**Note:** The backend includes deployment scripts (`build.sh`, `start.sh`) for easy deployment on cloud platforms like Render.com.

### Step 4: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Frontend will start on `http://localhost:5173`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🔐 Default Credentials

The system automatically creates sample users on first startup:

### Admin Account
- **Email:** `admin@drims.edu`
- **Password:** `admin123`
- **Role:** ADMIN

### Faculty Accounts
- **Default Password:** `faculty123` (for all faculty)
- **Role:** FACULTY
- **Email Format:** `firstname.lastname@drims.edu`

**Complete Faculty Credentials:**
All faculty credentials are stored in separate files for easy reference:

- **`FACULTY_CREDENTIALS_COMPLETE.md`** - Complete list of all 109+ faculty members
- **`FACULTY_CREDENTIALS_PART1.md`** - Faculty members 1-40
- **`FACULTY_CREDENTIALS_PART2.md`** - Faculty members 41-109+

**Example faculty emails:**
- `renugadevi.r@drims.edu` / `faculty123`
- `sourav.mondal@drims.edu` / `faculty123`
- `dr.md.oqail.ahmad@drims.edu` / `faculty123`

**Note:** The system automatically creates all faculty accounts on first startup based on Excel data.

## 📁 Project Structure

```
AJP-Proj/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/drims/
│   │   │   │   ├── controller/     # REST Controllers (Auth, Faculty, Admin)
│   │   │   │   ├── service/        # Business Logic (10 services)
│   │   │   │   ├── repository/    # MongoDB Repositories (7 repositories)
│   │   │   │   ├── entity/        # MongoDB Documents (7 entities)
│   │   │   │   ├── dto/           # Data Transfer Objects (10 DTOs)
│   │   │   │   ├── security/      # JWT & Security Config
│   │   │   │   ├── config/        # Configuration Classes (Data Initialization)
│   │   │   │   └── util/          # Utility Classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── build.sh                    # Build script for deployment
│   ├── start.sh                    # Start script for deployment
│   ├── render.yaml                 # Render.com deployment config
│   └── pom.xml                     # Maven configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable Components (Layout)
│   │   ├── pages/                  # Page Components (Login, Dashboards, etc.)
│   │   ├── services/               # API Services (auth, faculty, admin)
│   │   ├── App.jsx                 # Main App Component
│   │   └── main.jsx                # Entry Point
│   ├── public/                     # Static assets (images, logo)
│   ├── package.json                # NPM dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── vercel.json                 # Vercel deployment config
│
├── FACULTY_CREDENTIALS*.md         # Faculty login credentials
├── DATA_LOADING_SUMMARY.md         # Data loading documentation
├── MONGODB_SCHEMA.md               # Database schema documentation
└── README.md                       # This file
```

## 🔧 Maven Commands

```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package application
mvn clean package

# Run application
mvn spring-boot:run

# Skip tests during build
mvn clean package -DskipTests

# Install dependencies
mvn clean install
```

## 📦 NPM Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄️ MongoDB Schema

### Collections

1. **users** - User authentication data
2. **faculty_profiles** - Faculty profile information
3. **targets** - Yearly research targets
4. **journals** - Journal publications
5. **conferences** - Conference publications
6. **patents** - Patent records
7. **book_chapters** - Book chapter publications

### Document Structure Example

**User:**
```json
{
  "_id": "...",
  "email": "faculty@drims.edu",
  "password": "$2a$10$...",
  "role": "FACULTY",
  "facultyId": "...",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

**FacultyProfile:**
```json
{
  "_id": "...",
  "employeeId": "EMP001",
  "name": "Dr. John Doe",
  "designation": "Professor",
  "department": "Computer Science",
  "researchAreas": ["Machine Learning", "AI"],
  "orcidId": "0000-0000-0000-0000",
  "scopusId": "1234567890",
  "googleScholarLink": "https://...",
  "email": "faculty@drims.edu",
  "userId": "..."
}
```

## 🔒 Security Features

- JWT-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configuration
- Secure file upload validation (PDF only)
- Authorization checks on all endpoints

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Faculty Endpoints (Requires FACULTY or ADMIN role)
- `GET /api/faculty/profile` - Get own profile
- `PUT /api/faculty/profile` - Update own profile
- `GET /api/faculty/targets` - Get own targets
- `POST /api/faculty/targets` - Create/update target
- `GET /api/faculty/journals` - Get own journals
- `POST /api/faculty/journals` - Create journal
- `PUT /api/faculty/journals/{id}` - Update journal
- `DELETE /api/faculty/journals/{id}` - Delete journal
- Similar endpoints for conferences, patents, book-chapters
- `POST /api/faculty/upload/{category}/{id}` - Upload PDF

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/faculty-profiles` - Get all profiles
- `GET /api/admin/targets` - Get all targets
- `GET /api/admin/journals` - Get all journals
- `GET /api/admin/conferences` - Get all conferences
- `GET /api/admin/patents` - Get all patents
- `GET /api/admin/book-chapters` - Get all book chapters
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/export?year={year}&category={category}` - Export to Excel

## 🚢 Deployment Guide

### Current Deployment

**Frontend:** Deployed on [Vercel](https://vercel.com/harshith1476s-projects/frontend/2H6cGLQq7JwkEcCd74mDy6wc2qM8)  
**Backend:** Deployed on [Render](https://dashboard.render.com/web/srv-d5f2d3h5pdvs73fssjng)  
**Live Application:** [ajp-pro.vercel.app](https://ajp-pro.vercel.app)

### Backend Deployment

#### Option 1: Render.com (Recommended)
The project includes `render.yaml` for easy deployment:

1. Push code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect `render.yaml` and deploy
4. Set environment variables in Render dashboard:
   - `SPRING_DATA_MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL(s)

**Current Backend Dashboard:** [Render Dashboard](https://dashboard.render.com/web/srv-d5f2d3h5pdvs73fssjng)

#### Option 2: JAR File (Local/Server)
```bash
cd backend
mvn clean package
java -jar target/drims-backend-1.0.0.jar
```

#### Option 3: Docker
Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/drims-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
docker build -t drims-backend .
docker run -p 8080:8080 drims-backend
```

#### Option 4: Other Cloud Platforms
- **Heroku**: Use Heroku CLI and deploy JAR
- **AWS Elastic Beanstalk**: Upload JAR file
- **Google Cloud Run**: Containerize and deploy
- **Azure App Service**: Deploy JAR or container

### Frontend Deployment

#### Option 1: Vercel (Recommended)
The project includes `vercel.json` for easy deployment:

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel`
4. Or connect GitHub repository to Vercel dashboard

**Note:** Update backend CORS settings to include your Vercel URL.

**Current Frontend Dashboard:** [Vercel Dashboard](https://vercel.com/harshith1476s-projects/frontend/2H6cGLQq7JwkEcCd74mDy6wc2qM8)

#### Option 2: Netlify
```bash
cd frontend
npm run build
# Deploy 'dist' folder to Netlify
```

#### Option 3: Build Static Files
```bash
cd frontend
npm run build
# Serve the 'dist' folder using any static file server
```

#### Option 4: Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Environment Variables

Update `application.properties` for production:
```properties
# MongoDB
spring.data.mongodb.uri=${MONGODB_URI}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# File Upload
file.upload.dir=${UPLOAD_DIR}

# CORS
cors.allowed-origins=${ALLOWED_ORIGINS}
```

## 🐛 Troubleshooting

### Backend Issues

1. **Port 8080 already in use:**
   - Change port in `application.properties`: `server.port=8081`

2. **MongoDB connection failed:**
   - Check MongoDB is running
   - Verify connection string in `application.properties`
   - Check network/firewall settings

3. **JWT token errors:**
   - Ensure JWT secret is set in `application.properties`
   - Check token expiration settings

### Frontend Issues

1. **CORS errors:**
   - Verify backend CORS configuration
   - Check `cors.allowed-origins` in `application.properties`

2. **API connection failed:**
   - Verify backend is running on port 8080
   - Check API base URL in `frontend/src/services/api.js`

3. **Build errors:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## 📚 Additional Documentation

The repository includes several documentation files:

- **`FACULTY_CREDENTIALS_COMPLETE.md`** - Complete list of all faculty credentials
- **`FACULTY_CREDENTIALS_PART1.md`** - Faculty members 1-40
- **`FACULTY_CREDENTIALS_PART2.md`** - Faculty members 41-109+
- **`DATA_LOADING_SUMMARY.md`** - Information about data initialization
- **`COMPREHENSIVE_DATA_LOADING_COMPLETE.md`** - Complete data loading documentation
- **`MONGODB_SCHEMA.md`** - Detailed database schema information

## 📝 Important Notes

- File uploads are stored in the `uploads` directory (configurable)
- Only PDF files are accepted for document uploads
- JWT tokens expire after 24 hours (configurable)
- All passwords are hashed using BCrypt
- Faculty can only view/edit their own data
- Admin has read-only access to all data
- The system automatically initializes with sample data on first startup
- All faculty accounts are created automatically from Excel data

## 🤝 Contributing

This is an academic project. Contributions are welcome! For improvements:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow Java and JavaScript coding conventions
- Write meaningful commit messages
- Update documentation for new features
- Test your changes before submitting PR

## 📄 License

This project is created for academic purposes.

## 👨‍💻 Author

**Harshith**  
Developed as part of Advanced Java Programming (AJP) project.

- GitHub: [@harshith1476](https://github.com/harshith1476)
- Repository: [DRIMS](https://github.com/harshith1476/DRIMS)

## 🎓 Academic Use

This project demonstrates:
- ✅ Full-stack development with Java and React
- ✅ RESTful API design
- ✅ JWT authentication and authorization
- ✅ MongoDB NoSQL database usage
- ✅ Modern UI/UX with Tailwind CSS
- ✅ Data visualization with Recharts
- ✅ Excel export functionality (Apache POI)
- ✅ File upload handling
- ✅ Role-based access control (RBAC)
- ✅ Production deployment (Render + Vercel)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- MongoDB for the flexible database solution
- All open-source contributors whose libraries made this project possible

---

**For any issues or questions, please refer to the code comments, documentation files, or open an issue on GitHub.**

