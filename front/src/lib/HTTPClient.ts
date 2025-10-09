import axios, { AxiosHeaders } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TokenManager } from './tokenManager';

/**
 * Classe abstrata para gerenciar requisições HTTP com Axios
 * Inclui autenticação JWT e pode ser usada globalmente em um aplicativo Vue.js 3
 */
export abstract class HttpClient {
    protected readonly instance: AxiosInstance;
    // protected authStore = useAuthStore();

    /**
     * @param headers - Cabeçalhos HTTP adicionais
     */
    constructor(headers?: Record<string, string>) {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

        this.instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            withCredentials: true // Importante para enviar cookies
        });

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    /**
     * Configurar interceptadores de requisição para adicionar token JWT
     */
    private _initializeRequestInterceptor(): void {
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleError
        );
    }

    /**
     * Configurar interceptadores de resposta para lidar com erros
     */
    private _initializeResponseInterceptor(): void {
        this.instance.interceptors.response.use(
            (response) => response,
            this._handleError
        );
    }

    /**
     * Adicionar token JWT aos cabeçalhos de requisição
     */
    private _handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = TokenManager.getAccessToken();
        if (token) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }
            config.headers.set('Authorization', `Bearer ${token}`);
            config.headers.set('Accept', 'application/json');
        }
        config.headers.set('Time-Zone', Intl.DateTimeFormat().resolvedOptions().timeZone);
        config.headers.set('cigo-refreshToken', TokenManager.getRefreshToken());
        return config;
    };

    /**
     * Lidar com erros de requisição/resposta
     */
    protected _handleError = async (error: any): Promise<never> => {
        if (error.response?.status === 401) {
            // Verifica se está na página de login para evitar refresh desnecessário
            const currentPath = window.location.pathname;
            if (currentPath === '/login') {
                return Promise.reject(error);
            }

            try {
                
                // Usar TokenManager para recuperar credenciais
                const refreshToken = TokenManager.getRefreshToken();
                const sessionId = TokenManager.getSessionId();

                let refreshPayload: any = {};
                
                if (refreshToken) {
                    refreshPayload = { refreshToken };
                } 
                
                if(sessionId){
                    refreshPayload = {...refreshPayload, sessionId };
                }
                
                // Tenta refresh do token
                const response = await this.instance.post<{ data: { access_token: string, refresh_token?: string } }>('/auth/refresh', { refresh_token: refreshToken });
                
                if (response.status === 200) {

                    // Salvar access token usando TokenManager
                    TokenManager.saveAccessToken(response.data.data.access_token);

                    // Se recebeu um novo refreshToken, salvar usando TokenManager
                    if (response.data.data.refresh_token) {
                        TokenManager.saveRefreshToken(response.data.data.refresh_token);
                    }
                    
                    // Retry da requisição original
                    const config = error.config;
                    return this.instance(config);
                }
            } catch (refreshError) {
                // Se o refresh falhar, limpa a autenticação usando TokenManager
                TokenManager.clearAllAuth();
            }
        }
        return Promise.reject(error);
    };

    /**
     * Requisição GET
     */
    protected get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(url, config);
    }

    /**
     * Requisição POST
     */
    protected post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(url, data, config);
    }

    /**
     * Requisição PUT
     */
    protected put<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.put<T>(url, data, config);
    }

    /**
     * Requisição DELETE
     */
    protected delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.delete<T>(url, config);
    }

    /**
     * Requisição PATCH
     */
    protected patch<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.patch<T>(url, data, config);
    }
}