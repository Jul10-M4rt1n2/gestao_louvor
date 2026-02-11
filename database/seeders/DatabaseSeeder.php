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

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Roles (sempre necessárias)
        $this->call(RoleSeeder::class);
        $this->command->info('Roles criadas.');

        // 2. Criar 3 organizações completas usando a factory
        Organization::factory(3)
            ->withFullStructure()
            ->create();

        $this->command->info('3 organizações com estrutura completa criadas via Factory.');

        // 3. Atribuir roles aos usuários
        $adminRole = Role::where('slug', 'admin')->first();
        $leaderRole = Role::where('slug', 'lider')->first();
        $musicianRole = Role::where('slug', 'musico')->first();

        foreach (Organization::all() as $org) {
            $users = $org->users;

            foreach ($users as $i => $user) {
                if ($i === 0 && $leaderRole) {
                    $user->roles()->syncWithoutDetaching([
                        $leaderRole->id => ['organization_id' => $org->id],
                    ]);
                } elseif ($musicianRole) {
                    $user->roles()->syncWithoutDetaching([
                        $musicianRole->id => ['organization_id' => $org->id],
                    ]);
                }
            }
        }

        $this->command->info('Roles atribuídas aos usuários.');

        // 4. Criar usuário admin fixo para testes
        $firstOrg = Organization::first();

        $adminUser = User::factory()
            ->for($firstOrg)
            ->create([
                'name' => 'Admin Teste',
                'email' => 'admin@teste.com',
                'password' => bcrypt('password'),
            ]);

        if ($adminRole) {
            $adminUser->roles()->attach($adminRole->id, ['organization_id' => $firstOrg->id]);
        }

        // Vincular admin a todos os grupos da org
        $groupIds = Group::where('organization_id', $firstOrg->id)->pluck('id');

        foreach ($groupIds as $groupId) {
            $adminUser->groups()->syncWithoutDetaching([
                $groupId => [
                    'joined_at' => now(),
                    'active' => true,
                ],
            ]);
        }

        $this->command->info('Usuário admin de teste criado.');

        // 5. Resumo
        $this->command->newLine();
        $this->command->info('Seed completo!');
        $this->command->info('Login: admin@teste.com / password');
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
}
