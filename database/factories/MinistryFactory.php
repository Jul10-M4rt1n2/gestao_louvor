<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ministry>
 */
class MinistryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ministries = [
            ['name' => 'Louvor e Adoração', 'icon' => 'music', 'color' => '#3B82F6'],
            ['name' => 'Mídia', 'icon' => 'video', 'color' => '#EF4444'],
            ['name' => 'Mesa de Áudio', 'icon' => 'mic', 'color' => '#10B981'],
            ['name' => 'Transmissão', 'icon' => 'broadcast', 'color' => '#F59E0B'],
            ['name' => 'Intercessão', 'icon' => 'pray', 'color' => '#8B5CF6'],
        ];

        $ministry = fake()->randomElement($ministries);
        $uniqueName = $ministry['name'].' - '.fake()->company(); // ← Tornando único

        return [
            'name' => $uniqueName,
            'slug' => \Illuminate\Support\Str::slug($uniqueName), // ← Slug único
            'description' => fake()->sentence(8),
            'icon' => $ministry['icon'],
            'color' => $ministry['color'],
            'active' => fake()->boolean(95),
            'organization_id' => \App\Models\Organization::factory(),
        ];
    }
}
