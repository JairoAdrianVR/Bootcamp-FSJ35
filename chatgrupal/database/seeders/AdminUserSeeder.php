<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            ['name' => 'Administrador', 'email' => 'admin@chatgrupal.com'],
            ['name' => 'Administrador', 'email' => 'admin@chat.com'],
            ['name' => 'Administrador', 'email' => 'admin@example.com'],
            ['name' => 'Administrador', 'email' => 'admin@restaurante.com'],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make('password'),
                    'is_admin' => true,
                ]
            );
        }
    }
}
