import React from "react";
import { Navigate } from "react-router";
import { isAuthenticated, getRole } from "../hooks/useAuth";

// Exige usuário autenticado; caso contrário volta para o login.
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Exige autenticação + papel específico; caso o papel não bata, manda ao dashboard.
export const RequireRole = ({
  role,
  children,
}: {
  role: "aluno" | "professor";
  children: React.ReactNode;
}) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (getRole() !== role) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Se já estiver logado, pula login/registro e vai direto ao dashboard.
export const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
