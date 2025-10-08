<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{

    /**
     * Display the specified user with active plan.
     *
     * @param string $id (User reference UUID)
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Busca usuário por reference (UUID) e carrega plano ativo com detalhes do plano
        $user = User::where('reference', $id)
                    ->with(['activePlan.plan']) // Eager load: UserPlan ativo + Plan relacionado
                    ->firstOrFail(); // 404 se não encontrar

        return response()->json($user);
    }
}
