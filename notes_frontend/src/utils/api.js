// Base URL for the API - should be set via environment variables in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-2892-beta.beta01.cloud.kavia.ai:3001';

// PUBLIC_INTERFACE
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // PUBLIC_INTERFACE
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  // PUBLIC_INTERFACE
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  // PUBLIC_INTERFACE
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  // PUBLIC_INTERFACE
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

// Authentication API endpoints
// PUBLIC_INTERFACE
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} User data and token
   */
  async register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    return apiClient.get('/auth/profile');
  },

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken() {
    return apiClient.post('/auth/refresh');
  }
};

// Notes API endpoints
// PUBLIC_INTERFACE
export const notesAPI = {
  /**
   * Get all notes for the authenticated user
   * @returns {Promise<Array>} List of notes
   */
  async getNotes() {
    return apiClient.get('/notes');
  },

  /**
   * Get a specific note by ID
   * @param {string} noteId - Note ID
   * @returns {Promise<Object>} Note data
   */
  async getNote(noteId) {
    return apiClient.get(`/notes/${noteId}`);
  },

  /**
   * Create a new note
   * @param {Object} noteData - Note data
   * @param {string} noteData.title - Note title
   * @param {string} noteData.content - Note content
   * @returns {Promise<Object>} Created note data
   */
  async createNote(noteData) {
    return apiClient.post('/notes', noteData);
  },

  /**
   * Update an existing note
   * @param {string} noteId - Note ID
   * @param {Object} noteData - Updated note data
   * @returns {Promise<Object>} Updated note data
   */
  async updateNote(noteId, noteData) {
    return apiClient.put(`/notes/${noteId}`, noteData);
  },

  /**
   * Delete a note
   * @param {string} noteId - Note ID
   * @returns {Promise<void>}
   */
  async deleteNote(noteId) {
    return apiClient.delete(`/notes/${noteId}`);
  },

  /**
   * Search notes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} List of matching notes
   */
  async searchNotes(query) {
    return apiClient.get(`/notes/search?q=${encodeURIComponent(query)}`);
  }
};

export default apiClient;
