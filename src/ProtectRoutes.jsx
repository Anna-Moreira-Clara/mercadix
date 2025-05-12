import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // ajuste conforme a estrutura de pastas

/**
 * Rota protegida que exige que o usuário esteja autenticado (cliente ou admin).
 * Se for admin, redireciona diretamente para o dashboard.
 */
export const ProtectedRoute = ({ children, redirectTo = "/login-cliente" }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/Tela-Admin/Dashboard" replace />;
  }

  return children;
};

/**
 * Rota exclusiva para administradores
 */
export const AdminRoute = ({ children, redirectTo = "/login-cliente" }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return isAdmin() ? children : <Navigate to={redirectTo} replace />;
};
