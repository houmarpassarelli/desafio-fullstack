import { HttpClient } from '../lib/HTTPClient';
import type { User, UserPlan, ApiResponse } from '../types';

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
}