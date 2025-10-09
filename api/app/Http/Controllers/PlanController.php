<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Plan;
use App\Models\UserPlan;
use App\Models\UserPlanUsage;

class PlanController extends Controller
{
    /**
     * Display a listing of all plans.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $plans = Plan::all();

        return response()->json([
            'data' => $plans,
            'total' => $plans->count()
        ]);
    }

    /**
     * Contract a plan for the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function contract(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_reference' => 'required|string',
            'exchange_type' => 'required|string|in:contract,change',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $planReference = $request->plan_reference;
        $exchangeType = $request->exchange_type;

        // Verificar se usuário já tem plano ativo (para diferenciar contratação vs troca)
        $hasActivePlan = UserPlan::where('user_reference', $user->reference)
                                 ->where('active', true)
                                 ->exists();

        // Log para debug
        \Log::info($hasActivePlan ? 'Plan switch request' : 'Plan contract request', [
            'user_reference' => $user->reference,
            'plan_reference_received' => $planReference,
            'exchange_type_received' => $exchangeType,
            'has_active_plan' => $hasActivePlan
        ]);

        // Verificar se o plano existe (buscar apenas por reference)
        $plan = Plan::where('reference', $planReference)->first();

        if (!$plan) {
            return response()->json([
                'message' => 'Plano não encontrado'
            ], 404);
        }

        // Usar sempre a reference do plano encontrado
        $planReference = $plan->reference;

        // Verificar se usuário está tentando trocar para o mesmo plano atual
        if ($hasActivePlan) {
            $currentActivePlan = UserPlan::where('user_reference', $user->reference)
                                        ->where('active', true)
                                        ->first();

            if ($currentActivePlan && $currentActivePlan->plan_reference === $planReference) {
                return response()->json([
                    'message' => 'Você já possui este plano ativo'
                ], 400);
            }
        }

        DB::beginTransaction();

        try {
            // Obter plano ativo anterior e seus dados de uso (se existir)
            $previousActivePlan = null;
            $previousUsage = null;
            if ($hasActivePlan) {
                $previousActivePlan = UserPlan::where('user_reference', $user->reference)
                                            ->where('active', true)
                                            ->with('usage')
                                            ->first();
                $previousUsage = $previousActivePlan?->usage;
            }

            // Desativar planos anteriores do usuário
            UserPlan::where('user_reference', $user->reference)
                    ->where('active', true)
                    ->update(['active' => false]);

            // Calcular data de expiração
            $expiresIn = null;
            if ($plan->type === 'monthly') {
                $expiresIn = now()->addMonth();
            } elseif ($plan->type === 'yearly') {
                $expiresIn = now()->addYear();
            }

            // Calcular benefícios disponíveis para o meta_data
            $metaData = [];

            if ($exchangeType === 'contract') {
                // Nova contratação: usar benefícios do plano
                $metaData = [
                    'lot_available' => $plan->lot,
                    'storage_available' => $plan->storage
                ];
            } elseif ($exchangeType === 'change' && $previousActivePlan) {
                // Troca de plano: somar benefícios não utilizados + novos benefícios
                $previousMeta = $previousActivePlan->meta_data ?? [];
                $lotUsed = $previousUsage?->lot_used ?? 0;
                $storageUsed = $previousUsage?->storage_used ?? 0;

                // Benefícios não utilizados do plano anterior
                $previousLotAvailable = $previousMeta['lot_available'] ?? $previousActivePlan->plan?->lot ?? 0;
                $previousStorageAvailable = $previousMeta['storage_available'] ?? $previousActivePlan->plan?->storage ?? 0;

                $unusedLot = max(0, $previousLotAvailable - $lotUsed);
                $unusedStorage = max(0, $previousStorageAvailable - $storageUsed);

                // Somar benefícios não utilizados + benefícios do novo plano
                $metaData = [
                    'lot_available' => $unusedLot + $plan->lot,
                    'storage_available' => $unusedStorage + $plan->storage
                ];

                \Log::info('Benefits accumulation calculation', [
                    'previous_meta' => $previousMeta,
                    'lot_used' => $lotUsed,
                    'storage_used' => $storageUsed,
                    'unused_lot' => $unusedLot,
                    'unused_storage' => $unusedStorage,
                    'new_plan_lot' => $plan->lot,
                    'new_plan_storage' => $plan->storage,
                    'final_meta_data' => $metaData
                ]);
            }

            // Criar novo plano do usuário
            $userPlan = UserPlan::create([
                'user_reference' => $user->reference,
                'plan_reference' => $planReference,
                'expires_in' => $expiresIn,
                'meta_data' => $metaData,
                'active' => true,
                'exchange_type' => $exchangeType,
            ]);

            // Criar registro de uso do plano (inicialmente zerado)
            UserPlanUsage::create([
                'user_plan_reference' => $userPlan->reference,
                'lot_used' => 0,
                'storage_used' => 0,
            ]);

            DB::commit();

            // Carregar o plano com os dados relacionados
            $userPlan->load('plan', 'usage');

            return response()->json([
                'message' => $hasActivePlan ? 'Plano trocado com sucesso' : 'Plano contratado com sucesso',
                'data' => $userPlan
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao contratar plano. Tente novamente.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
