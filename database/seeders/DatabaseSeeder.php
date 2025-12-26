<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar 3 organizações
        $organizations = \App\Models\Organization::factory(3)->create();

        foreach ($organizations as $org) {
            // Para cada organização, criar 2-4 ministérios
            $ministries = \App\Models\Ministry::factory(rand(2, 4))
                ->create(['organization_id' => $org->id]);

            foreach ($ministries as $ministry) {
                // Para cada ministério, criar 1-3 grupos
                $groups = \App\Models\Group::factory(rand(1, 3))
                    ->create([
                        'ministry_id' => $ministry->id,
                        'organization_id' => $org->id,
                    ]);
            }

            // Para cada organização, criar 8-15 funções
            \App\Models\MinistryFunction::factory(rand(8, 15))
                ->create(['organization_id' => $org->id]);

            // Para cada organização, criar 10-20 usuários
            \App\Models\User::factory(rand(10, 20))
                ->create(['organization_id' => $org->id]);
        }

        echo "✅ Seed concluído! Organizações, ministérios, grupos, funções e usuários criados.\n";
    }
}
