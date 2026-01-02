<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'profile_image',
        'active',
        'organization_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }

    public function organization(): BelongsTo 
    {
        return $this->belongsTo(Organization::class);
    }

    public function groups(): BelongsToMany 
    {
        return $this->belongsToMany(Group::class, 'user_groups')
        ->withPivot('joined_at', 'active')
        ->withTimestamps();
    }

    public function activeGroups(): BelongsToMany 
    {
        return $this->groups()->wherePivot('active', true);
    }

    public function functions(): BelongsToMany 
    {
        return $this->belongsToMany(MinistryFunction::class, 'user_functions', 'user_id', 'function_id')
        ->withPivot('group_id', 'active')
        ->withTimestamps();
    }

    public function activeFunctions(): BelongsToMany 
    {
        return $this->functions()->wherePivot('active', true);
    }
}
