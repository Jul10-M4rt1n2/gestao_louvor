<?php

namespace App\Providers;

use App\Models\Group;
use App\Models\Music;
use App\Models\Schedule;
use App\Policies\GroupPolicy;
use App\Policies\MusicPolicy;
use App\Policies\ScalePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(Music::class, MusicPolicy::class);
        Gate::policy(Group::class, GroupPolicy::class);
        Gate::policy(Schedule::class, ScalePolicy::class);
    }
}
