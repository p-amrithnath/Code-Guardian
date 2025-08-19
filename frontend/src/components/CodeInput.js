import React, { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeInput = ({ onScan, isLoading, onCodeChange }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [filename, setFilename] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  // Sample code examples for different languages
  const sampleCode = {
    javascript: `// Sample JavaScript code with potential security issues
const apiKey = "sk-1234567890abcdef"; // Hardcoded API key
const password = "admin123"; // Hardcoded password

function processData(userInput) {
    // Potential XSS vulnerability
    document.getElementById("output").innerHTML = userInput;
    
    // Using eval (dangerous)
    eval("console.log('" + userInput + "')");
    
    // Weak random generation
    const sessionId = Math.random().toString(36);
    
    return sessionId;
}`,
    python: `# Sample Python code with security vulnerabilities
import os
import subprocess

# Hardcoded secrets
API_KEY = "abc123def456"
DATABASE_URL = "mongodb://admin:password@localhost:27017/mydb"

def execute_command(user_input):
    # Dangerous subprocess usage
    subprocess.call(user_input, shell=True)
    
    # Using os.system (insecure)
    os.system(f"echo {user_input}")
    
    # SQL injection vulnerability
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    
    return query`,
    java: `// Sample Java code with potential issues
public class SecurityExample {
    // Hardcoded credentials
    private static final String JWT_SECRET = "my-super-secret-jwt-key";
    private static final String DB_PASSWORD = "admin123";
    
    public void processInput(String userInput) {
        // Potential SQL injection
        String query = "SELECT * FROM users WHERE id = " + userInput;
        
        // Hardcoded URL
        String apiEndpoint = "https://api.example.com/sensitive-data";
        
        // Weak random generation
        double randomValue = Math.random();
    }
}`,
  };

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setError('');
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  }, [onCodeChange]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('File size must be less than 1MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        handleCodeChange(content);
        setFilename(file.name);
        
        // Auto-detect language from file extension
        const extension = file.name.split('.').pop().toLowerCase();
        const langMap = {
          'js': 'javascript',
          'jsx': 'javascript',
          'ts': 'typescript',
          'tsx': 'typescript',
          'py': 'python',
          'java': 'java',
          'cpp': 'cpp',
          'c': 'c',
          'php': 'php',
          'rb': 'ruby',
          'go': 'go',
          'rs': 'rust',
        };
        if (langMap[extension]) {
          setLanguage(langMap[extension]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSampleLoad = (lang) => {
    setLanguage(lang);
    handleCodeChange(sampleCode[lang]);
    setFilename(`sample.${lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : 'java'}`);
  };

  const handleScan = () => {
    if (!code.trim()) {
      setError('Please enter some code to scan');
      return;
    }
    
    setError('');
    onScan(code, language, filename);
  };

  const clearCode = () => {
    handleCodeChange('');
    setFilename('');
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Code Input</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++</option>
            <option value="php">PHP</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
      </div>

      {/* Sample code buttons */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-sm font-medium text-gray-600">Quick samples:</span>
          <button
            onClick={() => handleSampleLoad('javascript')}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            JavaScript
          </button>
          <button
            onClick={() => handleSampleLoad('python')}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
          >
            Python
          </button>
          <button
            onClick={() => handleSampleLoad('java')}
            className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            Java
          </button>
        </div>
      </div>

      {/* File upload */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
            <input
              type="file"
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.txt"
              onChange={handleFileUpload}
            />
          </label>
          {filename && (
            <span className="text-sm text-gray-600">📄 {filename}</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Code input area */}
      <div className="mb-4">
        {showPreview && code ? (
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
              <span className="text-sm text-gray-600">Preview</span>
            </div>
            <div className="max-h-96 overflow-auto">
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  fontSize: '14px',
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Paste your code here or upload a file..."
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
          />
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handleScan}
            disabled={isLoading || !code.trim()}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isLoading || !code.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </div>
            ) : (
              'Scan Code'
            )}
          </button>
          <button
            onClick={clearCode}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {code.length > 0 && (
            <span>
              {code.split('\n').length} lines, {code.length} characters
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeInput; 