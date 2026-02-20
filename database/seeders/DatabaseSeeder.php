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
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Roles
        $this->call(RoleSeeder::class);
        $this->command->info('✅ Roles criadas.');

        // 2. Organização
        $org = Organization::create([
            'name' => 'Igreja Vida Nova',
            'slug' => 'igreja-vida-nova',
            'description' => 'Cristã Evangélica - Pois para mim o viver é Cristo e o morrer é lucro. (Filipenses 1:21)',
            'active' => true,
        ]);

        $this->command->info('✅ Organização "Igreja Vida Nova" criada.');

        // 3. Ministérios
        $ministerios = [
            ['name' => 'Louvor e Adoração', 'slug' => 'louvor-e-adoracao', 'description' => 'Ministério de louvor e adoração', 'icon' => 'music', 'color' => '#3B82F6'],
            ['name' => 'Mídia e Comunicação', 'slug' => 'midia-e-comunicacao', 'description' => 'Mídia, transmissão e comunicação visual', 'icon' => 'video', 'color' => '#EF4444'],
            ['name' => 'Sonorização', 'slug' => 'sonorizacao', 'description' => 'Mesa de som e equipamentos de áudio', 'icon' => 'mic', 'color' => '#10B981'],
        ];

        $ministries = collect();
        foreach ($ministerios as $m) {
            $ministries->push(Ministry::create(array_merge($m, [
                'active' => true,
                'organization_id' => $org->id,
            ])));
        }

        $this->command->info('✅ 3 ministérios criados.');

        // 4. Funções
        $funcoes = [
            'vocal'        => ['name' => 'Vocal Principal', 'slug' => 'vocal-principal', 'category' => 'music', 'icon' => 'mic'],
            'backvocal'    => ['name' => 'Back Vocal', 'slug' => 'back-vocal', 'category' => 'music', 'icon' => 'mic'],
            'violao'       => ['name' => 'Violão', 'slug' => 'violao', 'category' => 'music', 'icon' => 'guitar'],
            'guitarra'     => ['name' => 'Guitarra', 'slug' => 'guitarra', 'category' => 'music', 'icon' => 'guitar'],
            'baixo'        => ['name' => 'Baixo', 'slug' => 'baixo', 'category' => 'music', 'icon' => 'guitar'],
            'teclado'      => ['name' => 'Teclado/Piano', 'slug' => 'teclado-piano', 'category' => 'music', 'icon' => 'keyboard'],
            'bateria'      => ['name' => 'Bateria', 'slug' => 'bateria', 'category' => 'music', 'icon' => 'drums'],
            'som'          => ['name' => 'Mesa de Som', 'slug' => 'mesa-de-som', 'category' => 'tech', 'icon' => 'settings'],
            'transmissao'  => ['name' => 'Transmissão/Streaming', 'slug' => 'transmissao-streaming', 'category' => 'tech', 'icon' => 'broadcast'],
            'slide'        => ['name' => 'Projeção/Slides', 'slug' => 'projecao-slides', 'category' => 'tech', 'icon' => 'monitor'],
            'midia'        => ['name' => 'Mídia/Anúncios', 'slug' => 'midia-anuncios', 'category' => 'tech', 'icon' => 'video'],
            'foto'         => ['name' => 'Fotografia', 'slug' => 'fotografia', 'category' => 'tech', 'icon' => 'camera'],
        ];

        $functions = collect();
        foreach ($funcoes as $key => $f) {
            $functions[$key] = MinistryFunction::create(array_merge($f, [
                'description' => null,
                'active' => true,
                'organization_id' => $org->id,
            ]));
        }

        $this->command->info('✅ ' . $functions->count() . ' funções criadas.');

        // 5. Grupos
        $louvorA = Group::create([
            'name' => 'Equipe de Louvor A',
            'slug' => 'equipe-louvor-a',
            'description' => 'Equipe principal de louvor - Domingo manhã',
            'active' => true,
            'meeting_days' => [0],
            'meeting_time' => '08:00:00',
            'ministry_id' => $ministries[0]->id,
            'organization_id' => $org->id,
        ]);

        $louvorB = Group::create([
            'name' => 'Equipe de Louvor B',
            'slug' => 'equipe-louvor-b',
            'description' => 'Equipe de louvor - Domingo noite',
            'active' => true,
            'meeting_days' => [0],
            'meeting_time' => '19:00:00',
            'ministry_id' => $ministries[0]->id,
            'organization_id' => $org->id,
        ]);

        $louvorC = Group::create([
            'name' => 'Equipe de Louvor C',
            'slug' => 'equipe-louvor-c',
            'description' => 'Equipe de louvor - Quarta-feira',
            'active' => true,
            'meeting_days' => [3],
            'meeting_time' => '19:30:00',
            'ministry_id' => $ministries[0]->id,
            'organization_id' => $org->id,
        ]);

        $equipeMidia = Group::create([
            'name' => 'Equipe de Mídia',
            'slug' => 'equipe-midia',
            'description' => 'Transmissão, projeção e comunicação visual',
            'active' => true,
            'meeting_days' => [0, 3],
            'meeting_time' => '18:00:00',
            'ministry_id' => $ministries[1]->id,
            'organization_id' => $org->id,
        ]);

        $this->command->info('✅ 4 grupos criados.');

        // 6. Roles
        $adminRole = Role::where('slug', 'admin')->first();
        $musicianRole = Role::where('slug', 'musico')->first();

        // 7. Helper para criar usuário
        $allUsers = collect();
        $usersByName = [];

        $createUser = function (string $name, ?string $email = null) use ($org, $musicianRole, &$allUsers, &$usersByName) {
            $key = Str::slug($name);

            // Se já existe, retorna o existente (pessoas que tocam em mais de um grupo)
            if (isset($usersByName[$key])) {
                return $usersByName[$key];
            }

            $finalEmail = $email ?? Str::slug($name, '.') . '@vidanova.com';

            $user = User::factory()->create([
                'name' => $name,
                'email' => $finalEmail,
                'organization_id' => $org->id,
            ]);

            if ($musicianRole) {
                $user->roles()->attach($musicianRole->id, ['organization_id' => $org->id]);
            }

            $allUsers->push($user);
            $usersByName[$key] = $user;

            return $user;
        };

        // Helper para vincular membro ao grupo com funções
        $addMember = function (User $user, Group $group, array $functionKeys) use ($functions) {
            $user->groups()->syncWithoutDetaching([
                $group->id => [
                    'joined_at' => now()->subDays(rand(30, 365)),
                    'active' => true,
                ],
            ]);

            foreach ($functionKeys as $fk) {
                if (!isset($functions[$fk])) continue;

                $exists = \DB::table('user_functions')
                    ->where('user_id', $user->id)
                    ->where('function_id', $functions[$fk]->id)
                    ->where('group_id', $group->id)
                    ->exists();

                if (!$exists) {
                    $user->functions()->attach($functions[$fk]->id, [
                        'group_id' => $group->id,
                        'active' => true,
                    ]);
                }
            }
        };

        // ==========================================
        // EQUIPE DE LOUVOR A
        // ==========================================
        $laura     = $createUser('Laura');
        $fernando  = $createUser('Fernando');
        $eliane    = $createUser('Eliane');
        $edson     = $createUser('Edson');
        $katya     = $createUser('Katya');
        $ademilton = $createUser('Ademilton');
        $lisa      = $createUser('Lisa');
        $anerose   = $createUser('Anerose');
        $pauloCesar = $createUser('Paulo Cesar');
        $debora    = $createUser('Débora');

        $addMember($laura,     $louvorA, ['bateria', 'backvocal']);
        $addMember($fernando,  $louvorA, ['bateria', 'vocal']);
        $addMember($eliane,    $louvorA, ['backvocal']);
        $addMember($edson,     $louvorA, ['backvocal']);
        $addMember($katya,     $louvorA, ['backvocal']);
        $addMember($ademilton, $louvorA, ['violao']);
        $addMember($lisa,      $louvorA, ['teclado']);
        $addMember($anerose,   $louvorA, ['teclado']);
        $addMember($pauloCesar, $louvorA, ['baixo']);
        $addMember($debora,    $louvorA, ['guitarra']);

        $this->command->info('  🎵 Equipe de Louvor A: 10 membros');

        // ==========================================
        // EQUIPE DE LOUVOR B
        // ==========================================
        $kaua      = $createUser('Kauã');
        // Paulo Cesar já existe, será reutilizado
        $david     = $createUser('David');
        $andre     = $createUser('André');
        $julio     = $createUser('Julio');
        $mariana   = $createUser('Mariana');
        $dudu      = $createUser('Dudu');
        $daniela   = $createUser('Daniela');
        $mariaClara = $createUser('Maria Clara');

        $addMember($kaua,       $louvorB, ['bateria']);
        $addMember($pauloCesar, $louvorB, ['baixo']);
        $addMember($david,      $louvorB, ['guitarra']);
        $addMember($andre,      $louvorB, ['baixo']);
        $addMember($julio,      $louvorB, ['violao']);
        $addMember($mariana,    $louvorB, ['teclado']);
        $addMember($dudu,       $louvorB, ['vocal']);
        $addMember($daniela,    $louvorB, ['backvocal']);
        $addMember($mariaClara, $louvorB, ['backvocal']);

        $this->command->info('  🎵 Equipe de Louvor B: 9 membros');

        // ==========================================
        // EQUIPE DE LOUVOR C
        // ==========================================
        // Kauã já existe
        $davizinho    = $createUser('Davizinho');
        // Paulo Cesar, Julio já existem
        $pedro        = $createUser('Pedro');
        $anaLuiza     = $createUser('Ana Luiza');
        $mariaVictoria = $createUser('Maria Victoria');
        $raylla       = $createUser('Raylla');
        $victor       = $createUser('Victor');

        $addMember($kaua,           $louvorC, ['bateria']);
        $addMember($davizinho,      $louvorC, ['bateria']);
        $addMember($pauloCesar,     $louvorC, ['baixo']);
        $addMember($julio,          $louvorC, ['violao', 'vocal']);
        $addMember($pedro,          $louvorC, ['violao']);
        $addMember($anaLuiza,       $louvorC, ['teclado']);
        $addMember($mariaVictoria,  $louvorC, ['backvocal']);
        $addMember($raylla,         $louvorC, ['vocal']);
        $addMember($victor,         $louvorC, ['backvocal']);

        $this->command->info('  🎵 Equipe de Louvor C: 9 membros');

        // ==========================================
        // EQUIPE DE MÍDIA
        // ==========================================
        // Mariana, Maria Clara, Dudu, David já existem
        $anaVictoria = $createUser('Ana Victoria');
        $jefferson   = $createUser('Jefferson');

        $addMember($mariana,    $equipeMidia, ['midia']);
        $addMember($mariaClara, $equipeMidia, ['midia']);
        $addMember($dudu,       $equipeMidia, ['transmissao']);
        $addMember($anaVictoria, $equipeMidia, ['slide']);
        $addMember($david,      $equipeMidia, ['som', 'foto']);
        $addMember($jefferson,  $equipeMidia, ['som']);

        $this->command->info('  📺 Equipe de Mídia: 6 membros');

        // ==========================================
        // ADMIN (VOCÊ)
        // ==========================================
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@vidanova.com',
            'password' => bcrypt('password'),
            'organization_id' => $org->id,
        ]);

        if ($adminRole) {
            $admin->roles()->attach($adminRole->id, ['organization_id' => $org->id]);
        }

        // Admin participa de todos os grupos
        $allGroups = [$louvorA, $louvorB, $louvorC, $equipeMidia];
        foreach ($allGroups as $group) {
            $admin->groups()->attach($group->id, [
                'joined_at' => now(),
                'active' => true,
            ]);
        }

        $allUsers->push($admin);

        $this->command->info('✅ Admin criado: admin@vidanova.com / password');

        // ==========================================
        // RESUMO
        // ==========================================
        $this->command->newLine();
        $this->command->info('🎉 Seed completo!');
        $this->command->newLine();
        $this->command->info('📧 Login: admin@vidanova.com / password');
        $this->command->newLine();

        $this->command->table(
            ['Entidade', 'Total'],
            [
                ['Organizações', Organization::count()],
                ['Ministérios', Ministry::count()],
                ['Grupos', Group::count()],
                ['Usuários', User::count()],
                ['Funções', MinistryFunction::count()],
                ['Músicas', Music::count()],
                ['Escalas', Schedule::count()],
            ]
        );

        $this->command->newLine();
        $this->command->info('👥 Membros por grupo:');
        foreach ($allGroups as $group) {
            $count = \DB::table('user_groups')->where('group_id', $group->id)->count();
            $this->command->info("   {$group->name}: {$count} membros");
        }

        $this->command->newLine();
        $this->command->info('📝 Membros que tocam em múltiplos grupos:');
        $multiGroup = \DB::table('user_groups')
            ->select('user_id', \DB::raw('COUNT(*) as total'))
            ->groupBy('user_id')
            ->having('total', '>', 1)
            ->get();

        foreach ($multiGroup as $mg) {
            $user = User::find($mg->user_id);
            if ($user) {
                $this->command->info("   {$user->name}: {$mg->total} grupos");
            }
        }

        $this->command->newLine();
        $this->command->info('💡 Agora acesse o sistema e crie suas músicas e escalas!');
    }
}
