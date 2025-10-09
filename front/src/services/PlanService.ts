import { HttpClient } from '../lib';
import type { Plan, ApiResponse } from '../types';

export class PlanService extends HttpClient {
    constructor() {
        super();
    }

    /**
     * Obter todos os planos disponíveis
     */
    public async getPlans(): Promise<Plan[]> {
        const response = await this.get<ApiResponse<Plan[]>>('/plans');
        return response.data.data;
    }
}