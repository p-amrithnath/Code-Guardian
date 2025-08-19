# 🛡️ Code Guardian

A lightweight, rule-based code scanning tool that helps developers identify potential security flaws, hardcoded secrets, and unsafe coding practices in real-time.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security Rules](#-security-rules)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Phase 1: MVP (Rule-Based Scanning)
- **Code Input Interface**: Paste or upload code snippets with syntax highlighting
- **Rule-Based Scanner**: Detect hardcoded secrets, unsafe imports, and suspicious patterns
- **Real-time Results**: Line-by-line analysis with severity indicators
- **REST API**: Clean JSON API for frontend-backend communication
- **Responsive UI**: Modern, accessible interface built with React and Tailwind CSS

### Supported Security Checks
- 🔐 **Secrets Detection**: API keys, passwords, JWT secrets, database URLs, private keys
- ⚠️ **Unsafe Practices**: eval() usage, subprocess with shell=True, os.system() calls
- 🚨 **Vulnerabilities**: SQL injection, XSS vulnerabilities, weak random generation
- 📋 **Code Quality**: Hardcoded URLs, commented credentials

## 🏗️ Architecture

### Backend (Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.0
- **Build Tool**: Maven
- **Key Dependencies**: Lombok, Spring Web, Jackson
- **API Format**: REST (JSON)

### Frontend (React)
- **Language**: JavaScript
- **Framework**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Syntax Highlighting**: React Syntax Highlighter

### Communication
- **Type**: Client-Server (RESTful)
- **Protocol**: JSON over HTTP
- **CORS**: Configured for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
./mvnw spring-boot:run

# Or if you prefer to build first
./mvnw clean package
java -jar target/code-guardian-backend-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

### Quick Start (Recommended)
For the fastest setup, use the provided startup scripts:

**Linux/macOS:**
```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

**Windows:**
```batch
# Run the batch file
start.bat
```

### Manual Setup
If you prefer to start services manually:

### Testing the Application
1. Open your browser to `http://localhost:3000`
2. Try one of the sample code snippets
3. Click "Scan Code" to see security issues detected
4. Review results with severity levels and suggestions

## 📁 Project Structure

```
Code-Guardian/
├── backend/
│   ├── src/main/java/com/codeguardian/
│   │   ├── CodeGuardianApplication.java     # Main Spring Boot application
│   │   ├── controller/
│   │   │   └── ScanController.java          # REST API endpoints
│   │   ├── service/
│   │   │   └── ScannerService.java          # Core scanning logic
│   │   └── model/
│   │       ├── ScanResult.java              # Result data model
│   │       └── ScanRequest.java             # Request data model
│   ├── src/main/resources/
│   │   └── application.properties           # Backend configuration
│   └── pom.xml                              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeInput.js             # Code input component
│   │   │   └── ScanResults.js           # Results display component
│   │   ├── App.js                       # Main React component
│   │   ├── api.js                       # API communication
│   │   ├── App.css                      # Styles with Tailwind
│   │   └── index.js                     # React entry point
│   ├── public/
│   │   ├── index.html                   # HTML template
│   │   └── manifest.json                # PWA manifest
│   ├── package.json                     # Frontend dependencies
│   ├── tailwind.config.js               # Tailwind configuration
│   └── postcss.config.js                # PostCSS configuration
├── start.sh                             # Unix startup script
├── start.bat                            # Windows startup script
└── README.md                            # This file
```

## 📡 API Documentation

### Endpoints

#### `POST /api/scan`
Scan code for security vulnerabilities.

**Request:**
```json
{
  "code": "const apiKey = \"sk-1234567890abcdef\";",
  "language": "javascript",
  "filename": "example.js"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "line": 1,
      "type": "Hardcoded API Key",
      "message": "Found: hardcoded api key",
      "suggestion": "Store API keys in environment variables or secure configuration files",
      "severity": "HIGH",
      "codeSnippet": "const apiKey = \"sk-1234567890abcdef\";"
    }
  ],
  "summary": {
    "totalIssues": 1,
    "criticalIssues": 0,
    "highIssues": 1,
    "mediumIssues": 0,
    "lowIssues": 0,
    "scanTime": "2024-01-01T12:00:00.000Z"
  }
}
```

#### `GET /api/health`
Check backend service health.

#### `GET /api/rules`
Get available security rules and categories.

#### `POST /api/validate`
Validate code syntax and get basic metrics.

## 🔒 Security Rules

### Secrets Detection
- **API Keys**: Detects various API key patterns (16+ characters)
- **Passwords**: Hardcoded password assignments
- **JWT Secrets**: JWT signing keys and secrets
- **Database URLs**: Connection strings with credentials
- **Private Keys**: RSA and other private key patterns

### Unsafe Practices
- **eval() Usage**: JavaScript/Python eval function calls
- **Shell Injection**: subprocess calls with shell=True
- **OS Commands**: Direct os.system() usage
- **Dangerous Imports**: Risky serialization libraries

### Vulnerabilities
- **SQL Injection**: String concatenation in SQL queries
- **XSS**: innerHTML assignments with user input
- **Weak Random**: Math.random() for security purposes
- **Path Traversal**: Unsafe file path handling

## 🛠️ Development

### Adding New Security Rules
1. Edit `ScannerService.java`
2. Add new rule to `SECURITY_RULES` map:
```java
SECURITY_RULES.put("RULE_NAME", new SecurityRule(
    Pattern.compile("your-regex-pattern"),
    "Rule Description",
    "Fix suggestion",
    Severity.HIGH
));
```

### Running Tests
```bash
# Backend tests
./mvnw test

# Frontend tests
cd frontend
npm test
```

### Code Style
- Backend: Follow Java conventions, use Lombok
- Frontend: Use ESLint and Prettier
- Both: Write clear, documented code

## 🚀 Deployment

### Backend Deployment Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **Docker**: Build with included Dockerfile

### Frontend Deployment Options
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop `build` folder
- **GitHub Pages**: Use `gh-pages` package

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL (frontend)
- `PORT`: Server port (backend, default: 8080)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements (Phase 2)

- **AI Integration**: OpenAI API for advanced code analysis
- **Custom Rules**: User-defined security patterns
- **CI/CD Integration**: GitHub Actions, Jenkins support
- **Multiple Languages**: Expanded language support
- **Reporting**: PDF/HTML report generation
- **Team Features**: Multi-user support and collaboration

---

Built with ❤️ using Java Spring Boot and React 