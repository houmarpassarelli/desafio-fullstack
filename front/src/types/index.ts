export interface User {
  id: number;
  reference: string;
  name: string;
  avatar?: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  activePlan?: UserPlan;
}

export interface Plan {
  id?: number;
  reference?: string;
  original_plan?: string;
  label: string;
  price: string | number;
  type: string;
  percentage_discount?: number | string | null;
  storage: number;
  lot: number;
  created_at: string;
  updated_at: string;
  originalPlan?: Plan;
  annualVariants?: Plan[];
}

export interface UserPlan {
  id: number;
  reference: string;
  user_reference: string;
  plan_reference: string;
  expires_in?: string;
  meta_data?: any;
  active: boolean;
  exchange_type?: string;
  created_at: string;
  updated_at: string;
  plan?: Plan;
  usage?: UserPlanUsage;
}

export interface UserPlanUsage {
  id: number;
  reference: string;
  user_plan_reference: string;
  lot_used: number;
  storage_used: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}