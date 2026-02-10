<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ministry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'active',
        'organization_id',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }

    public function ministryFunctions(): HasMany
    {
        return $this->hasMany(MinistryFunction::class);
    }
}
