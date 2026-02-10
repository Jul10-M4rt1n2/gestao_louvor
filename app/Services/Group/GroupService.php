<?php

namespace App\Services\Group;

use App\Models\Group;
use App\Models\User;
use App\Models\MinistryFunction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class GroupService
{
    /**
     * Get paginated list of groups with filters
     */
    public function list(int $organizationId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Group::query()
            ->where('organization_id', $organizationId)
            ->with(['ministry', 'users']);

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Ministry filter
        if (!empty($filters['ministry_id'])) {
            $query->where('ministry_id', $filters['ministry_id']);
        }

        // Active status filter
        if (isset($filters['active'])) {
            $query->where('active', (bool) $filters['active']);
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Get a single group with relationships
     */
    public function find(int $groupId, int $organizationId): ?Group
    {
        return Group::where('id', $groupId)
            ->where('organization_id', $organizationId)
            ->with(['ministry', 'users.functions', 'activeFunctions'])
            ->first();
    }

    /**
     * Create a new group
     */
    public function create(array $data, int $organizationId): Group
    {
        $data['organization_id'] = $organizationId;
        
        // Ensure meeting_days is properly formatted as JSON array
        if (isset($data['meeting_days']) && is_array($data['meeting_days'])) {
            $data['meeting_days'] = json_encode($data['meeting_days']);
        }

        return Group::create($data);
    }

    /**
     * Update an existing group
     */
    public function update(Group $group, array $data): Group
    {
        // Ensure meeting_days is properly formatted as JSON array
        if (isset($data['meeting_days']) && is_array($data['meeting_days'])) {
            $data['meeting_days'] = json_encode($data['meeting_days']);
        }

        $group->update($data);
        return $group->fresh(['ministry', 'users']);
    }

    /**
     * Delete a group
     */
    public function delete(Group $group): bool
    {
        return $group->delete();
    }

    /**
     * Add a member to a group
     */
    public function addMember(Group $group, int $userId, array $functionIds = []): void
    {
        DB::transaction(function () use ($group, $userId, $functionIds) {
            // Add to user_groups if not already a member
            if (!$group->users()->where('user_id', $userId)->exists()) {
                $group->users()->attach($userId, [
                    'joined_at' => now(),
                    'active' => true,
                ]);
            }

            // Add functions if provided
            if (!empty($functionIds)) {
                $this->updateMemberFunctions($group, $userId, $functionIds);
            }
        });
    }

    /**
     * Update member functions in a group
     */
    public function updateMemberFunctions(Group $group, int $userId, array $functionIds): void
    {
        $user = User::findOrFail($userId);
        
        // Remove existing functions for this user in this group
        DB::table('user_functions')
            ->where('user_id', $userId)
            ->where('group_id', $group->id)
            ->delete();

        // Add new functions
        foreach ($functionIds as $functionId) {
            DB::table('user_functions')->insert([
                'user_id' => $userId,
                'function_id' => $functionId,
                'group_id' => $group->id,
                'active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Remove a member from a group
     */
    public function removeMember(Group $group, int $userId): void
    {
        DB::transaction(function () use ($group, $userId) {
            // Remove from user_groups
            $group->users()->detach($userId);

            // Remove all functions for this user in this group
            DB::table('user_functions')
                ->where('user_id', $userId)
                ->where('group_id', $group->id)
                ->delete();
        });
    }

    /**
     * Get members of a group with their functions
     */
    public function getMembers(Group $group): array
    {
        $members = $group->users()
            ->wherePivot('active', true)
            ->with('functions')
            ->get();

        return $members->map(function ($member) use ($group) {
            $functions = DB::table('user_functions')
                ->where('user_id', $member->id)
                ->where('group_id', $group->id)
                ->where('active', true)
                ->pluck('function_id')
                ->toArray();

            $functionNames = MinistryFunction::whereIn('id', $functions)
                ->pluck('name')
                ->toArray();

            return [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'phone' => $member->phone,
                'functions' => $functionNames,
                'function_ids' => $functions,
            ];
        })->toArray();
    }

    /**
     * Toggle group active status
     */
    public function toggleActive(Group $group): Group
    {
        $group->update(['active' => !$group->active]);
        return $group->fresh();
    }
}
