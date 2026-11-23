<?php

namespace Database\Seeders;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Database\Seeder;

/**
 * Class RoomSeeder
 * 
 * Seeder para las entidades Hotel y Habitación.
 * Establece el inventario de hoteles y habitaciones con distintas categorías,
 * precios y capacidades para correlacionar con las reservas.
 */
class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Hoteles
        $hotel1 = Hotel::firstOrCreate(
            ['name' => 'Gran Hotel Real Intercontinental'],
            [
                'description' => 'Hotel de lujo con spa, piscina infinity, centro de negocios y restaurantes de alta cocina.',
                'address' => 'Bulevar de los Héroes, Col. Miramonte',
                'city' => 'San Salvador',
                'country' => 'El Salvador',
                'phone' => '+503 2211-3344',
                'email' => 'reservas@hotelreal.com',
                'star_rating' => 5,
                'is_active' => true,
            ]
        );

        $hotel2 = Hotel::firstOrCreate(
            ['name' => 'Boutique Hotel Costa Bella'],
            [
                'description' => 'Alojamiento paradisíaco frente al mar con vista al atardecer y acceso privado a la playa.',
                'address' => 'Km 42 Carretera El Litoral',
                'city' => 'La Libertad',
                'country' => 'El Salvador',
                'phone' => '+503 2344-5566',
                'email' => 'info@costabella.com',
                'star_rating' => 4,
                'is_active' => true,
            ]
        );

        $hotel3 = Hotel::firstOrCreate(
            ['name' => 'Hotel Eco Resort Miramundo'],
            [
                'description' => 'Cabañas ecológicas en la montaña rodeadas de pinos, clima fresco y senderos naturales.',
                'address' => 'Zona Alta La Palma, Cerro El Pital',
                'city' => 'Chalatenango',
                'country' => 'El Salvador',
                'phone' => '+503 2309-8877',
                'email' => 'contacto@miramundoresort.com',
                'star_rating' => 4,
                'is_active' => true,
            ]
        );

        // 2. Habitaciones para Hotel 1 (Gran Hotel Real Intercontinental)
        $roomsHotel1 = [
            [
                'room_number' => '101',
                'type' => 'single',
                'capacity' => 1,
                'price_per_night' => 85.00,
                'description' => 'Habitación individual ejecutiva con cama king, escritorio ergonómico y WiFi de alta velocidad.',
                'status' => 'available',
            ],
            [
                'room_number' => '102',
                'type' => 'double',
                'capacity' => 2,
                'price_per_night' => 130.00,
                'description' => 'Habitación doble superior con dos camas queen, balcón y vista panorámica a la ciudad.',
                'status' => 'available',
            ],
            [
                'room_number' => '103',
                'type' => 'double',
                'capacity' => 3,
                'price_per_night' => 145.00,
                'description' => 'Habitación doble familiar con cama king y sofá cama adicional.',
                'status' => 'available',
            ],
            [
                'room_number' => '201',
                'type' => 'suite',
                'capacity' => 4,
                'price_per_night' => 250.00,
                'description' => 'Master Suite presidencial con sala de estar, jacuzzi privado y servicio de mayordomo.',
                'status' => 'available',
            ],
            [
                'room_number' => '202',
                'type' => 'deluxe',
                'capacity' => 2,
                'price_per_night' => 180.00,
                'description' => 'Habitación Deluxe con terraza privada y acabados en mármol.',
                'status' => 'available',
            ],
            [
                'room_number' => '303',
                'type' => 'single',
                'capacity' => 1,
                'price_per_night' => 75.00,
                'description' => 'Habitación en mantenimiento temporal para calibración de aire acondicionado.',
                'status' => 'maintenance', // Para probar que el buscador excluye habitaciones en mantenimiento
            ],
        ];

        foreach ($roomsHotel1 as $roomData) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel1->id, 'room_number' => $roomData['room_number']],
                $roomData
            );
        }

        // 3. Habitaciones para Hotel 2 (Costa Bella)
        $roomsHotel2 = [
            [
                'room_number' => 'B-01',
                'type' => 'deluxe',
                'capacity' => 2,
                'price_per_night' => 175.00,
                'description' => 'Bungalow Deluxe frente al mar con hamaca, terraza privada y sonido de olas.',
                'status' => 'available',
            ],
            [
                'room_number' => 'B-02',
                'type' => 'suite',
                'capacity' => 4,
                'price_per_night' => 280.00,
                'description' => 'Villa frente a la playa con 2 dormitorios, minibar y piscina privada de inmersión.',
                'status' => 'available',
            ],
        ];

        foreach ($roomsHotel2 as $roomData) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel2->id, 'room_number' => $roomData['room_number']],
                $roomData
            );
        }

        // 4. Habitaciones para Hotel 3 (Eco Resort Miramundo)
        $roomsHotel3 = [
            [
                'room_number' => 'M-01',
                'type' => 'double',
                'capacity' => 2,
                'price_per_night' => 160.00,
                'description' => 'Cabaña de montaña con chimenea de leña, vista al bosque de niebla y desayuno campestre.',
                'status' => 'available',
            ],
            [
                'room_number' => 'M-02',
                'type' => 'suite',
                'capacity' => 4,
                'price_per_night' => 240.00,
                'description' => 'Cabaña alpina familiar con dos niveles, terraza mirador y zona de fogata.',
                'status' => 'available',
            ],
        ];

        foreach ($roomsHotel3 as $roomData) {
            Room::firstOrCreate(
                ['hotel_id' => $hotel3->id, 'room_number' => $roomData['room_number']],
                $roomData
            );
        }
    }
}
