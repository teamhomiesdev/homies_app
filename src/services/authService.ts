import api from './api';

export const loginApi = async (payload: any) => {
  const response = await api.post('/login', payload);
  return response.data;
};