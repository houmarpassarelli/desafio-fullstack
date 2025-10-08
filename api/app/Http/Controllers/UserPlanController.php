<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPlan;

class UserPlanController extends Controller
{
    /**
     * Display the user's plan history.
     *
     * @param string $id (User reference UUID)
     * @return \Illuminate\Http\JsonResponse
     */
    public function history($id)
    {
        // Busca todos os UserPlans do usuário por user_reference
        $userPlans = UserPlan::where('user_reference', $id)
                             ->with('plan') // Eager load Plan relacionado (evita N+1)
                             ->orderBy('created_at', 'desc') // Mais recente primeiro
                             ->get();

        // Verifica se usuário existe quando não há planos
        if ($userPlans->isEmpty()) {
            $userExists = User::where('reference', $id)->exists();

            if (!$userExists) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }
        }

        return response()->json([
            'data' => $userPlans,
            'total' => $userPlans->count()
        ]);
    }
}
