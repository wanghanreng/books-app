import axiosInstance from './axiosInstance';

// 创建书籍
export const createBook = async (bookData) => {
  return axiosInstance.post('/books', bookData);
};

// 查询所有书籍
export const getBooks = async () => {
  return axiosInstance.get(`/books/books`);
};

// 查询书籍详情
export const getBook = async (bookId) => {
  return axiosInstance.get(`/books/${bookId}`);
};

// 查询某个分类的所有书籍
export const getBooksByCategory = async (categoryId) => {
  return axiosInstance.get(`/books/categories/${categoryId}`);
};

// 更新书籍
export const updateBook = async (bookId, bookData) => {
  return axiosInstance.put(`/books/${bookId}`, bookData);
};

// 删除书籍
export const deleteBook = async (bookId) => {
  return axiosInstance.delete(`/books/${bookId}`);
};