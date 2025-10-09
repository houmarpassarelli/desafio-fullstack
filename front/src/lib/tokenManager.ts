import { getCookie, setCookie, deleteCookie } from './cookies';
import { getLocalStorage, removeLocalStorage } from './localStorage';
import { getSessionStorage, setSessionStorage, removeSessionStorage } from './sessionStorage';

/**
 * Gerenciador centralizado de tokens para sincronizar entre cookies, localStorage e sessionStorage
 */
export class TokenManager {
    
    /**
     * Recupera o refreshToken APENAS dos cookies (por segurança)
     */
    static getRefreshToken(): string | null {
        const fromCookie = getCookie('refreshToken');
        if (fromCookie) {
            return fromCookie;
        }
        return null;
    }

    /**
     * Salva o refreshToken APENAS nos cookies (por segurança)
     */
    static saveRefreshToken(token: string): void {
        
        // Salvar APENAS no cookie por segurança
        setCookie('refreshToken', token, {
            maxAge: 30 * 24 * 60 * 60, // 30 dias
            secure: window.location.protocol === 'https:',
            sameSite: window.location.protocol === 'https:' ? 'none' : 'lax',
            path: '/'
        });
    }

    /**
     * Remove o refreshToken APENAS dos cookies
     */
    static clearRefreshToken(): void {        
        deleteCookie('refreshToken');
    }

    /**
     * Recupera o accessToken do sessionStorage
     */
    static getAccessToken(): string | null {
        return getSessionStorage('AccessToken', null);
    }

    /**
     * Salva o accessToken no sessionStorage
     */
    static saveAccessToken(token: string): void {
        setSessionStorage('AccessToken', token);
    }

    /**
     * Remove o accessToken do sessionStorage
     */
    static clearAccessToken(): void {
        removeSessionStorage('AccessToken');
    }

    /**
     * Recupera o sessionId de todas as fontes
     * Prioridade: sessionStorage > localStorage (profile)
     */
    static getSessionId(): string | null {
        // Primeiro tenta do sessionStorage
        const fromSessionStorage = getSessionStorage('SessionId', null);
        if (fromSessionStorage) {
            return fromSessionStorage;
        }

        // Depois tenta do UserProfile no localStorage
        const userProfile = getLocalStorage('UserProfile', null);
        if (userProfile?.sessionId) {
            return userProfile.sessionId;
        }
        return null;
    }

    /**
     * Limpa todos os dados de autenticação
     */
    static clearAllAuth(): void {
        
        // Limpar tokens
        this.clearRefreshToken();
        this.clearAccessToken();
        
        // Limpar outros dados
        removeSessionStorage('SessionId');
        removeLocalStorage('UserProfile');
        
        // Disparar evento de logout
        window.dispatchEvent(new CustomEvent('auth:expired'));
    }
}