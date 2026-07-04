import api from './api';

export const registerApi = async (payload: any) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const loginApi = async (payload: any) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const getHelpsApi = async () => {
  const response = await api.get('/helps');
  return response.data;
};

export const getInterestsApi = async () => {
  const response = await api.get('/interests');
  return response.data;
};

export const updateProfileApi = async (payload: { id: string; interests: string[]; helps: string[] }) => {
  const response = await api.put('/auth/update-profile', payload);
  return response.data;
};

export const getProfileApi = async (userId: string) => {
  const response = await api.get(`/auth/profile?userId=${userId}`);
  return response.data;
};

export const verifyFaceImage = async (base64Image: string) => {
  try {
    const response = await api.post(
      'https://api.homies.support/api/verification/image',
      { image: base64Image },
      { 
        timeout: 60000 // Force explicit 1 minute timeout (60,000 ms)
      }
    );
    return response.data;
  } catch (error) {
    console.error("Face verification API error:", error);
    throw error;
  }
};

export const updateVerificationStatus = async (payload: any) => {
  try {
    // Using your centralized api instance automatically applies the correct Base URL and headers
    const response = await api.patch('/auth/verification', payload);
    
    // Adjust based on your API instance's response structure (Axios typically wraps data in response.data)
    return response.data || response;
  } catch (error) {
    console.error('Error in updateVerificationStatus service:', error);
    throw error;
  }
};