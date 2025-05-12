import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // ajuste conforme a estrutura de pastas

/**
 * Rota protegida que exige que o usuário esteja autenticado (cliente ou admin)
 */
export const ProtectedRoute = ({ children, redirectTo = "/login-cliente" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return isAuthenticated() ? children : <Navigate to={redirectTo} replace />;
};

/**
 * Rota exclusiva para administradores
 */
export const AdminRoute = ({ children, redirectTo = "/login-cliente" }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return isAdmin() ? children : <Navigate to={redirectTo} replace />;
};
