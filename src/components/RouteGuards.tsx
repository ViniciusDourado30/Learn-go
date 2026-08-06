import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Se já estiver logado, pula login/registro e vai direto ao dashboard.
export const RedirectIfAuth = () => {
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to="/dashboard" replace />;
  
  // O Outlet renderiza o que estiver dentro do "children" lá no arquivo routes.tsx
  return <Outlet />;
};

// Exige usuário autenticado; caso contrário volta para o login.
export const RequireAuth = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/" replace />;
  
  // O Outlet renderiza as páginas do dashboard
  return <Outlet />;
};

// Exige autenticação + papel específico; caso o papel não bata, manda ao dashboard.
export const RequireRole = ({
  role,
  children,
}: {
  role: "ALUNO" | "PROFESSOR"; // Em maiúsculo para bater com o Prisma e o Zustand!
  children: React.ReactNode;
}) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.role);

  if (!token) return <Navigate to="/" replace />;
  if (userRole !== role) return <Navigate to="/dashboard" replace />;
  
  // Aqui MANTEMOS o children, porque lá no routes.tsx ele é usado envolvendo o componente (Ex: <RequireRole><DashboardCreateCourse /></RequireRole>)
  return <>{children}</>;
};