<?php

namespace App\Policies;

use App\Models\Music;
use App\Models\User;

class MusicPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view music list
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Music $music): bool
    {
        // Users can view music from their organization
        return $user->organization_id === $music->organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create music
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Music $music): bool
    {
        // Users can update music from their organization
        // TODO: Add role-based permission (admin, lider)
        return $user->organization_id === $music->organization_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Music $music): bool
    {
        // Users can delete music from their organization
        // TODO: Add role-based permission (admin, lider)
        return $user->organization_id === $music->organization_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Music $music): bool
    {
        return $user->organization_id === $music->organization_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Music $music): bool
    {
        // Only admins can permanently delete
        // TODO: Add role check
        return $user->organization_id === $music->organization_id;
    }
}
