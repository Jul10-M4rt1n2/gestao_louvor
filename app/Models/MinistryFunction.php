<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MinistryFunction extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'ministry_id'
    ];

    public function ministry(): BelongsTo 
    {
        return $this->belongsTo(Ministry::class);
    }

    public function users(): BelongsToMany 
    {
        return $this->belongsToMany(User::class, 'user_functions')
        ->withPivot('group_id', 'active')
        ->withTimestamps();
    }
}
