const API_URL = '/api';

/**
 * Custom fetch wrapper that automatically handles 401 Unauthorized errors
 * and ensures credentials (cookies) are sent.
 */
const apiFetch = async (url, options = {}) => {
  options.credentials = 'include';
  
  if (!(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  let response = await fetch(url, options);

  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        response = await fetch(url, options);
      }
    } catch (error) {
      console.error('Silent refresh failed', error);
    }
  }

  return response;
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

const adminService = {
  // Dashboard
  getStats: async () => {
    const res = await apiFetch(`${API_URL}/admin/dashboard/stats`);
    return handleResponse(res);
  },

  // Careers
  getCareers: async () => {
    const res = await apiFetch(`${API_URL}/admin/careers`);
    return handleResponse(res);
  },
  createCareer: async (data) => {
    const res = await apiFetch(`${API_URL}/admin/careers`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateCareer: async (id, data) => {
    const res = await apiFetch(`${API_URL}/admin/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  deleteCareer: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/careers/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Roadmaps
  getRoadmaps: async (careerId) => {
    const res = await apiFetch(`${API_URL}/admin/careers/${careerId}/roadmaps`);
    return handleResponse(res);
  },
  createRoadmap: async (data) => {
    const res = await apiFetch(`${API_URL}/admin/careers/roadmaps`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Modules & Topics
  getModules: async (roadmapId) => {
    const res = await apiFetch(`${API_URL}/admin/careers/roadmaps/${roadmapId}/modules`);
    return handleResponse(res);
  },
  createModule: async (data) => {
    const res = await apiFetch(`${API_URL}/admin/careers/modules`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  createTopic: async (data) => {
    const res = await apiFetch(`${API_URL}/admin/careers/topics`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Users
  getUsers: async () => {
    const res = await apiFetch(`${API_URL}/admin/users`);
    return handleResponse(res);
  },
  updateUserRole: async (id, role) => {
    const res = await apiFetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify(role)
    });
    return handleResponse(res);
  },
  blockUser: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/block/${id}`, {
      method: 'PUT'
    });
    return handleResponse(res);
  },
  unblockUser: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/unblock/${id}`, {
      method: 'PUT'
    });
    return handleResponse(res);
  },
  deleteUser: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },
  getUserCareer: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/${id}/career`);
    return handleResponse(res);
  },
  getUserRoadmap: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/${id}/roadmap`);
    return handleResponse(res);
  },
  getUserProgress: async (id) => {
    const res = await apiFetch(`${API_URL}/admin/users/${id}/progress`);
    return handleResponse(res);
  },


};

export default adminService;
