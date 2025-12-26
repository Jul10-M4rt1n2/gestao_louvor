<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MinistryFunction>
 */
class MinistryFunctionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $functions = [
            ['name' => 'Vocal Principal', 'category' => 'music'],
            ['name' => 'Back Vocal', 'category' => 'music'],
            ['name' => 'Violão', 'category' => 'music'],
            ['name' => 'Guitarra', 'category' => 'music'],
            ['name' => 'Baixo', 'category' => 'music'],
            ['name' => 'Teclado', 'category' => 'music'],
            ['name' => 'Bateria', 'category' => 'music'],
            ['name' => 'Operador de Câmera', 'category' => 'tech'],
            ['name' => 'Editor de Video', 'category' => 'tech'],
            ['name' => 'Mesa de Som', 'category' => 'tech'],
            ['name' => 'Técnico de Áudio', 'category' => 'tech'],
            ['name' => 'Streaming', 'category' => 'tech'],
        ];

        $function = fake()->randomElement($functions);

        return [
            'name' => $function['name'],
            'slug' => \Illuminate\Support\Str::slug($function['name'].'-'.fake()->numberBetween(1, 999)),
            'description' => fake()->sentence(5),
            'icon' => fake()->randomElement(['mic', 'guitar', 'drums', 'video', 'settings']),
            'category' => $function['category'],
            'active' => fake()->boolean(95),
            'organization_id' => \App\Models\Organization::factory(),
        ];
    }
}
