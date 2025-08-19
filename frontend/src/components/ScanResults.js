import React, { useState, useMemo } from 'react';

const ScanResults = ({ results, summary, isLoading, error }) => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Get severity color and icon
  const getSeverityConfig = (severity) => {
    const configs = {
      CRITICAL: {
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '🚨',
        badge: 'bg-red-500 text-white'
      },
      HIGH: {
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: '⚠️',
        badge: 'bg-orange-500 text-white'
      },
      MEDIUM: {
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: '⚡',
        badge: 'bg-yellow-500 text-white'
      },
      LOW: {
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: 'ℹ️',
        badge: 'bg-blue-500 text-white'
      }
    };
    return configs[severity] || configs.LOW;
  };

  // Filter results based on selected filters
  const filteredResults = useMemo(() => {
    if (!results) return [];
    
    return results.filter(result => {
      const severityMatch = selectedSeverity === 'all' || result.severity === selectedSeverity;
      const typeMatch = selectedType === 'all' || result.type.toLowerCase().includes(selectedType.toLowerCase());
      return severityMatch && typeMatch;
    });
  }, [results, selectedSeverity, selectedType]);

  // Get unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    if (!results) return [];
    return [...new Set(results.map(result => result.type))];
  }, [results]);

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-48">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">Scanning code...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Scan Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Great! Your code looks clean according to our security rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with summary */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Scan Results</h2>
        {summary && (
          <div className="text-sm text-gray-600">
            Scanned on {new Date(summary.scanTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{summary.totalIssues}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{summary.criticalIssues}</div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.highIssues}</div>
            <div className="text-sm text-orange-600">High</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.mediumIssues}</div>
            <div className="text-sm text-yellow-600">Medium</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.lowIssues}</div>
            <div className="text-sm text-blue-600">Low</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Severity:</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-600">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="ml-auto text-sm text-gray-600">
          Showing {filteredResults.length} of {results.length} issues
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {filteredResults.map((result, index) => {
          const config = getSeverityConfig(result.severity);
          const isExpanded = expandedItems.has(index);
          
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all ${config.borderColor} ${config.bgColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                      {result.severity}
                    </span>
                    <span className="text-sm font-medium text-gray-600">Line {result.line}</span>
                    <span className={`text-sm font-semibold ${config.color}`}>
                      {result.type}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${config.color} mb-2`}>
                    {result.message}
                  </p>
                  
                  {result.codeSnippet && (
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
                      <code>{result.codeSnippet}</code>
                    </div>
                  )}
                  
                  {isExpanded && result.suggestion && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <h4 className="text-sm font-medium text-green-800 mb-1">💡 Suggestion:</h4>
                      <p className="text-sm text-green-700">{result.suggestion}</p>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => toggleExpanded(index)}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Found {results.length} security issue{results.length !== 1 ? 's' : ''} in your code
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(results, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'security-scan-results.json';
                link.click();
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults; 