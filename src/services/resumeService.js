const API_URL = '/api/resume';

export const resumeService = {
  getMyResume: async () => {
    const response = await fetch(`${API_URL}/my-resume`, {
      credentials: 'include'
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch resume: ${response.statusText}`);
    }
    return response.json();
  },

  createResume: async (resumeData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resumeData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create resume: ${response.statusText}`);
    }
    return response.json();
  },

  updateResume: async (id, resumeData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resumeData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update resume: ${response.statusText}`);
    }
    return response.json();
  },

  deleteResume: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete resume: ${response.statusText}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  },

  downloadResume: async () => {
    const response = await fetch(`${API_URL}/download`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Failed to download resume: ${response.statusText}`);
    }
    return response.blob();
  }
};
