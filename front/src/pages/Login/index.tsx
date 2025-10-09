import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(email, password);
      navigate('/'); // Redirect to dashboard after successful login
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error.response?.status === 422) {
        // Validation errors
        const backendErrors = error.response.data.errors || {};
        setErrors({
          email: backendErrors.email?.[0],
          password: backendErrors.password?.[0],
        });
      } else if (error.response?.status === 401) {
        // Authentication error
        setErrors({
          general: error.response.data.message || 'Credenciais inválidas'
        });
      } else {
        // Generic error
        setErrors({
          general: 'Erro interno do servidor. Tente novamente.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* Left side - Image/Gradient */}
          <div className="h-32 md:h-auto md:w-1/2">
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
                <p className="text-orange-100 text-lg">
                  Acesse sua conta e continue aproveitando nossos serviços
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full mt-1 text-sm border rounded-lg px-3 py-2 dark:border-gray-600 dark:bg-gray-700 focus:border-orange-400 focus:outline-none focus:shadow-outline-orange dark:text-gray-300 dark:focus:shadow-outline-gray ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu-email@exemplo.com"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1">{errors.email}</span>
                  )}
                </label>

                {/* Password Field */}
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Senha</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full mt-1 text-sm border rounded-lg px-3 py-2 pr-10 dark:border-gray-600 dark:bg-gray-700 focus:border-orange-400 focus:outline-none focus:shadow-outline-orange dark:text-gray-300 dark:focus:shadow-outline-gray ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500 mt-1">{errors.password}</span>
                  )}
                </label>

                {/* General Error Message */}
                {errors.general && (
                  <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    {errors.general}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="block w-full px-4 py-2 mt-6 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:shadow-outline-orange disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};