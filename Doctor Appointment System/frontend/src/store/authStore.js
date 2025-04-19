import { create } from 'zustand';

const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  return {
    token: token || null,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

const useAuthStore = create((set) => ({
  token: getStoredAuth().token,
  user: getStoredAuth().user,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;