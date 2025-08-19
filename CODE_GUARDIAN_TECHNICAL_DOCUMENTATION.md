# Code Guardian - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Why Code Guardian?](#why-code-guardian)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Backend Documentation](#backend-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [API Documentation](#api-documentation)
8. [Security Rules Engine](#security-rules-engine)
9. [Setup and Installation](#setup-and-installation)
10. [Deployment Guide](#deployment-guide)
11. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Code Guardian** is a lightweight, rule-based code security scanner designed to detect common security vulnerabilities and anti-patterns in source code. The application provides real-time scanning capabilities through a modern web interface, helping developers identify and fix security issues early in the development cycle.

### Key Features
- 🔍 **Real-time Code Scanning**: Instant analysis of pasted code snippets
- 🛡️ **Security-First Approach**: Focuses on detecting critical security vulnerabilities
- 🎯 **Rule-Based Detection**: Uses pattern matching for reliable vulnerability detection
- 🌐 **Web-Based Interface**: Modern React frontend with intuitive user experience
- 📊 **Detailed Reporting**: Comprehensive scan results with severity levels and remediation advice
- 🔧 **Developer-Friendly**: Easy to set up and integrate into development workflows

---

## Why Code Guardian?

### Problem Statement
Modern software development faces significant security challenges:
- **Increasing Security Threats**: Cyber attacks targeting application vulnerabilities
- **Late Detection**: Security issues discovered after deployment are expensive to fix
- **Knowledge Gaps**: Not all developers are security experts
- **Tool Complexity**: Enterprise security tools are often too complex for individual developers
- **Integration Challenges**: Difficulty integrating security scanning into development workflows

### Solution Approach
Code Guardian addresses these challenges by providing:

1. **Early Detection**: Catch security issues during development
2. **Educational Value**: Provides explanations and remediation advice
3. **Lightweight Design**: Fast, focused scanning without heavy infrastructure
4. **Accessibility**: Simple web interface accessible to all skill levels
5. **Pattern-Based Detection**: Reliable detection using proven security patterns

### Target Audience
- **Individual Developers**: Personal security code review
- **Small Teams**: Quick security validation before commits
- **Educational Institutions**: Teaching secure coding practices
- **Code Review Process**: Additional layer in peer review workflows
- **Open Source Projects**: Community-driven security validation

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │◄──────────────────►│                 │
│  React Frontend │                    │ Spring Boot     │
│  (Port 3000)    │                    │ Backend         │
│                 │                    │ (Port 8083)     │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│                 │                    │                 │
│ Browser Storage │                    │ Security Rules  │
│ (Local State)   │                    │ Engine          │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘
```

### Component Architecture

#### Frontend Components
```
App.js (Main Application)
├── CodeInput.jsx (Code Editor Component)
├── ScanResults.jsx (Results Display)
├── SecuritySummary.jsx (Summary Statistics)
├── RuleItem.jsx (Individual Rule Display)
└── StatusIndicator.jsx (Connection Status)
```

#### Backend Components
```
CodeGuardianApplication.java (Main Spring Boot App)
├── Controller Layer
│   └── ScanController.java (REST API Endpoints)
├── Service Layer
│   └── ScannerService.java (Business Logic)
├── Model Layer
│   ├── ScanRequest.java (Request DTOs)
│   └── ScanResult.java (Response DTOs)
└── Configuration
    └── CORS Configuration (Cross-Origin Setup)
```

### Data Flow

1. **User Input**: Developer pastes code into React frontend
2. **Request Formation**: Frontend creates ScanRequest JSON payload
3. **API Call**: HTTP POST to backend `/api/scan` endpoint
4. **Security Analysis**: Backend applies security rules to code
5. **Response Generation**: Backend returns ScanResult with findings
6. **Result Display**: Frontend renders results with severity indicators
7. **User Action**: Developer reviews findings and applies fixes

---

## Technology Stack

### Frontend Technologies

#### Core Framework
- **React 18.2.0**: Modern JavaScript library for building user interfaces
- **JavaScript ES6+**: Modern JavaScript features and syntax
- **HTML5 & CSS3**: Semantic markup and modern styling

#### Development Tools
- **React Scripts 5.0.1**: Build toolchain and development server
- **Create React App**: Project bootstrapping and configuration
- **npm**: Package management and dependency resolution

#### UI/UX Libraries
- **Tailwind CSS 3.3.6**: Utility-first CSS framework for rapid styling
- **React Syntax Highlighter 15.6.1**: Code syntax highlighting
- **Axios 1.6.2**: HTTP client for API communication

#### Testing & Quality
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting and consistency

### Backend Technologies

#### Core Framework
- **Spring Boot 3.2.0**: Enterprise Java application framework
- **Java 17+**: Modern Java with latest language features
- **Maven**: Build automation and dependency management

#### Spring Ecosystem
- **Spring Web**: RESTful web services and MVC framework
- **Spring Boot Starter Web**: Web application auto-configuration
- **Spring Boot Validation**: Input validation and data binding
- **Spring Boot Actuator**: Production monitoring and management

#### Development Tools
- **Lombok 1.18.30**: Boilerplate code reduction
- **Jackson**: JSON serialization and deserialization
- **SLF4J + Logback**: Logging framework and implementation

#### Testing Framework
- **JUnit 5**: Unit testing framework
- **Spring Boot Test**: Integration testing support
- **Mockito**: Mocking framework for unit tests

---

## Backend Documentation

### Project Structure
```
backend/
├── src/main/java/com/codeguardian/
│   ├── CodeGuardianApplication.java     # Main application entry point
│   ├── controller/
│   │   └── ScanController.java          # REST API endpoints
│   ├── service/
│   │   └── ScannerService.java          # Core scanning logic
│   └── model/
│       ├── ScanRequest.java             # Request data model
│       └── ScanResult.java              # Response data model
├── src/main/resources/
│   └── application.properties           # Application configuration
├── src/test/java/                       # Test files
├── pom.xml                             # Maven dependencies
└── mvnw.cmd                            # Maven wrapper
```

### Core Components

#### 1. CodeGuardianApplication.java
**Purpose**: Main Spring Boot application class with CORS configuration

**Key Features**:
- Application bootstrap and configuration
- Global CORS policy for cross-origin requests
- Bean definitions and dependency injection setup

**CORS Configuration**:
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOriginPatterns("http://localhost:3000", "http://127.0.0.1:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    };
}
```

#### 2. ScanController.java
**Purpose**: REST API controller handling HTTP requests

**Endpoints**:
- `GET /api/health`: System health check
- `POST /api/scan`: Code security scanning
- `GET /api/rules`: Available security rules

**Key Features**:
- Input validation using Bean Validation
- Comprehensive error handling
- Structured JSON responses
- Request/response logging

#### 3. ScannerService.java
**Purpose**: Core business logic for security scanning

**Key Components**:
- **Security Rules Engine**: Pattern-based vulnerability detection
- **Code Analysis**: Multi-language code parsing
- **Result Aggregation**: Severity classification and statistics
- **Performance Optimization**: Efficient pattern matching

**Security Rules Categories**:
1. **Secrets Detection**: API keys, passwords, tokens
2. **Code Injection**: SQL injection, XSS vulnerabilities
3. **Unsafe Practices**: Dangerous function usage
4. **Code Quality**: Hardcoded values, poor practices

#### 4. Data Models

**ScanRequest.java**:
```java
public class ScanRequest {
    @NotBlank(message = "Code content cannot be empty")
    @Size(max = 1000000, message = "Code content too large (max 1MB)")
    private String code;
    
    private String language;  // Optional language hint
    private String filename;  // Optional filename
}
```

**ScanResult.java**:
```java
public class ScanResult {
    private String ruleId;           // Unique rule identifier
    private String title;            // Human-readable title
    private Severity severity;       // CRITICAL, HIGH, MEDIUM, LOW
    private int line;               // Line number in code
    private int column;             // Column position
    private String message;         // Detailed description
    private String recommendation;  // Fix suggestion
}
```

### Configuration

#### application.properties
```properties
# Server Configuration
server.port=8083
server.servlet.context-path=/

# Application Information
spring.application.name=Code Guardian Security Scanner
info.app.name=Code Guardian
info.app.description=Lightweight rule-based code security scanner
info.app.version=1.0.0

# CORS Configuration
spring.web.cors.allowed-origin-patterns=http://localhost:3000,http://127.0.0.1:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=1MB
spring.servlet.multipart.max-request-size=1MB

# Actuator Endpoints
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
```

---

## Frontend Documentation

### Project Structure
```
frontend/
├── public/
│   ├── index.html                   # Main HTML template
│   └── favicon.ico                  # Application icon
├── src/
│   ├── components/
│   │   ├── CodeInput.jsx           # Code editor component
│   │   ├── ScanResults.jsx         # Results display component
│   │   ├── SecuritySummary.jsx     # Statistics summary
│   │   └── RuleItem.jsx            # Individual finding display
│   ├── App.js                      # Main application component
│   ├── App.css                     # Application styles
│   ├── api.js                      # API client configuration
│   └── index.js                    # React application entry point
├── package.json                    # Dependencies and scripts
├── .eslintrc.json                  # ESLint configuration
└── .prettierrc                     # Prettier configuration
```

### Core Components

#### 1. App.js
**Purpose**: Main application container and state management

**Key Features**:
- Application state management (scan results, loading states)
- Backend connectivity and health monitoring
- Error handling and user feedback
- Component orchestration

**State Management**:
```javascript
const [scanResults, setScanResults] = useState(null);
const [scanSummary, setScanSummary] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [backendStatus, setBackendStatus] = useState('unknown');
```

#### 2. CodeInput.jsx
**Purpose**: Code input interface with syntax highlighting

**Features**:
- Multi-language syntax highlighting
- Language detection and selection
- File upload support (future enhancement)
- Code validation and formatting

#### 3. ScanResults.jsx
**Purpose**: Display scan results and findings

**Features**:
- Severity-based color coding
- Expandable finding details
- Line-by-line code highlighting
- Export functionality (future enhancement)

#### 4. api.js
**Purpose**: Backend API communication layer

**Configuration**:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8083/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**API Functions**:
- `scanCode()`: Submit code for security analysis
- `healthCheck()`: Verify backend connectivity
- `getAvailableRules()`: Fetch security rules list
- `validateCode()`: Pre-scan code validation

### Styling and UX

#### Tailwind CSS Implementation
- **Utility-First Approach**: Rapid UI development
- **Responsive Design**: Mobile-first responsive layouts
- **Component Styling**: Consistent design system
- **Dark Mode Support**: Future enhancement ready

#### User Experience Features
- **Real-time Feedback**: Immediate scan results
- **Loading States**: Progress indicators during scanning
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliance considerations

---

## API Documentation

### Base URL
```
http://localhost:8083/api
```

### Authentication
Currently, no authentication is required. Future versions may implement API key authentication.

### Common Headers
```http
Content-Type: application/json
Accept: application/json
```

---

### Endpoints

#### 1. Health Check

**Endpoint**: `GET /api/health`

**Description**: Verify backend service availability and status

**Request**:
```http
GET /api/health
Host: localhost:8083
```

**Response**:
```json
{
  "status": "UP",
  "service": "Code Guardian Scanner",
  "version": "1.0.0"
}
```

**Status Codes**:
- `200 OK`: Service is healthy
- `503 Service Unavailable`: Service is down

---

#### 2. Code Security Scan

**Endpoint**: `POST /api/scan`

**Description**: Analyze code for security vulnerabilities

**Request**:
```http
POST /api/scan
Host: localhost:8083
Content-Type: application/json

{
  "code": "const apiKey = \"sk-1234567890abcdef\";\nconst password = \"mypassword123\";",
  "language": "javascript",
  "filename": "example.js"
}
```

**Request Parameters**:
- `code` (string, required): Source code to analyze (max 1MB)
- `language` (string, optional): Programming language hint
- `filename` (string, optional): Filename for context

**Success Response** (200 OK):
```json
{
  "success": true,
  "results": [
    {
      "ruleId": "API_KEY",
      "title": "Hardcoded API Key",
      "severity": "HIGH",
      "line": 1,
      "column": 15,
      "message": "Store API keys in environment variables or secure configuration files",
      "recommendation": "Use process.env.API_KEY instead of hardcoding"
    },
    {
      "ruleId": "PASSWORD",
      "title": "Hardcoded Password",
      "severity": "CRITICAL",
      "line": 2,
      "column": 18,
      "message": "Use environment variables or secure credential management",
      "recommendation": "Implement secure password storage"
    }
  ],
  "summary": {
    "totalIssues": 2,
    "criticalCount": 1,
    "highCount": 1,
    "mediumCount": 0,
    "lowCount": 0,
    "scanDuration": 45
  },
  "message": "Scan completed successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Code content cannot be empty",
  "results": []
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Scan failed",
  "message": "Internal processing error occurred",
  "results": []
}
```

**Status Codes**:
- `200 OK`: Scan completed successfully
- `400 Bad Request`: Invalid request parameters
- `413 Payload Too Large`: Code content exceeds size limit
- `500 Internal Server Error`: Server processing error

---

#### 3. Get Security Rules

**Endpoint**: `GET /api/rules`

**Description**: Retrieve available security rules and categories

**Request**:
```http
GET /api/rules
Host: localhost:8083
```

**Response**:
```json
{
  "success": true,
  "totalRules": 12,
  "categories": {
    "secrets": [
      "API Keys",
      "Passwords", 
      "JWT Secrets",
      "Database URLs",
      "Private Keys"
    ],
    "unsafe_practices": [
      "eval() usage",
      "subprocess with shell=True",
      "os.system()",
      "dangerous imports"
    ],
    "vulnerabilities": [
      "SQL Injection",
      "XSS Vulnerabilities", 
      "Weak Random Generation"
    ],
    "code_quality": [
      "Hardcoded URLs",
      "Commented Credentials"
    ]
  },
  "supportedLanguages": [
    "javascript",
    "python",
    "java",
    "php",
    "generic"
  ]
}
```

**Status Codes**:
- `200 OK`: Rules retrieved successfully
- `500 Internal Server Error`: Server error

---

### Error Handling

#### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error description",
  "timestamp": "2025-08-06T13:30:45.123Z",
  "path": "/api/scan"
}
```

#### Common Error Types
- **ValidationError**: Invalid request parameters
- **ProcessingError**: Server-side processing failure
- **TimeoutError**: Request processing timeout
- **ServiceUnavailable**: Backend service is down

---

## Security Rules Engine

### Rule Categories

#### 1. Secrets Detection
**Purpose**: Identify hardcoded sensitive information

**Patterns Detected**:
- **API Keys**: `api_key`, `apikey` with long alphanumeric values
- **Passwords**: `password`, `pwd`, `pass` with string values
- **JWT Secrets**: `jwt_secret`, `secret_key` patterns
- **Database URLs**: Connection strings with credentials
- **Private Keys**: SSH keys, certificate content

**Example Rule**:
```java
SECURITY_RULES.put("API_KEY", new SecurityRule(
    Pattern.compile("(?i)(api[_\\-]?key|apikey)\\s*[=:]\\s*['\"]([a-zA-Z0-9_\\-]{16,})['\"]"),
    "Hardcoded API Key",
    "Store API keys in environment variables or secure configuration files",
    Severity.HIGH
));
```

#### 2. Code Injection Vulnerabilities
**Purpose**: Detect potential injection attack vectors

**Patterns Detected**:
- **SQL Injection**: Dynamic SQL query construction
- **Command Injection**: Shell command execution
- **XSS**: Unescaped user input in HTML context
- **Path Traversal**: File system navigation patterns

#### 3. Unsafe Practices
**Purpose**: Identify dangerous coding patterns

**Patterns Detected**:
- **eval() Usage**: Dynamic code execution
- **Weak Randomization**: Predictable random number generation
- **Insecure Protocols**: HTTP instead of HTTPS
- **Debug Information**: Exposed debugging code

#### 4. Code Quality Issues
**Purpose**: Detect maintainability and security hygiene issues

**Patterns Detected**:
- **Hardcoded URLs**: Non-configurable endpoints
- **Commented Secrets**: Credentials in comments
- **TODO Security**: Incomplete security implementations

### Rule Definition Structure

```java
public class SecurityRule {
    private Pattern pattern;           // Regex pattern for detection
    private String title;             // Human-readable rule name
    private String message;           // Detailed description
    private Severity severity;        // Risk level assessment
    private String category;          // Rule classification
    private List<String> languages;  // Applicable languages
}
```

### Severity Levels

1. **CRITICAL**: Immediate security risk requiring urgent attention
   - Hardcoded passwords
   - Database credentials
   - Private keys

2. **HIGH**: Significant security vulnerability
   - API keys
   - JWT secrets
   - SQL injection patterns

3. **MEDIUM**: Moderate security concern
   - Weak randomization
   - Insecure protocols
   - Debug information

4. **LOW**: Code quality and minor security issues
   - Hardcoded URLs
   - TODO items
   - Style violations

---

## Setup and Installation

### Prerequisites

#### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Java**: Version 17 or higher (JDK recommended)
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For version control
- **IDE**: Cursor, VS Code, IntelliJ IDEA, or similar

#### Hardware Requirements
- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: 2GB free space for dependencies
- **Network**: Internet connection for dependency downloads

### Installation Steps

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/code-guardian.git
cd code-guardian
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Compile application (Maven wrapper handles dependencies)
./mvnw.cmd compile   # Windows
./mvnw compile       # macOS/Linux

# Run tests
./mvnw.cmd test

# Start backend server
./mvnw.cmd spring-boot:run
```

**Backend will start on**: http://localhost:8083

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend will start on**: http://localhost:3000

#### 4. Verify Installation
```bash
# Test backend health
curl http://localhost:8083/api/health

# Test frontend connectivity
# Open browser to http://localhost:3000
```

### Development Environment Configuration

#### Cursor IDE Setup
1. **Install Extensions**:
   - Java Extension Pack
   - Spring Boot Extension Pack
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

2. **Configure Workspace**:
   - Open project root in Cursor
   - Import Maven project
   - Configure Node.js environment

#### Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8083/api
REACT_APP_ENV=development
```

### Troubleshooting

#### Common Issues

**Backend Won't Start**:
- Verify Java version: `java -version`
- Check port availability: `netstat -an | findstr :8083`
- Review application logs for errors

**Frontend Build Fails**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Update npm: `npm install -g npm@latest`

**CORS Errors**:
- Verify backend CORS configuration
- Check frontend proxy settings
- Ensure both applications are running

---

## Deployment Guide

### Production Build

#### Backend Production Build
```bash
cd backend
./mvnw.cmd clean package -DskipTests
```

This creates `target/code-guardian-backend-0.0.1-SNAPSHOT.jar`

#### Frontend Production Build
```bash
cd frontend
npm run build
```

This creates `build/` directory with optimized static files.

### Deployment Options

#### 1. Standalone JAR Deployment
```bash
# Run backend JAR
java -jar backend/target/code-guardian-backend-0.0.1-SNAPSHOT.jar

# Serve frontend static files with web server (nginx, Apache)
```

#### 2. Docker Deployment

**Backend Dockerfile**:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/code-guardian-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**Frontend Dockerfile**:
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
EXPOSE 80
```

#### 3. Cloud Platform Deployment
- **AWS**: Elastic Beanstalk or ECS
- **Azure**: App Service or Container Instances
- **Google Cloud**: App Engine or Cloud Run
- **Heroku**: Git-based deployment

### Environment Configuration

#### Production application.properties
```properties
server.port=${PORT:8083}
spring.profiles.active=production
logging.level.com.codeguardian=WARN
management.endpoints.web.exposure.include=health
```

#### Environment Variables
```bash
# Backend
export JAVA_OPTS="-Xmx512m -Xms256m"
export SPRING_PROFILES_ACTIVE=production

# Frontend
export REACT_APP_API_URL=https://api.yourdomain.com
export REACT_APP_ENV=production
```

---

## Future Enhancements

### Planned Features

#### Phase 1: Core Improvements
- **File Upload Support**: Direct file scanning capability
- **Batch Scanning**: Multiple file processing
- **Enhanced Rules**: Extended vulnerability detection
- **Performance Optimization**: Faster scanning algorithms

#### Phase 2: Advanced Features
- **User Authentication**: Account management and history
- **Scan History**: Previous scan result storage
- **Custom Rules**: User-defined security patterns
- **Integration APIs**: CI/CD pipeline integration

#### Phase 3: Enterprise Features
- **Team Collaboration**: Shared scanning workspace
- **Reporting Dashboard**: Analytics and trends
- **SAML/SSO Integration**: Enterprise authentication
- **API Rate Limiting**: Usage control and monitoring

### Technology Roadmap

#### Backend Enhancements
- **Database Integration**: PostgreSQL for data persistence
- **Caching Layer**: Redis for performance optimization
- **Microservices**: Service decomposition for scalability
- **GraphQL API**: Flexible data querying

#### Frontend Improvements
- **TypeScript Migration**: Enhanced type safety
- **PWA Support**: Offline capability
- **Real-time Updates**: WebSocket integration
- **Mobile Responsive**: Enhanced mobile experience

#### DevOps and Operations
- **Monitoring**: Application performance monitoring
- **Logging**: Centralized log aggregation
- **Security**: Enhanced security scanning
- **Automation**: Automated testing and deployment

---

## Conclusion

Code Guardian represents a modern approach to application security, providing developers with an accessible tool for early vulnerability detection. The combination of Spring Boot's robust backend capabilities and React's dynamic frontend creates a powerful platform for security code analysis.

The project's architecture prioritizes simplicity, performance, and extensibility, making it suitable for individual developers, small teams, and educational purposes. With its rule-based detection engine and intuitive interface, Code Guardian helps bridge the gap between security awareness and practical implementation.

---

## Contact and Support

### Development Team
- **Project Lead**: Development Team
- **Backend Development**: Java/Spring Boot Team
- **Frontend Development**: React/JavaScript Team

### Resources
- **GitHub Repository**: https://github.com/your-org/code-guardian
- **Documentation**: https://docs.code-guardian.com
- **Issue Tracking**: https://github.com/your-org/code-guardian/issues

### License
This project is licensed under the MIT License. See LICENSE file for details.

---

*Document Version: 1.0*  
*Last Updated: August 6, 2025*  
*Generated for Code Guardian v1.0.0* 