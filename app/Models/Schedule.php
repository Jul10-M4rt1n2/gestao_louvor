<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
        'scheduled_at',
        'duration',
        'location',
        'status',
        'group_id',
        'organization_id',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'duration' => 'datetime:H:i:s',
        'confirmed_at' => 'datetime',
    ];

    // Relacionamentos
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ScheduleParticipant::class);
    }

    public function confirmedParticipants(): HasMany
    {
        return $this->participants()->where('status', 'confirmado');
    }

    public function musics(): BelongsToMany
    {
        return $this->belongsToMany(Music::class, 'schedule_musics')
            ->withPivot('custom_key', 'order', 'notes')
            ->withTimestamps()
            ->orderBy('schedule_musics.order');
    }
}
