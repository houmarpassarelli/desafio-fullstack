import { HttpClient } from '../lib';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '../lib/localStorage';
import type { User, UserPlan, ApiResponse } from '../types';

interface UserProfile {
  user: User;
  sessionId?: string;
  activePlan?: UserPlan;
}

export class UserService extends HttpClient {
    constructor() {
        super();
    }

    /**
     * Obter usuário por ID com plano ativo
     */
    public async getUser(id: string): Promise<User> {
        const response = await this.get<User>(`/users/${id}`);
        return response.data;
    }

    /**
     * Obter histórico de planos do usuário
     */
    public async getUserPlanHistory(id: string): Promise<UserPlan[]> {
        const response = await this.get<ApiResponse<UserPlan[]>>(`/users/plans/history/${id}`);
        return response.data.data;
    }

    /**
     * Salvar dados do usuário no localStorage
     */
    public saveUserProfile(user: User, sessionId?: string, activePlan?: UserPlan): void {
        const userProfile: UserProfile = {
            user,
            sessionId,
            activePlan
        };
        setLocalStorage('UserProfile', userProfile);
    }

    /**
     * Obter dados do usuário do localStorage
     */
    public getUserProfile(): UserProfile | null {
        return getLocalStorage('UserProfile', null);
    }

    /**
     * Obter apenas os dados do usuário do localStorage
     */
    public getUserFromProfile(): User | null {
        const profile = this.getUserProfile();
        return profile?.user || null;
    }

    /**
     * Limpar dados do usuário do localStorage
     */
    public clearUserProfile(): void {
        removeLocalStorage('UserProfile');
    }

    /**
     * Verificar se há dados do usuário salvos
     */
    public hasUserProfile(): boolean {
        const profile = this.getUserProfile();
        return !!profile?.user;
    }

    /**
     * Atualizar dados do usuário no localStorage
     */
    public updateUserProfile(userData: Partial<User>): void {
        const currentProfile = this.getUserProfile();
        if (currentProfile) {
            const updatedProfile: UserProfile = {
                ...currentProfile,
                user: {
                    ...currentProfile.user,
                    ...userData
                }
            };
            setLocalStorage('UserProfile', updatedProfile);
        }
    }

    /**
     * Salvar dados do plano ativo no localStorage
     */
    public saveActivePlan(activePlan: UserPlan): void {
        const currentProfile = this.getUserProfile();
        if (currentProfile) {
            const updatedProfile: UserProfile = {
                ...currentProfile,
                activePlan
            };
            setLocalStorage('UserProfile', updatedProfile);
        }
    }

    /**
     * Obter dados do plano ativo do localStorage
     */
    public getActivePlan(): UserPlan | null {
        const profile = this.getUserProfile();
        return profile?.activePlan || null;
    }

    /**
     * Remover dados do plano ativo do localStorage
     */
    public clearActivePlan(): void {
        const currentProfile = this.getUserProfile();
        if (currentProfile) {
            const updatedProfile: UserProfile = {
                ...currentProfile,
                activePlan: undefined
            };
            setLocalStorage('UserProfile', updatedProfile);
        }
    }
}