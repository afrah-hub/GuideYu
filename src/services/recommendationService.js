const API_URL = '/api';

export const recommendationService = {
  getAICareers: async (limit) => {
    try {
      const url = limit ? `${API_URL}/recommendations/ai-careers?limit=${limit}` : `${API_URL}/recommendations/ai-careers`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
  getSyllabus: async (moduleName, targetCareer, savedMapId) => {
    try {
      let url = targetCareer 
        ? `${API_URL}/recommendations/syllabus?moduleName=${encodeURIComponent(moduleName)}&targetCareer=${encodeURIComponent(targetCareer)}`
        : `${API_URL}/recommendations/syllabus?moduleName=${encodeURIComponent(moduleName)}`;
        
      if (savedMapId) {
        url += `&savedMapId=${savedMapId}`;
      }
        
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
