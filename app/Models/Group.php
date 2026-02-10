<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'schedule_frequency',
        'active',
        'ministry_id',
    ];

    protected $casts = [
        'active' => 'boolean',
        'meeting_days' => 'json'
    ];

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_groups')
            ->withPivot('joined_at', 'active')
            ->withTimestamps();
    }

    public function activeFunctions(): BelongsToMany
    {
        return $this->belongsToMany(MinistryFunction::class, 'user_functions', 'group_id', 'function_id')
            ->withPivot('user_id', 'active')
            ->wherePivot('active', true);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }
}
