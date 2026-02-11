<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Ministry;
use App\Models\MinistryFunction;
use App\Models\Music;
use App\Models\Organization;
use App\Models\Role;
use App\Models\Schedule;
use App\Models\ScheduleMusic;
use App\Models\ScheduleParticipant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Criar Roles
        $this->call(RoleSeeder::class);
        $this->command->info('Roles criadas.');

        // Buscar roles para atribuição
        $adminRole = Role::where('slug', 'admin')->first();
        $leaderRole = Role::where('slug', 'lider')->first();
        $musicianRole = Role::where('slug', 'musico')->first();

        // 2. Criar 3 Organizações
        $organizations = Organization::factory(3)->create();
        $this->command->info('3 organizações criadas.');

        foreach ($organizations as $orgIndex => $org) {
            // 3. Criar ministérios
            $ministries = Ministry::factory(rand(2, 4))
                ->create(['organization_id' => $org->id]);

            // 4. Criar funções
            $functions = MinistryFunction::factory(rand(8, 12))
                ->create(['organization_id' => $org->id]);

            // 5. Criar grupos por ministério
            $allGroups = collect();
            foreach ($ministries as $ministry) {
                $groups = Group::factory(rand(1, 3))
                    ->create([
                        'ministry_id' => $ministry->id,
                        'organization_id' => $org->id,
                    ]);
                $allGroups = $allGroups->merge($groups);
            }

            // 6. Criar usuários
            $users = User::factory(rand(10, 20))
                ->create(['organization_id' => $org->id]);

            // 7. Atribuir roles aos usuários
            foreach ($users as $i => $user) {
                if ($i === 0 && $leaderRole) {
                    // Primeiro usuário de cada org é líder
                    $user->roles()->attach($leaderRole->id, ['organization_id' => $org->id]);
                } elseif ($musicianRole) {
                    $user->roles()->attach($musicianRole->id, ['organization_id' => $org->id]);
                }
            }

            // 8. Vincular usuários aos grupos e atribuir funções
            foreach ($allGroups as $group) {
                $groupMembers = $users->random(rand(3, min(8, $users->count())));

                foreach ($groupMembers as $user) {
                    $user->groups()->syncWithoutDetaching([
                        $group->id => [
                            'joined_at' => now()->subDays(rand(1, 100)),
                            'active' => fake()->boolean(95),
                        ],
                    ]);

                    $userFunctions = $functions->random(rand(1, min(3, $functions->count())));
                    foreach ($userFunctions as $function) {
                        $exists = DB::table('user_functions')
                            ->where('user_id', $user->id)
                            ->where('function_id', $function->id)
                            ->where('group_id', $group->id)
                            ->exists();

                        if (!$exists) {
                            $user->functions()->attach($function->id, [
                                'group_id' => $group->id,
                                'active' => fake()->boolean(90),
                            ]);
                        }
                    }
                }
            }

            // 9. Criar músicas
            $creator = $users->first();
            $musics = Music::factory(rand(15, 25))
                ->sequence(fn($sequence) => ['title' => $this->getMusicTitle($sequence->index)])
                ->create([
                    'organization_id' => $org->id,
                    'created_by' => $creator->id,
                ]);
            $this->command->info("  {$musics->count()} músicas criadas para '{$org->name}'.");

            // 10. Criar escalas (schedules) com músicas e participantes
            foreach ($allGroups as $group) {
                // Escalas futuras
                $futureSchedules = Schedule::factory(rand(2, 5))
                    ->upcoming()
                    ->create([
                        'group_id' => $group->id,
                        'organization_id' => $org->id,
                    ]);

                // Escalas passadas
                $pastSchedules = Schedule::factory(rand(2, 4))
                    ->past()
                    ->create([
                        'group_id' => $group->id,
                        'organization_id' => $org->id,
                    ]);

                $allSchedules = $futureSchedules->merge($pastSchedules);

                foreach ($allSchedules as $schedule) {
                    // Adicionar músicas à escala
                    $scheduleMusics = $musics->random(rand(3, min(6, $musics->count())));
                    $order = 1;
                    foreach ($scheduleMusics as $music) {
                        ScheduleMusic::create([
                            'schedule_id' => $schedule->id,
                            'music_id' => $music->id,
                            'custom_key' => fake()->optional(0.4)->randomElement(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
                            'order' => $order++,
                            'notes' => fake()->optional(0.2)->sentence(4),
                        ]);
                    }

                    // Adicionar participantes à escala
                    $groupMemberIds = DB::table('user_groups')
                        ->where('group_id', $group->id)
                        ->pluck('user_id');

                    if ($groupMemberIds->isNotEmpty()) {
                        $participantUsers = User::whereIn('id', $groupMemberIds)
                            ->inRandomOrder()
                            ->take(rand(3, min(6, $groupMemberIds->count())))
                            ->get();

                        foreach ($participantUsers as $participant) {
                            $status = $schedule->status === 'concluida'
                                ? fake()->randomElement(['confirmado', 'ausente'])
                                : fake()->randomElement(['convidado', 'confirmado', 'rejeitado']);

                            $functionId = $functions->random()->id;

                            $exists = DB::table('schedule_participants')
                                ->where('schedule_id', $schedule->id)
                                ->where('user_id', $participant->id)
                                ->where('function_id', $functionId)
                                ->exists();

                            if (!$exists) {
                                ScheduleParticipant::create([
                                    'schedule_id' => $schedule->id,
                                    'user_id' => $participant->id,
                                    'function_id' => $functionId,
                                    'status' => $status,
                                    'notes' => fake()->optional(0.1)->sentence(3),
                                    'confirmed_at' => $status === 'confirmado' ? now()->subDays(rand(1, 14)) : null,
                                ]);
                            }
                        }
                    }
                }
            }

            $this->command->info("  Escalas com músicas e participantes criadas para '{$org->name}'.");
        }

        // 11. Criar um usuário admin fixo para testes na primeira organização
        $firstOrg = $organizations->first();
        $adminUser = User::factory()->create([
            'name' => 'Admin Teste',
            'email' => 'admin@teste.com',
            'password' => bcrypt('password'),
            'organization_id' => $firstOrg->id,
        ]);

        if ($adminRole) {
            $adminUser->roles()->attach($adminRole->id, ['organization_id' => $firstOrg->id]);
        }

        // Vincular admin a todos os grupos da primeira org
        $firstOrgGroups = Group::where('organization_id', $firstOrg->id)->get();
        foreach ($firstOrgGroups as $group) {
            $adminUser->groups()->syncWithoutDetaching([
                $group->id => [
                    'joined_at' => now(),
                    'active' => true,
                ],
            ]);
        }

        $this->command->newLine();
        $this->command->info('Seed completo!');
        $this->command->info('Login de teste: admin@teste.com / password');
        $this->command->newLine();
        $this->command->table(
            ['Entidade', 'Total'],
            [
                ['Organizações', Organization::count()],
                ['Ministérios', Ministry::count()],
                ['Grupos', Group::count()],
                ['Usuários', User::count()],
                ['Músicas', Music::count()],
                ['Escalas', Schedule::count()],
                ['Músicas em escalas', ScheduleMusic::count()],
                ['Participantes em escalas', ScheduleParticipant::count()],
                ['Funções', MinistryFunction::count()],
            ]
        );
    }

    private function getMusicTitle(int $index): string
    {
        $titles = [
            'Grande é o Senhor',
            'Quão Grande é o Meu Deus',
            'Canta oh Minha Alma',
            'Goodness of God',
            'Way Maker',
            'Reckless Love',
            'What a Beautiful Name',
            'Oceans',
            'Blessed Be Your Name',
            'How Great Is Our God',
            'Ninguém Explica Deus',
            'Lugar Secreto',
            'Eu Me Rendo',
            'A Casa é Sua',
            'Meu Deus é Fiel',
            'Santo Espírito',
            'Yeshua',
            'Raridade',
            'Deus de Promessas',
            'Ousado Amor',
            'Teu Santo Nome',
            'Fiel a Mim',
            'Bondade de Deus',
            'Me Atraiu',
            'Creio em Ti',
        ];

        return $titles[$index % count($titles)];
    }
}
