import { HttpClient } from '../lib';
import type { Plan, UserPlan, ApiResponse } from '../types';

interface ContractPlanRequest {
  plan_reference: string;
  exchange_type: 'contract' | 'change';
}

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

    /**
     * Contratar um plano
     */
    public async contractPlan(planReference: string, exchangeType: 'contract' | 'change' = 'contract'): Promise<UserPlan> {
        const request: ContractPlanRequest = {
            plan_reference: planReference,
            exchange_type: exchangeType
        };

        const response = await this.post<ApiResponse<UserPlan>>('/plans/contract', request);
        return response.data.data;
    }
}