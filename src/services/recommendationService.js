const API_URL = '/api';

export const recommendationService = {
  getAICareers: async () => {
    try {
      const response = await fetch(`${API_URL}/recommendations/ai-careers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Assumes credentials like cookies are handled by apiFetch-like wrapper or standard fetch
        // We'll use standard fetch with credentials: 'include' to be safe
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch AI career recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('getAICareers API Error:', error);
      throw error;
    }
  },
  getLearningPlan: async (targetCareer) => {
    try {
      const url = targetCareer 
        ? `${API_URL}/recommendations/learning-plan?targetCareer=${encodeURIComponent(targetCareer)}`
        : `${API_URL}/recommendations/learning-plan`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch learning plan');
      }

      return await response.json();
    } catch (error) {
      console.error('getLearningPlan API Error:', error);
      throw error;
    }
  },
  getStudyMaterials: async () => {
    try {
      const response = await fetch(`${API_URL}/recommendations/study-materials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch study materials');
      }

      return await response.json();
    } catch (error) {
      console.error('getStudyMaterials API Error:', error);
      throw error;
    }
  },
  getSyllabus: async (moduleName, targetCareer) => {
    try {
      const url = targetCareer 
        ? `${API_URL}/recommendations/syllabus?moduleName=${encodeURIComponent(moduleName)}&targetCareer=${encodeURIComponent(targetCareer)}`
        : `${API_URL}/recommendations/syllabus?moduleName=${encodeURIComponent(moduleName)}`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch syllabus');
      }

      return await response.json();
    } catch (error) {
      console.error('getSyllabus API Error:', error);
      throw error;
    }
  }
};
