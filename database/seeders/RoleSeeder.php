<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Domain\User\Enums\UserRole;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrador',
                'slug' => UserRole::ADMIN->value,
                'description' => 'Acesso total ao sistema, pode gerenciar usuários, grupos, escalas e músicas',
            ],
            [
                'name' => 'Líder',
                'slug' => UserRole::LEADER->value,
                'description' => 'Pode gerenciar grupos, escalas e músicas',
            ],
            [
                'name' => 'Músico',
                'slug' => UserRole::MUSICIAN->value,
                'description' => 'Pode participar de grupos e escalas, adicionar músicas',
            ],
            [
                'name' => 'Visitante',
                'slug' => UserRole::VISITOR->value,
                'description' => 'Acesso limitado, pode visualizar conteúdo',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }
    }
}

