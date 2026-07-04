import api from './api';

export const getExpertsList = async (page: number, expert: string) => {
  try {
    const response = await api.get(`/users/experts`);
    // const response = await api.get(`/users/experts?page=${page}&expert=${expert}&limit=10`);
    return response.data;
  } catch (error) {
    console.error('Error in getExpertsList service:', error);
    throw error;
  }
};

export const getConversationsList = async (page: number) => {
  try {
    const response = await api.get(`/chats/conversations?page=${page}&limit=10`);
    return response.data;
  } catch (error) {
    console.error('Error in getConversationsList service:', error);
    throw error;
  }
};