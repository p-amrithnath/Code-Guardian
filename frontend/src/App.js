import React, { useEffect, useState } from 'react';
import { healthCheck, scanCode } from './api';
import './App.css';
import CodeInput from './components/CodeInput';
import ScanResults from './components/ScanResults';

function App() {
  const [scanResults, setScanResults] = useState(null);
  const [scanSummary, setScanSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('unknown');

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await healthCheck();
      setBackendStatus('connected');
    } catch (err) {
      setBackendStatus('disconnected');
      console.error('Backend health check failed:', err);
    }
  };

  const handleScan = async (code, language, filename) => {
    setIsLoading(true);
    setError('');
    setScanResults(null);
    setScanSummary(null);

    try {
      const response = await scanCode(code, language, filename);
      
      if (response.success) {
        setScanResults(response.results);
        setScanSummary(response.summary);
      } else {
        setError(response.message || 'Scan failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during scanning');
      console.error('Scan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewScan = () => {
    setScanResults(null);
    setScanSummary(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl">🛡️</span>
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Code Guardian
                </h1>
              </div>
              <nav className="ml-10 flex space-x-8">
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Scanner
                </span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Backend status indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500' : 
                  backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {backendStatus === 'connected' ? 'Backend Connected' : 
                   backendStatus === 'disconnected' ? 'Backend Offline' : 'Checking...'}
                </span>
              </div>
              
              <button
                onClick={checkBackendHealth}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Check backend status"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Lightweight Code Security Scanner
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Identify potential security flaws, hardcoded secrets, and unsafe coding practices 
            in your code with our rule-based scanning engine.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Detection</h3>
            <p className="text-gray-600 text-sm">
              Detect hardcoded secrets, API keys, passwords, and other sensitive data
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unsafe Practices</h3>
            <p className="text-gray-600 text-sm">
              Identify dangerous functions like eval(), unsafe imports, and SQL injection risks
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Results</h3>
            <p className="text-gray-600 text-sm">
              Get instant feedback with detailed suggestions for fixing security issues
            </p>
          </div>
        </div>

        {/* Backend offline warning */}
        {backendStatus === 'disconnected' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Backend Service Unavailable
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The backend scanning service is currently offline. Please make sure the Spring Boot backend is running on localhost:8085.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main application content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Input Section */}
          <div className="space-y-6">
            <CodeInput
              onScan={handleScan}
              isLoading={isLoading}
            />
            
            {/* Quick tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Quick Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload files up to 1MB in size</li>
                <li>• Try the sample code to see the scanner in action</li>
                <li>• Use the preview mode to review your code with syntax highlighting</li>
                <li>• Results are filtered by severity and issue type</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <ScanResults
              results={scanResults}
              summary={scanSummary}
              isLoading={isLoading}
              error={error}
            />
            
            {/* Action buttons */}
            {(scanResults || error) && (
              <div className="flex justify-center">
                <button
                  onClick={handleNewScan}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Start New Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Security Checks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔐 Secrets Detection</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• API Keys</li>
                <li>• Passwords</li>
                <li>• JWT Secrets</li>
                <li>• Database URLs</li>
                <li>• Private Keys</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Unsafe Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• eval() usage</li>
                <li>• subprocess shell=True</li>
                <li>• os.system() calls</li>
                <li>• Dangerous imports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🚨 Vulnerabilities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SQL Injection</li>
                <li>• XSS Vulnerabilities</li>
                <li>• Weak Random Generation</li>
                <li>• Path Traversal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📋 Code Quality</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hardcoded URLs</li>
                <li>• Commented Credentials</li>
                <li>• Insecure Configurations</li>
                <li>• Best Practice Violations</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Code Guardian - Lightweight Security Scanner
            </p>
            <p className="text-sm text-gray-500">
              Built with React & Spring Boot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 