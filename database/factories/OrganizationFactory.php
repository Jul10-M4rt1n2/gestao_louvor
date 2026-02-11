<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Ministry;
use App\Models\MinistryFunction;
use App\Models\Music;
use App\Models\Organization;
use App\Models\Schedule;
use App\Models\ScheduleMusic;
use App\Models\ScheduleParticipant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company() . ' ' . fake()->randomElement(['Igreja', 'Ministério', 'Comunidade']);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(10),
            'active' => true,
        ];
    }

    /**
     * Organização completa com toda a hierarquia de dados.
     */
    public function withFullStructure(): static
    {
        return $this->afterCreating(function (Organization $org) {
            // Ministérios
            $ministries = Ministry::factory(rand(2, 4))
                ->for($org)
                ->create();

            // Funções
            $functions = MinistryFunction::factory(rand(8, 12))
                ->create(['organization_id' => $org->id]);

            // Usuários
            $users = User::factory(rand(10, 20))
                ->for($org)
                ->create();

            // Grupos por ministério
            $allGroups = collect();
            foreach ($ministries as $ministry) {
                $groups = Group::factory(rand(1, 3))
                    ->for($ministry)
                    ->for($org)
                    ->create();
                $allGroups = $allGroups->merge($groups);
            }

            // Vincular usuários aos grupos com funções
            foreach ($allGroups as $group) {
                $members = $users->random(rand(3, min(8, $users->count())));

                foreach ($members as $user) {
                    $user->groups()->syncWithoutDetaching([
                        $group->id => [
                            'joined_at' => now()->subDays(rand(1, 100)),
                            'active' => fake()->boolean(95),
                        ],
                    ]);

                    $userFunctions = $functions->random(rand(1, min(3, $functions->count())));
                    foreach ($userFunctions as $fn) {
                        $exists = DB::table('user_functions')
                            ->where('user_id', $user->id)
                            ->where('function_id', $fn->id)
                            ->where('group_id', $group->id)
                            ->exists();

                        if (!$exists) {
                            $user->functions()->attach($fn->id, [
                                'group_id' => $group->id,
                                'active' => fake()->boolean(90),
                            ]);
                        }
                    }
                }
            }

            // Músicas
            $musics = Music::factory(rand(15, 25))
                ->for($org)
                ->create(['created_by' => $users->first()->id]);

            // Escalas com músicas e participantes
            foreach ($allGroups as $group) {
                $futureSchedules = Schedule::factory(rand(2, 5))
                    ->upcoming()
                    ->for($group)
                    ->for($org)
                    ->create();

                $pastSchedules = Schedule::factory(rand(2, 4))
                    ->past()
                    ->for($group)
                    ->for($org)
                    ->create();

                $allSchedules = $futureSchedules->merge($pastSchedules);

                $groupMemberIds = DB::table('user_groups')
                    ->where('group_id', $group->id)
                    ->pluck('user_id');

                foreach ($allSchedules as $schedule) {
                    // Músicas na escala
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

                    // Participantes na escala
                    if ($groupMemberIds->isNotEmpty()) {
                        $participantIds = $groupMemberIds->random(min(rand(3, 6), $groupMemberIds->count()));

                        if (!is_iterable($participantIds)) {
                            $participantIds = collect([$participantIds]);
                        }

                        foreach ($participantIds as $userId) {
                            $status = $schedule->status === 'concluida'
                                ? fake()->randomElement(['confirmado', 'ausente'])
                                : fake()->randomElement(['convidado', 'confirmado', 'rejeitado']);

                            $exists = DB::table('schedule_participants')
                                ->where('schedule_id', $schedule->id)
                                ->where('user_id', $userId)
                                ->exists();

                            if (!$exists) {
                                ScheduleParticipant::create([
                                    'schedule_id' => $schedule->id,
                                    'user_id' => $userId,
                                    'function_id' => $functions->random()->id,
                                    'status' => $status,
                                    'notes' => fake()->optional(0.1)->sentence(3),
                                    'confirmed_at' => $status === 'confirmado' ? now()->subDays(rand(1, 14)) : null,
                                ]);
                            }
                        }
                    }
                }
            }
        });
    }
}
