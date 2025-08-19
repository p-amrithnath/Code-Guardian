# Code Guardian - Development Setup in Cursor IDE

## Overview
This guide will help you set up and run the Code Guardian application (Spring Boot + React) entirely within Cursor IDE.

## Prerequisites

### System Requirements
- ✅ **Java**: Version 17 or higher (You have Java 23)
- ✅ **Node.js**: Version 18+ (You have Node.js 23.3.0)
- ✅ **npm**: Version 8+ (You have npm 10.9.0)
- ✅ **Git**: For version control

### Cursor IDE Extensions (Recommended)
The following extensions are recommended in `.vscode/extensions.json`:
- **Java Extension Pack** - Complete Java development
- **Spring Boot Extension Pack** - Spring Boot support
- **ES7+ React/Redux/React-Native snippets** - React development
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **Tailwind CSS IntelliSense** - CSS framework support

## Project Structure

```
Code-Guardian/
├── backend/           # Spring Boot application
│   ├── src/main/java/com/codeguardian/
│   │   ├── CodeGuardianApplication.java    # Main application class
│   │   ├── controller/                     # REST controllers
│   │   ├── service/                        # Business logic
│   │   └── model/                          # Data models
│   ├── src/main/resources/
│   │   └── application.properties          # Backend configuration
│   ├── pom.xml                            # Maven dependencies
│   └── mvnw.cmd                           # Maven wrapper (Windows)
├── frontend/          # React application
│   ├── src/
│   │   ├── App.js                         # Main React component
│   │   ├── components/                    # React components
│   │   └── api.js                         # API client
│   ├── package.json                       # Node.js dependencies
│   └── public/                            # Static assets
├── .vscode/           # Cursor IDE configuration
├── package.json       # Root package.json with development scripts
└── README.md
```

## Setup Steps

### 1. Clone and Navigate to Project
```bash
cd C:\Project\Code-Guardian
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Verify Backend Dependencies
The backend uses Maven wrapper, so no additional installation needed:
```bash
cd backend
./mvnw.cmd compile
```

## Running the Application

### Option 1: Using NPM Scripts (Recommended)

From the project root directory:

```bash
# Run frontend only
npm run dev:frontend

# Run backend only  
npm run dev:backend

# Run both frontend and backend
npm run dev:both
```

### Option 2: Manual Terminal Commands

**Terminal 1 - Backend (Spring Boot):**
```bash
cd backend
./mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend (React):**
```bash
cd frontend
npm start
```

### Option 3: Using Cursor IDE Debug Configuration

1. Open the **Run and Debug** panel (Ctrl+Shift+D)
2. Select one of the configurations:
   - **Launch React App** - Start frontend only
   - **Launch Spring Boot App** - Start backend only
   - **Launch Full Stack App** - Start both simultaneously

## Application URLs

- **Frontend (React)**: http://localhost:3000
- **Backend (Spring Boot)**: http://localhost:8080
- **API Health Check**: http://localhost:8080/api/health
- **Backend Actuator**: http://localhost:8080/actuator/health

## Development Workflow in Cursor IDE

### 1. Opening the Project
1. Open Cursor IDE
2. File → Open Folder → Select `C:\Project\Code-Guardian`
3. Cursor will automatically detect the Java and React projects

### 2. Java Development
- The IDE will automatically configure Java settings from `.vscode/settings.json`
- Maven integration is enabled for dependency management
- Spring Boot features are available through extensions

### 3. React Development
- Hot reload is enabled for instant updates
- ESLint and Prettier are configured for code quality
- Tailwind CSS support for styling

### 4. Debugging
- Set breakpoints in Java files for backend debugging
- Use browser developer tools for frontend debugging
- Chrome debugging is configured for React components

## Common Commands

### Backend Commands
```bash
# Compile the application
./mvnw.cmd compile

# Run tests
./mvnw.cmd test

# Package as JAR
./mvnw.cmd package

# Clean build
./mvnw.cmd clean
```

### Frontend Commands
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Check for vulnerabilities
npm audit
```

## Configuration

### Backend Configuration (`backend/src/main/resources/application.properties`)
- Server runs on port 8080
- CORS enabled for frontend communication
- Logging configured for development
- File upload limits set to 1MB

### Frontend Configuration (`frontend/package.json`)
- Proxy configured to backend (localhost:8080)
- React development server on port 3000
- Build tools configured for modern React

## Troubleshooting

### Frontend Issues
- **react-scripts not found**: Ensure `react-scripts` version is correct (5.0.1)
- **Port 3000 in use**: Kill existing React processes or use different port
- **Build failures**: Clear node_modules and reinstall

### Backend Issues
- **Port 8080 in use**: Change server.port in application.properties
- **Java version mismatch**: Ensure JAVA_HOME points to Java 17+
- **Maven issues**: Use the wrapper `./mvnw.cmd` instead of global maven

### General Issues
- **Git repository**: Initialize with `git init` if needed
- **SonarLint errors**: Make initial commit to resolve NoHeadException
- **Extension issues**: Install recommended extensions from `.vscode/extensions.json`

## Production Deployment

### Building for Production
```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Build both
npm run build
```

### Environment Variables
Create `.env` files for different environments:
- `.env.development` - Development settings
- `.env.production` - Production settings

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [Cursor IDE Documentation](https://cursor.sh/docs)
- [Maven Documentation](https://maven.apache.org/guides/)

## Support

For issues specific to this setup:
1. Check this documentation first
2. Verify all prerequisites are met
3. Check application logs in Cursor's integrated terminal
4. Ensure both frontend and backend are running on correct ports 