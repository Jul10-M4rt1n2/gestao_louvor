<?php

namespace App\Policies;

use App\Models\Schedule;
use App\Models\User;

class ScalePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view schedules list
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Schedule $schedule): bool
    {
        // Users can view schedules from their organization
        return $user->organization_id === $schedule->organization_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create schedules
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Schedule $schedule): bool
    {
        // Users can update schedules from their organization
        // TODO: Add role-based permission (admin, lider)
        return $user->organization_id === $schedule->organization_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Schedule $schedule): bool
    {
        // Users can delete schedules from their organization
        // TODO: Add role-based permission (admin, lider)
        return $user->organization_id === $schedule->organization_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Schedule $schedule): bool
    {
        return $user->organization_id === $schedule->organization_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Schedule $schedule): bool
    {
        // Only admins can permanently delete
        // TODO: Add role check
        return $user->organization_id === $schedule->organization_id;
    }
}
