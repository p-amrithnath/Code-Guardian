import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8085/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * Scan code for security vulnerabilities
 * @param {string} code - The code to scan
 * @param {string} language - Optional language hint
 * @param {string} filename - Optional filename
 * @returns {Promise} API response with scan results
 */
export const scanCode = async (code, language = null, filename = null) => {
  try {
    const response = await api.post('/scan', {
      code,
      language,
      filename,
    });
    return response.data;
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || 'Scan failed');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('Request failed: ' + error.message);
    }
  }
};

/**
 * Validate code before scanning
 * @param {string} code - The code to validate
 * @param {string} language - Optional language hint
 * @returns {Promise} API response with validation results
 */
export const validateCode = async (code, language = null) => {
  try {
    const response = await api.post('/validate', {
      code,
      language,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Validation failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Validation request failed: ' + error.message);
    }
  }
};

/**
 * Get available security rules
 * @returns {Promise} API response with available rules
 */
export const getAvailableRules = async () => {
  try {
    const response = await api.get('/rules');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to fetch rules');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Rules request failed: ' + error.message);
    }
  }
};

/**
 * Health check for the backend service
 * @returns {Promise} API response with health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Health check failed');
    } else if (error.request) {
      throw new Error('Backend service is not responding');
    } else {
      throw new Error('Health check request failed: ' + error.message);
    }
  }
};

export default api; 