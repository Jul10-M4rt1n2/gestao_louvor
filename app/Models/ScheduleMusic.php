<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleMusic extends Model
{
    use HasFactory;

    protected $table = 'schedule_musics';

    protected $fillable = [
        'schedule_id',
        'music_id',
        'custom_key',
        'order',
        'notes',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function music(): BelongsTo
    {
        return $this->belongsTo(Music::class);
    }
}
