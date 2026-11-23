<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'email' => 'carlos.mendoza@example.com',
                'name' => 'Carlos Mendoza',
                'password' => Hash::make('password123'),
                'phone' => '+503 7123-4567',
                'identification_number' => '05123456-7',
                'role' => 'customer',
            ],
            [
                'email' => 'sofia.reyes@example.com',
                'name' => 'Sofía Reyes',
                'password' => Hash::make('password123'),
                'phone' => '+503 7890-1234',
                'identification_number' => '06234567-8',
                'role' => 'customer',
            ],
            [
                'email' => 'alejandro.rivera@example.com',
                'name' => 'Alejandro Rivera',
                'password' => Hash::make('password123'),
                'phone' => '+503 7234-5678',
                'identification_number' => '04345678-9',
                'role' => 'customer',
            ],
            [
                'email' => 'mariana.gomez@example.com',
                'name' => 'Mariana Gómez',
                'password' => Hash::make('password123'),
                'phone' => '+503 7901-2345',
                'identification_number' => '05456789-0',
                'role' => 'customer',
            ],
            [
                'email' => 'roberto.lemus@example.com',
                'name' => 'Roberto Lemus',
                'password' => Hash::make('password123'),
                'phone' => '+503 7456-7890',
                'identification_number' => '03567890-1',
                'role' => 'customer',
            ],
            [
                'email' => 'elena.morales@example.com',
                'name' => 'Elena Morales',
                'password' => Hash::make('password123'),
                'phone' => '+503 7567-8901',
                'identification_number' => '02678901-2',
                'role' => 'customer',
            ],
        ];

        foreach ($clients as $clientData) {
            User::firstOrCreate(
                ['email' => $clientData['email']],
                $clientData
            );
        }
    }
}
