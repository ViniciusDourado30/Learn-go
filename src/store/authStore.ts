import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Tenta puxar do localStorage ao iniciar
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,

  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },

  setRole: (role) => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
    set({ role });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null });
  },
}));