import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// --- UPLOAD ---
export const useUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${data.url}`;
    }
  });
};

// --- PERFIL ---
export const usePerfil = () => useQuery({ queryKey: ['perfil'], queryFn: async () => (await api.get('/auth/perfil')).data });
export const useUpdatePerfil = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => await api.patch('/auth/perfil', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['perfil'] }) });
};

// --- DISPONIBILIDADE ---
export const useDisponibilidade = () => useQuery({ queryKey: ['disponibilidade'], queryFn: async () => (await api.get('/aulas/disponibilidade')).data });
export const useSalvarDisponibilidade = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => await api.post('/aulas/disponibilidade', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['disponibilidade'] }) });
};
export const useDisponibilidadeProfessor = (id: string) => useQuery({ queryKey: ['disponibilidade', id], queryFn: async () => (await api.get(`/aulas/disponibilidade/${id}`)).data, enabled: !!id });

// --- PROFESSORES ---
export const useProfessores = () => useQuery({ queryKey: ['professores'], queryFn: async () => (await api.get('/auth/professores')).data });
export const useProfessor = (id: string) => useQuery({ queryKey: ['professor', id], queryFn: async () => (await api.get(`/auth/professores/${id}`)).data, enabled: !!id });

// --- CURSOS ---
export const useCriarCurso = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => await api.post('/cursos', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['cursos'] }) });
};
export const useCursos = () => useQuery({ queryKey: ['cursos'], queryFn: async () => (await api.get('/cursos')).data });
export const useCurso = (id: string) => useQuery({ queryKey: ['curso', id], queryFn: async () => (await api.get(`/cursos/${id}`)).data, enabled: !!id });
export const useMeusCursos = () => useQuery({ queryKey: ['meus-cursos'], queryFn: async () => (await api.get('/cursos/meus')).data });
export const useMatricular = () => {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: async (id: string) => await api.post(`/cursos/${id}/matricular`), 
    onSuccess: (_, id) => { 
      qc.invalidateQueries({ queryKey: ['meus-cursos'] }); 
      qc.invalidateQueries({ queryKey: ['curso', id] }); 
    } 
  });
};
export const useCursoDestaque = () => useQuery({ queryKey: ['curso-destaque'], queryFn: async () => (await api.get('/cursos/destaque')).data });
export const useRegistrarClique = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => await api.patch(`/cursos/${id}/clique`), onSuccess: () => qc.invalidateQueries({ queryKey: ['curso-destaque'] }) });
};

// --- AGENDAMENTOS ---
export const useMeusAgendamentos = () => useQuery({ queryKey: ['agendamentos'], queryFn: async () => (await api.get('/agendamentos/meus')).data });
export const useAgendarAula = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => await api.post('/agendamentos', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }) });
};