import axiosInstance from './axiosInstance';

// 创建书评
export const createLibrary = async (libraryData) => {
  return axiosInstance.post('/library', libraryData);
};

// 查询某个用户的所有书评
export const getLibrariesByUser = async (userId) => {
    return axiosInstance.get(`/library/users/${userId}`);
  };

// 删除书评
export const deleteLibrary = async (libraryId) => {
  return axiosInstance.delete(`/library/${libraryId}`);
};