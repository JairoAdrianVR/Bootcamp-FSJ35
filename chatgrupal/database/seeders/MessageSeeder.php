<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach (Chat::all() as $chat) {
            Message::factory()->count(5)->create([
                'chat_id' => $chat->id,
                'user_id' => $users->random()->id,
            ]);
        }
    }
}
