<?php

namespace App\Services\Scale;

use App\Models\Schedule;
use App\Models\ScheduleMusic;
use App\Models\ScheduleParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ScaleService
{
    /**
     * Get paginated list of schedules with filters.
     */
    public function getPaginated(
        int $organizationId,
        ?string $search = null,
        ?string $status = null,
        ?int $groupId = null,
        ?string $startDate = null,
        ?string $endDate = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = Schedule::where('organization_id', $organizationId)
            ->with(['group', 'participants.user', 'participants.function', 'musics']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($groupId) {
            $query->where('group_id', $groupId);
        }

        if ($startDate) {
            $query->where('scheduled_at', '>=', Carbon::parse($startDate));
        }

        if ($endDate) {
            $query->where('scheduled_at', '<=', Carbon::parse($endDate)->endOfDay());
        }

        return $query->orderBy('scheduled_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get upcoming schedules.
     */
    public function getUpcoming(int $organizationId, int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return Schedule::where('organization_id', $organizationId)
            ->whereIn('status', ['planejada', 'confirmada'])
            ->where('scheduled_at', '>=', now())
            ->with(['group', 'participants.user', 'participants.function'])
            ->orderBy('scheduled_at', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get schedules for a specific week.
     */
    public function getWeekSchedules(int $organizationId, Carbon $date): \Illuminate\Database\Eloquent\Collection
    {
        $startOfWeek = $date->copy()->startOfWeek();
        $endOfWeek = $date->copy()->endOfWeek();

        return Schedule::where('organization_id', $organizationId)
            ->whereBetween('scheduled_at', [$startOfWeek, $endOfWeek])
            ->with(['group', 'participants.user', 'participants.function', 'musics'])
            ->orderBy('scheduled_at', 'asc')
            ->get();
    }

    /**
     * Create a new schedule.
     */
    public function create(array $data, User $user): Schedule
    {
        DB::beginTransaction();
        try {
            $schedule = Schedule::create([
                'title' => $data['title'],
                'type' => $data['type'] ?? 'culto',
                'description' => $data['description'] ?? null,
                'scheduled_at' => $data['scheduled_at'],
                'duration' => $data['duration'] ?? null,
                'location' => $data['location'] ?? null,
                'status' => $data['status'] ?? 'planejada',
                'group_id' => $data['group_id'],
                'organization_id' => $user->organization_id,
            ]);

            DB::commit();
            return $schedule->fresh(['group', 'participants', 'musics']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing schedule.
     */
    public function update(Schedule $schedule, array $data): Schedule
    {
        DB::beginTransaction();
        try {
            $schedule->update([
                'title' => $data['title'] ?? $schedule->title,
                'type' => $data['type'] ?? $schedule->type,
                'description' => $data['description'] ?? $schedule->description,
                'scheduled_at' => $data['scheduled_at'] ?? $schedule->scheduled_at,
                'duration' => $data['duration'] ?? $schedule->duration,
                'location' => $data['location'] ?? $schedule->location,
                'status' => $data['status'] ?? $schedule->status,
                'group_id' => $data['group_id'] ?? $schedule->group_id,
            ]);

            DB::commit();
            return $schedule->fresh(['group', 'participants', 'musics']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a schedule.
     */
    public function delete(Schedule $schedule): bool
    {
        DB::beginTransaction();
        try {
            // Delete all related participants and musics
            $schedule->participants()->delete();
            
            // Delete schedule_musics records properly
            ScheduleMusic::where('schedule_id', $schedule->id)->delete();
            
            $schedule->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Add music to schedule.
     */
    public function addMusic(Schedule $schedule, int $musicId, ?string $customKey = null, ?string $notes = null): ScheduleMusic
    {
        DB::beginTransaction();
        try {
            // Get the highest order number
            $maxOrder = ScheduleMusic::where('schedule_id', $schedule->id)->max('order') ?? 0;

            $scheduleMusic = ScheduleMusic::create([
                'schedule_id' => $schedule->id,
                'music_id' => $musicId,
                'custom_key' => $customKey,
                'order' => $maxOrder + 1,
                'notes' => $notes,
            ]);

            DB::commit();
            return $scheduleMusic->fresh(['music', 'schedule']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update music in schedule.
     */
    public function updateMusic(ScheduleMusic $scheduleMusic, array $data): ScheduleMusic
    {
        DB::beginTransaction();
        try {
            $scheduleMusic->update([
                'custom_key' => $data['custom_key'] ?? $scheduleMusic->custom_key,
                'order' => $data['order'] ?? $scheduleMusic->order,
                'notes' => $data['notes'] ?? $scheduleMusic->notes,
            ]);

            DB::commit();
            return $scheduleMusic->fresh(['music', 'schedule']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove music from schedule.
     */
    public function removeMusic(ScheduleMusic $scheduleMusic): bool
    {
        DB::beginTransaction();
        try {
            $scheduleId = $scheduleMusic->schedule_id;
            $removedOrder = $scheduleMusic->order;

            $scheduleMusic->delete();

            // Reorder remaining musics
            ScheduleMusic::where('schedule_id', $scheduleId)
                ->where('order', '>', $removedOrder)
                ->decrement('order');

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Reorder musics in schedule.
     */
    public function reorderMusics(Schedule $schedule, array $musicIds): void
    {
        DB::beginTransaction();
        try {
            $cases = [];
            $ids = [];
            
            foreach ($musicIds as $index => $musicId) {
                $cases[] = "WHEN music_id = {$musicId} THEN " . ($index + 1);
                $ids[] = $musicId;
            }
            
            if (!empty($cases)) {
                $casesString = implode(' ', $cases);
                $idsString = implode(',', $ids);
                
                DB::update(
                    "UPDATE schedule_musics 
                     SET `order` = CASE {$casesString} END 
                     WHERE schedule_id = ? AND music_id IN ({$idsString})",
                    [$schedule->id]
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Add participant to schedule.
     */
    public function addParticipant(
        Schedule $schedule,
        int $userId,
        ?int $functionId = null,
        string $status = 'convidado',
        ?string $notes = null
    ): ScheduleParticipant {
        DB::beginTransaction();
        try {
            $participant = ScheduleParticipant::create([
                'schedule_id' => $schedule->id,
                'user_id' => $userId,
                'function_id' => $functionId,
                'status' => $status,
                'notes' => $notes,
                'confirmed_at' => $status === 'confirmado' ? now() : null,
            ]);

            DB::commit();
            return $participant->fresh(['user', 'function', 'schedule']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update participant in schedule.
     */
    public function updateParticipant(ScheduleParticipant $participant, array $data): ScheduleParticipant
    {
        DB::beginTransaction();
        try {
            $updateData = [
                'function_id' => $data['function_id'] ?? $participant->function_id,
                'status' => $data['status'] ?? $participant->status,
                'notes' => $data['notes'] ?? $participant->notes,
            ];

            // Set confirmed_at if status changed to confirmado
            if (isset($data['status']) && $data['status'] === 'confirmado' && $participant->status !== 'confirmado') {
                $updateData['confirmed_at'] = now();
            }

            $participant->update($updateData);

            DB::commit();
            return $participant->fresh(['user', 'function', 'schedule']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove participant from schedule.
     */
    public function removeParticipant(ScheduleParticipant $participant): bool
    {
        DB::beginTransaction();
        try {
            $result = $participant->delete();
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get schedule statistics for organization.
     */
    public function getStatistics(int $organizationId): array
    {
        $stats = Schedule::where('organization_id', $organizationId)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status IN ("planejada", "confirmada") AND scheduled_at >= NOW() THEN 1 ELSE 0 END) as upcoming,
                SUM(CASE WHEN status = "concluida" THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = "cancelada" THEN 1 ELSE 0 END) as cancelled
            ')
            ->first();

        return [
            'total' => $stats->total ?? 0,
            'upcoming' => $stats->upcoming ?? 0,
            'completed' => $stats->completed ?? 0,
            'cancelled' => $stats->cancelled ?? 0,
        ];
    }
}
