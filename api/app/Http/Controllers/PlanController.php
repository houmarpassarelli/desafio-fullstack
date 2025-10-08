<?php

namespace App\Http\Controllers;

use App\Models\Plan;

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
}
