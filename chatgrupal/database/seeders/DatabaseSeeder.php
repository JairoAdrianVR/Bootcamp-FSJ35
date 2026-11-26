<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            RandomUserSeeder::class,
            ChatSeeder::class,
            MessageSeeder::class,
            ProfileSeeder::class,
        ]);
    }
}
