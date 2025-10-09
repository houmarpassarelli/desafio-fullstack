<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserAuth;
use Illuminate\Support\Str;

class UserAuthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user1 = User::firstOrCreate(
            ['reference' => (string) Str::uuid()],
            [
                'name' => 'Houmar Passareli',
                'email' => 'houmarpassarelli@gmail.com',
                'role' => 'user',
                'active' => true,
            ]
        );

        UserAuth::firstOrCreate(
            ['user_reference' => $user1->reference],
            [
                'password' => Hash::make('123456'),
            ]
        );

        $user2 = User::firstOrCreate(
            ['reference' => (string) Str::uuid()],
            [
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'role' => 'super',
                'active' => true,
            ]
        );

        UserAuth::firstOrCreate(
            ['user_reference' => $user2->reference],
            [
                'password' => Hash::make('123456'),
            ]
        );

        $this->command->info('UserAuth seeder completed successfully!');
        $this->command->info('Test users created:');
        $this->command->info('1. Email: houmarpassarelli@gmail.com | Password: 123456');
        $this->command->info('2. Email: admin@admin.com | Password: 123456');
    }
}