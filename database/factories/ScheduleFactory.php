<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    public function definition(): array
    {
        $types = ['culto', 'ensaio', 'evento_especial'];

        $typeLabels = [
            'culto' => ['Culto Domingo Manhã', 'Culto Domingo Noite', 'Culto Quarta-feira', 'Culto de Jovens', 'Culto de Oração'],
            'ensaio' => ['Ensaio Semanal', 'Ensaio Geral', 'Ensaio de Preparação', 'Passagem de Som'],
            'evento_especial' => ['Conferência de Louvor', 'Noite de Adoração', 'Vigília', 'Encontro Especial'],
        ];

        $type = fake()->randomElement($types);
        $title = fake()->randomElement($typeLabels[$type]);

        return [
            'title' => $title . ' - ' . fake()->dayOfWeek() . ' ' . fake()->date('d/m'),
            'type' => $type,
            'description' => fake()->optional(0.5)->sentence(8),
            'scheduled_at' => fake()->dateTimeBetween('-1 month', '+2 months'),
            'duration' => fake()->randomElement(['01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00']),
            'location' => fake()->randomElement(['Templo Principal', 'Salão Social', 'Sala de Ensaio', 'Auditório', null]),
            'status' => fake()->randomElement(['planejada', 'confirmada', 'em_andamento', 'concluida', 'cancelada']),
            'group_id' => Group::factory(),
            'organization_id' => Organization::factory(),
        ];
    }

    public function upcoming(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => fake()->dateTimeBetween('+1 day', '+2 months'),
            'status' => fake()->randomElement(['planejada', 'confirmada']),
        ]);
    }

    public function past(): static
    {
        return $this->state(fn(array $attributes) => [
            'scheduled_at' => fake()->dateTimeBetween('-2 months', '-1 day'),
            'status' => fake()->randomElement(['concluida', 'cancelada']),
        ]);
    }
}
