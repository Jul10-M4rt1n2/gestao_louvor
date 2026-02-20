<?php

namespace App\Domain\User\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case LEADER = 'lider';
    case MUSICIAN = 'musico';
    case VISITOR = 'visitante';

    /**
     * Get the human-readable label
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrador',
            self::LEADER => 'Líder',
            self::MUSICIAN => 'Músico',
            self::VISITOR => 'Visitante',
        };
    }

    /**
     * Get the description
     */
    public function description(): string
    {
        return match ($this) {
            self::ADMIN => 'Acesso total ao sistema',
            self::LEADER => 'Gerencia grupos e escalas',
            self::MUSICIAN => 'Participa de grupos e escalas',
            self::VISITOR => 'Acesso limitado ao sistema',
        };
    }

    /**
     * Check if the role can manage users
     */
    public function canManageUsers(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if the role can manage groups
     */
    public function canManageGroups(): bool
    {
        return in_array($this, [self::ADMIN, self::LEADER]);
    }

    /**
     * Check if the role can manage schedules
     */
    public function canManageSchedules(): bool
    {
        return in_array($this, [self::ADMIN, self::LEADER]);
    }

    /**
     * Check if the role can manage musics
     */
    public function canManageMusics(): bool
    {
        return in_array($this, [self::ADMIN, self::LEADER, self::MUSICIAN]);
    }
}
