// Helpers de autenticação (mock) — reutilizam a chave `userRole` do localStorage,
// a mesma usada por `useRole` e pelo fluxo de login.

export const isAuthenticated = () => !!localStorage.getItem("userRole");

export const getRole = () =>
  localStorage.getItem("userRole") as "aluno" | "professor" | null;
