import axiosInstance from './axiosInstance';

// 创建评论
export const createComment = async (commentData) => {
  return axiosInstance.post('/comments', commentData);
};

// 查询评论详情
export const getComment = async (commentId) => {
  return axiosInstance.get(`/comments/${commentId}`);
};

// 查询某个书籍的所有评论
export const getCommentsByBook = async (bookId) => {
  return axiosInstance.get(`/comments/books/${bookId}`);
};

// 查询某个用户的所有评论
export const getCommentsByUser = async (userId) => {
    return axiosInstance.get(`/comments/users/${userId}`);
  };

// 更新评论
export const updateComment = async (commentId, commentData) => {
  return axiosInstance.put(`/comments/${commentId}`, commentData);
};

// 删除评论
export const deleteComment = async (commentId) => {
  return axiosInstance.delete(`/comments/${commentId}`);
};