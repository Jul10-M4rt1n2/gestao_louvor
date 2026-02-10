<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Music\MusicController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes (unauthenticated users)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
    
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    // Music routes
    Route::resource('music', MusicController::class);
    Route::get('/music/search', [MusicController::class, 'search'])->name('music.search');
    Route::post('/music/{music}/transpose', [MusicController::class, 'transpose'])->name('music.transpose');
});

// Public route
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');
