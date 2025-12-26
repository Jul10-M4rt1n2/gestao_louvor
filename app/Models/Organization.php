<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function users():HasMany
    {
        return $this->hasMany(User::class);
    }

    public function ministries(): HasMany
    {
        return $this->hasMany(Ministry::class);
    }
}
