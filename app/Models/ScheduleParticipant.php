<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'user_id',
        'function_id',
        'status',
        'notes',
        'confirmed_at',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
    ];

    // Relacionamentos
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function function(): BelongsTo
    {
        return $this->belongsTo(MinistryFunction::class, 'function_id');
    }

    // Scopes úteis
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmado');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'convidado');
    }
}
