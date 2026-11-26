<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        Chat::factory()->count(3)->create()->each(function (Chat $chat) use ($users) {
            $chat->users()->attach($users->random(min(3, $users->count()))->pluck('id'));
        });
    }
}
