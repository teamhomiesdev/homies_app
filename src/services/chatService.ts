// services/chatService.ts
import api from './api';

export const chatService = {
  /**
   * Initializes or fetches a conversation with an expert (Only called from Experts Tab)
   * POST /chats/conversations
   */
  createConversation: async (payload: { expertId: string }): Promise<any> => {
    const response = await api.post('/chats/conversations', payload);
    return response.data;
  },

  /**
   * Retrieves existing messages for a specific conversation
   * GET /conversations/:convId/messages
   */
  getConversationMessages: async (convId: string): Promise<any> => {
    const response = await api.get(`/chats/conversations/${convId}/messages`);
    return response.data;
  },
};