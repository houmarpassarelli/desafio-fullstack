<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;
use App\Models\UserAuth;
use App\Models\UserSession;

class AuthController extends Controller
{
    /**
     * Login user and create access token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados de login inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user by email
        $user = User::where('email', $request->email)->where('active', true)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciais inválidas'
            ], 401);
        }

        // Check if user has authentication record
        $userAuth = $user->userAuth;

        if (!$userAuth || !Hash::check($request->password, $userAuth->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas'
            ], 401);
        }

        // Create access token using Sanctum
        $accessToken = $user->createToken('auth-token', ['*'], now()->addMinutes(config('sanctum.expiration', 60)));

        // Generate refresh token
        $refreshToken = Str::random(64);

        // Store refresh token in user_sessions
        $userSession = UserSession::create([
            'user_reference' => $user->reference,
            'refresh_token' => Hash::make($refreshToken),
        ]);

        // Load user with active plan
        $user->load('activePlan.plan');

        return response()->json([
            'data' => [
                'user' => $user,
                'access_token' => $accessToken->plainTextToken,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration', 60) * 60, // Convert minutes to seconds
            ]
        ]);
    }

    /**
     * Refresh access token using refresh token
     */
    public function refresh(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Token de atualização é obrigatório',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user session with matching refresh token
        $userSessions = UserSession::all();
        $validSession = null;

        foreach ($userSessions as $session) {
            if (Hash::check($request->refresh_token, $session->refresh_token)) {
                $validSession = $session;
                break;
            }
        }

        if (!$validSession) {
            return response()->json([
                'message' => 'Token de atualização inválido'
            ], 401);
        }

        // Get user
        $user = $validSession->user;

        if (!$user || !$user->active) {
            return response()->json([
                'message' => 'Usuário inativo'
            ], 401);
        }

        // Revoke old access tokens
        $user->tokens()->delete();

        // Create new access token
        $accessToken = $user->createToken('auth-token', ['*'], now()->addMinutes(config('sanctum.expiration', 60)));

        // Generate new refresh token
        $newRefreshToken = Str::random(64);

        // Update refresh token in session
        $validSession->update([
            'refresh_token' => Hash::make($newRefreshToken),
        ]);

        // Load user with active plan
        $user->load('activePlan.plan');

        return response()->json([
            'data' => [
                'user' => $user,
                'access_token' => $accessToken->plainTextToken,
                'refresh_token' => $newRefreshToken,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration', 60) * 60,
            ]
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('activePlan.plan');

        return response()->json([
            'data' => $user
        ]);
    }

    /**
     * Logout user and revoke tokens
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        // Revoke all access tokens for this user
        $user->tokens()->delete();

        // Remove all refresh token sessions for this user
        UserSession::where('user_reference', $user->reference)->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }

    /**
     * Logout from all devices
     */
    public function logoutAll(Request $request)
    {
        $user = $request->user();

        // Revoke all access tokens for this user
        $user->tokens()->delete();

        // Remove all refresh token sessions for this user
        UserSession::where('user_reference', $user->reference)->delete();

        return response()->json([
            'message' => 'Logout de todos os dispositivos realizado com sucesso'
        ]);
    }
}