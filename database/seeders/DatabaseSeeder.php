<?php

namespace Database\Seeders;

use App\Models\User;
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

        // Vincular usuários aos grupos e definir funções
        foreach ($organizations as $org) {
            $users = \App\Models\User::where('organization_id', $org->id)->get();
            $groups = \App\Models\Group::where('organization_id', $org->id)->get();
            $functions = \App\Models\MinistryFunction::where('organization_id', $org->id)->get();

            foreach ($groups as $group) {
                // Cada grupo terá entre 3-8 membros
                $groupMembers = $users->random(rand(3, min(8, $users->count())));

                foreach ($groupMembers as $user) {
                    // Vincular usuário ao grupo
                    $user->groups()->attach($group->id, [
                        'joined_at' => now()->subDays(rand(1, 100)),
                        'active' => fake()->boolean(95),
                    ]);

                    // Atribuir 1-3 funções ao usuário dentro do grupo
                    $userFunctions = $functions->random(rand(1, min(3, $functions->count())));

                    foreach ($userFunctions as $function) {
                        $user->functions()->attach($function->id, [
                            'group_id' => $group->id,
                            'active' => fake()->boolean(90),
                        ]);
                    }
                }
            }
        }

        echo "✅ Seed concluído! Organizações, ministérios, grupos, funções e usuários criados.\n";
    }
}
