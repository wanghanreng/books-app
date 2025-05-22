import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ 
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          nickname: userData.nickname,  // 添加 nickname 字段
          avatar_url: userData.avatar_url
        } 
      }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);