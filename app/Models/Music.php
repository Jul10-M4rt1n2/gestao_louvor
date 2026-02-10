<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Music extends Model
{
    use HasFactory;

    protected $table = 'musics';

    protected $fillable = [
        'title',
        'artist',
        'genre',
        'original_key',
        'bpm',
        'lyrics',
        'chords_text',
        'file_path',
        'file_type',
        'notes',
        'active',
        'organization_id',
        'created_by',
    ];

    protected $casts = [
        'active' => 'boolean',
        'bpm' => 'integer',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function schedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class, 'schedule_musics')
            ->withPivot('custom_key', 'order', 'notes')
            ->withTimestamps()
            ->orderBy('schedule_musics.order');
    }
}
