<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $groupTypes = [
            'Grupo de Louvor 1',
            'Grupo de Louvor 2',
            'Midia Domingo Manhã',
            'Midia Domingo Noite',
            'Audio Principal',
            'Audio Alternativo',
            'Transmissao Live',
            'Intercessao Manha'
        ];

        $name = fake()->randomElement($groupTypes);

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name . ' ' . fake()->unique()->numberBetween(1, 9999)),
            'description' => fake()->sentence(6),
            'active' => fake()->boolean(90),
            'meeting_days' => fake()->randomElement([
                [0], // Domingo
                [0, 3], // Domingo e Quarta
                [6],  // Sábado
                [0, 6] // Domingo e Sábado
            ]),
            'meeting_time' => fake()->time('H:i:s', '20:00:00'),
            'ministry_id' => \App\Models\Ministry::factory(),
            'organization_id' => function (array $attributes) {
                return \App\Models\Ministry::find($attributes['ministry_id'])->organization_id;
            },
        ];
    }
}
