<?php

namespace Database\Factories;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\post;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<post>
 */
class postfactoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'title' => fake()->sentence(),
        'content' => fake()->paragraph(),
        'user_id' => App\Models\User::factory(),
        ];
public function 

        post::factory()
    }
}
