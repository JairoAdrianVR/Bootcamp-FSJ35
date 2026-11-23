<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class HotelReservationSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ClientSeeder::class,
            RoomSeeder::class,
            ReservationSeeder::class,
        ]);
    }
}
