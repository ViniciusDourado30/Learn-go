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

// --- DÚVIDAS E PROGRESSO ---
export const useAdicionarDuvida = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ aulaId, texto }: { aulaId: string; texto: string }) => {
      const res = await api.post(`/cursos/aulas/${aulaId}/duvidas`, { texto });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['curso'] });
      qc.invalidateQueries({ queryKey: ['meus-cursos'] });
    }
  });
};

export const useRegistrarProgresso = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (aulaId: string) => {
      const res = await api.post(`/cursos/aulas/${aulaId}/progresso`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['curso'] });
      qc.invalidateQueries({ queryKey: ['meus-cursos'] });
    }
  });
};

// --- AGENDAMENTOS ---
export const useMeusAgendamentos = () => useQuery({ queryKey: ['agendamentos'], queryFn: async () => (await api.get('/agendamentos/meus')).data });
export const useAgendarAula = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => await api.post('/agendamentos', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }) });
};

export const getImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  // Se a imagem já vier da internet (ex: Google, Unsplash) retorna ela mesma
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Se for uma imagem do banco local, junta com a URL do backend
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
};

export const useComprarCurso = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { data } = await api.post(`/cursos/${cursoId}/comprar`);
      return data;
    },
    onSuccess: () => {
      // Força o sistema a recarregar a lista de cursos do aluno instantaneamente
      qc.invalidateQueries({ queryKey: ['meus-cursos'] });
      qc.invalidateQueries({ queryKey: ['cursos'] });
    }
  });
};

// --- ALTERAR SENHA ---
export const useAlterarSenha = () => {
  return useMutation({
    mutationFn: async (data: { senhaAtual: string; novaSenha: string }) => {
      const res = await api.patch('/auth/alterar-senha', data);
      return res.data;
    }
  });
};

// --- EXCLUIR CONTA ---
export const useExcluirConta = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete('/auth/perfil');
      return res.data;
    }
  });
};

// --- AVALIACOES ---
export const useAvaliacoesProfessor = (professorId: string) => useQuery({
  queryKey: ['avaliacoes', professorId],
  queryFn: async () => (await api.get(`/avaliacoes/professor/${professorId}`)).data,
  enabled: !!professorId
});

export const useCriarAvaliacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { professorId: string; nota: number; comentario?: string }) => {
      const res = await api.post('/avaliacoes', data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['avaliacoes', variables.professorId] });
      qc.invalidateQueries({ queryKey: ['professor', variables.professorId] });
    }
  });
};

// --- NOTIFICACOES ---
export const useNotificacoes = () => useQuery({
  queryKey: ['notificacoes'],
  queryFn: async () => (await api.get('/notificacoes')).data,
  refetchInterval: 30000 // Atualiza a cada 30 segundos
});

export const useMarcarNotificacaoLida = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await api.patch(`/notificacoes/${id}/ler`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificacoes'] })
  });
};

export const useMarcarTodasLidas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => await api.patch('/notificacoes/ler-todas'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificacoes'] })
  });
};

export const useRemoverNotificacao = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await api.delete(`/notificacoes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificacoes'] })
  });
};