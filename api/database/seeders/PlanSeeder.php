<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Generate UUIDs for monthly plans
        $starterMonthlyUuid = (string) Str::uuid();
        $proMonthlyUuid = (string) Str::uuid();
        $businessMonthlyUuid = (string) Str::uuid();

        $plans = [
            // Monthly Plans
            [
                'reference' => $starterMonthlyUuid,
                'label' => 'Starter',
                'price' => '8900',
                'type' => 'monthly',
                'storage' => 10000,
                'lot' => 1000,
            ],
            [
                'reference' => $proMonthlyUuid,
                'label' => 'Pro',
                'price' => '19700',
                'type' => 'monthly',
                'storage' => 25000,
                'lot' => 2500,
            ],
            [
                'reference' => $businessMonthlyUuid,
                'label' => 'Business',
                'price' => '34700',
                'type' => 'monthly',
                'storage' => 100000,
                'lot' => 10000,
            ],

            // Yearly Plans
            [
                'reference' => (string) Str::uuid(),
                'label' => 'Starter',
                'original_plan' => $starterMonthlyUuid,
                'price' => '106800',
                'type' => 'yearly',
                'storage' => 10000,
                'lot' => 1000,
                'percentage_discount' => 10.00,
            ],
            [
                'reference' => (string) Str::uuid(),
                'label' => 'Pro',
                'original_plan' => $proMonthlyUuid,
                'price' => '236400',
                'type' => 'yearly',
                'storage' => 25000,
                'lot' => 2500,
                'percentage_discount' => 10.00,
            ],
            [
                'reference' => (string) Str::uuid(),
                'label' => 'Business',
                'original_plan' => $businessMonthlyUuid,
                'price' => '416400',
                'type' => 'yearly',
                'storage' => 100000,
                'lot' => 10000,
                'percentage_discount' => 10.00,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
