import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Erro durante logout:', error);
      } finally {
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-gray-600 dark:text-gray-400 mb-4">
          Realizando logout...
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
      </div>
    </div>
  );
};