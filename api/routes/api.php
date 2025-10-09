<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPlanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/', function () {
    return response()->json(['message' => 'ok']);
});

// Authentication Routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);

// Protected Authentication Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
});

// Public Routes
Route::get('/plans', [PlanController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/users/plans/history/{id}', [UserPlanController::class, 'history']);
    Route::post('/plans/contract', [PlanController::class, 'contract']);
});
