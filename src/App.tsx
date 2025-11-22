import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts e Páginas
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './components/Dashboard'; // Ajuste o caminho se necessário
import { Students } from './components/Students';
import { Classes } from './components/Classes'; // Ajuste conforme sua estrutura
import { Grades } from './components/Grades';     // Ajuste conforme sua estrutura
import { Announcements } from './components/Announcements'; // Ajuste conforme sua estrutura

// Componente de Proteção de Rota
function PrivateRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas (Requer Login) */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/announcements" element={<Announcements />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}