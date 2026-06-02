import axios from 'axios';

const API_URL = '/api/resume';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  };
};

export const resumeService = {
  getMyResume: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-resume`, getAuthHeader());
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createResume: async (resumeData) => {
    const response = await axios.post(API_URL, resumeData, getAuthHeader());
    return response.data;
  },

  updateResume: async (id, resumeData) => {
    const response = await axios.put(`${API_URL}/${id}`, resumeData, getAuthHeader());
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },
  
  downloadResume: async () => {
    const response = await axios.get(`${API_URL}/download`, {
      ...getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  }
};
