<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RandomUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Usuario Uno', 'email' => 'usuario1@seguridad.local', 'password' => '1PkFGHcXKsud'],
            ['name' => 'Usuario Dos', 'email' => 'usuario2@seguridad.local', 'password' => 'SPr6Mzayv8Nu'],
            ['name' => 'Usuario Tres', 'email' => 'usuario3@seguridad.local', 'password' => 'JES8xKOz2jth'],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make($data['password']),
                    'is_admin' => false,
                ]
            );
        }
    }
}
