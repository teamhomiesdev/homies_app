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

  getPosts: async (page: number = 1, limit: number = 10, type: 'HELP' | 'SOCIAL' | 'TRUE_EVENTS' = 'HELP'): Promise<any> => {
    const response = await api.get('/posts', {
      params: { page, limit, type },
    });
    return response.data;
  },

  toggleLike: async (postId: string): Promise<any> => {
    const response = await api.post(`/posts/${postId}/toggle-like`);
    return response.data;
  },

  getPostDetails: async (postId: string): Promise<any> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // FIX: Conditionally construct query parameters to appease the strict backend requirement
  getComments: async (page: number = 1, limit: number = 5, commentId: string = '', postId: string = ''): Promise<any> => {
    const queryParams: any = { page, limit };

    if (commentId) {
      queryParams.commentId = commentId; // If getting replies, target the parent comment node only
    } else if (postId) {
      queryParams.postId = postId;       // Otherwise, target the top-level root post thread
    }

    const response = await api.get('/comments', {
      params: queryParams,
    });
    return response.data;
  },

  createComment: async (payload: { postId: string; content: string; parentCommentId?: string }): Promise<any> => {
    const response = await api.post('/comments', payload);
    return response.data;
  },

  toggleCommentLike: async (commentId: string): Promise<any> => {
    const response = await api.post(`/comments/${commentId}/toggle-like`);
    return response.data;
  },
};