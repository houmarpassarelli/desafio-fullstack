import { HttpClient, TokenManager } from '../lib';
import { UserService } from './UserService';
import type { User, ApiResponse } from '../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}


export class AuthService extends HttpClient {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<ApiResponse<LoginResponse>>('/auth/login', credentials);

    // Salvar tokens usando TokenManager
    const data = response.data.data;
    TokenManager.saveAccessToken(data.access_token);
    TokenManager.saveRefreshToken(data.refresh_token);

    // Buscar dados completos do usuário e salvar no localStorage
    try {
      const fullUserData = await this.userService.getUser(data.user.reference);

      // Se o usuário tem um plano ativo, salvar também no localStorage
      const activePlan = fullUserData.activePlan;
      this.userService.saveUserProfile(fullUserData, undefined, activePlan);
    } catch (error) {
      console.warn('Erro ao buscar dados completos do usuário:', error);
      // Se falhar, salva apenas os dados básicos retornados pelo login
      this.userService.saveUserProfile(data.user);
    }

    return data;
  }

  /**
   * Atualiza o token de acesso usando refresh token
   */
  async refresh(): Promise<LoginResponse> {
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await this.post<ApiResponse<LoginResponse>>('/auth/refresh', {
      refresh_token: refreshToken
    });

    // Salvar novos tokens
    const data = response.data.data;
    TokenManager.saveAccessToken(data.access_token);
    TokenManager.saveRefreshToken(data.refresh_token);

    return data;
  }

  /**
   * Obtém informações do usuário autenticado
   */
  async me(): Promise<User> {
    const response = await this.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } finally {
      // Sempre limpar tokens localmente, mesmo se a requisição falhar
      TokenManager.clearAllAuth();
    }
  }

  /**
   * Realiza logout de todos os dispositivos
   */
  async logoutAll(): Promise<void> {
    try {
      await this.post('/auth/logout-all');
    } finally {
      // Sempre limpar tokens localmente, mesmo se a requisição falhar
      TokenManager.clearAllAuth();
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();

    return !!(accessToken || refreshToken);
  }

  /**
   * Verifica se há token de acesso válido
   */
  hasValidAccessToken(): boolean {
    const accessToken = TokenManager.getAccessToken();
    return !!accessToken;
  }

  /**
   * Limpa todos os dados de autenticação
   */
  clearAuth(): void {
    TokenManager.clearAllAuth();
    this.userService.clearUserProfile();
  }
}