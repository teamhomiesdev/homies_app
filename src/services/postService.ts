import api from './api';

export const hashtagService = {
  getHashtags: async (): Promise<any> => {
    const response = await api.get('/hashtags');
    return response.data;
  },
};

export const postService = {
  uploadMediaFiles: async (formData: FormData): Promise<any> => {
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createPost: async (payload: {
    type: 'HELP' | 'SOCIAL';
    content: string;
    media: Array<{ type: string; uri: string }>;
    hashtags: string[];
  }): Promise<any> => {
    const response = await api.post('/posts', payload);
    return response.data;
  },

  // Dynamic feed pagination handling query transformations
  getPosts: async (page: number = 1, limit: number = 10, type: 'HELP' | 'SOCIAL' = 'HELP'): Promise<any> => {
    const response = await api.get('/posts', {
      params: {
        page,
        limit,
        type,
      },
    });
    return response.data;
  },

  toggleLike: async (postId: string): Promise<any> => {
    const response = await api.post(`/posts/${postId}/toggle-like`);
    return response.data;
  },
};