<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'phone' => $this->faker->phoneNumber(),
            'department' => $this->faker->randomElement(['Seguridad', 'Operaciones', 'TI', 'Administracion']),
            'position' => $this->faker->jobTitle(),
            'bio' => $this->faker->optional()->sentence(),
            'avatar' => null,
            'status' => 'active',
        ];
    }
}
