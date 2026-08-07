import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const useLoginMutation = () => {
  // 1. Puxando as funções separadas que criamos no Zustand
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // 2. Salvando o token e o cargo corretamente usando as novas funções
      setToken(data.access_token);
      setRole(data.user.role);
      
      navigate('/dashboard');
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: any) => {
      const { data } = await api.post('/auth/register', userData);
      return data;
    },
    onSuccess: () => {
      navigate('/'); // Redireciona para o login após registrar com sucesso
    },
  });
};