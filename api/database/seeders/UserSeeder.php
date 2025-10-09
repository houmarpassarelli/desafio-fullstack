<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'Houmar Passareli',
                'email' => 'houmarpassarelli@gmail.com',
                'role' => 'user',
            ],
            [
                'name' => 'Administrador',
                'email' => 'admin@admin.com',
                'role' => 'super',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
