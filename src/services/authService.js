// authService.js handles all HTTP requests related to authentication.
const API_URL = '/api';

/**
 * Helper to convert object to FormData for [FromForm] compatibility
 */
const toFormData = (obj) => {
  const formData = new FormData();
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined) {
      formData.append(key, obj[key]);
    }
  });
  return formData;
};

/**
 * Custom fetch wrapper that automatically handles 401 Unauthorized errors
 * by calling the refresh endpoint and retrying the original request.
 */
const apiFetch = async (url, options = {}) => {
  options.credentials = 'include'; // Ensure cookies are sent
  
  // Only set application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    // For FormData, let the browser set the Content-Type with boundary
    const { 'Content-Type': _, ...headers } = options.headers || {};
    options.headers = headers;
  }

  let response = await fetch(url, options);

  // If 401, try to refresh the token (exclude login, google, and refresh endpoints)
  if (response.status === 401 && 
      !url.includes('/auth/login') && 
      !url.includes('/auth/google') && 
      !url.includes('/auth/apple') && 
      !url.includes('/auth/refresh')) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        // Retry the original request
        response = await fetch(url, options);
      }
    } catch (error) {
      console.error('Silent refresh failed', error);
    }
  }

  if (!response.ok) {
    console.error(`API Error [${response.status}] at ${url}:`, response.statusText);
  }

  return response;
};

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData { fullName, email, password }
   */
  register: async (userData) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: toFormData({
          FullName: userData.fullName,
          Email: userData.email,
          Password: userData.password
        }),
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Log in an existing user
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: toFormData(credentials),
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
      
      return data; // returns user details (cookies are set automatically)
    } catch (error) {
      throw error;
    }
  },

  /**
   * Google Login
   */
  googleLogin: async (token) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/google`, {
        method: 'POST',
        body: toFormData({ token }),
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) {
        throw new Error(data.message || `Google login failed (Status: ${response.status})`);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apple Login
   */
  appleLogin: async (token) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/apple`, {
        method: 'POST',
        body: toFormData({ token }),
      });
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!response.ok) {
        throw new Error(data.message || `Apple login failed (Status: ${response.status})`);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Log out the user by clearing the cookies on backend
   */
  logout: async () => {
    try {
      await apiFetch(`${API_URL}/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to logout on server', error);
    }
  },

  /**
   * Fetch current user's profile
   */
  getProfile: async () => {
    try {
      const response = await apiFetch(`${API_URL}/user/me`, {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update User Profile
   * @param {Object} profileData 
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiFetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        body: toFormData(profileData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload Profile Photo
   * @param {File} file 
   */
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/user/upload-photo`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, browser will set it with boundary
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change User Password
   * @param {Object} passwordData { currentPassword, newPassword, confirmPassword }
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiFetch(`${API_URL}/user/change-password`, {
        method: 'POST',
        body: toFormData(passwordData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete User Account
   */
  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request Password Reset
   * @param {string} email 
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        body: toFormData({ Email: email }),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON Error Response:", text);
        throw new Error(`Server Error (${response.status}): ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error("forgotPassword API Error:", error);
      throw error;
    }
  },

  /**
   * Reset Password with token
   * @param {string} token 
   * @param {string} newPassword 
   */
  resetPassword: async (token, otp, newPassword) => {
    try {
      const response = await apiFetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        body: toFormData({ Token: token, Otp: otp, NewPassword: newPassword }),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON Error Response:", text);
        throw new Error(`Server Error (${response.status}): ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Reset failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error("resetPassword API Error:", error);
      throw error;
    }
  }
};
