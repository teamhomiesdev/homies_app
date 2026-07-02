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