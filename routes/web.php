<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Group\GroupController;
use App\Http\Controllers\Group\MemberController;
use App\Http\Controllers\Music\MusicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Scale\ScaleController;
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
    
    // Group routes
    Route::resource('groups', GroupController::class);
    Route::post('/groups/{group}/members', [MemberController::class, 'store'])->name('groups.members.store');
    Route::put('/groups/{group}/members/{userId}', [MemberController::class, 'update'])->name('groups.members.update');
    Route::delete('/groups/{group}/members/{userId}', [MemberController::class, 'destroy'])->name('groups.members.destroy');
    
    // Scale routes
    Route::get('/scales/week', [ScaleController::class, 'week'])->name('scales.week');
    Route::resource('scales', ScaleController::class);
    Route::post('/scales/{schedule}/music', [ScaleController::class, 'addMusic'])->name('scales.music.add');
    Route::put('/scales/{schedule}/music/{scheduleMusic}', [ScaleController::class, 'updateMusic'])->name('scales.music.update');
    Route::delete('/scales/{schedule}/music/{scheduleMusic}', [ScaleController::class, 'removeMusic'])->name('scales.music.remove');
    Route::post('/scales/{schedule}/participants', [ScaleController::class, 'addParticipant'])->name('scales.participants.add');
    Route::put('/scales/{schedule}/participants/{participant}', [ScaleController::class, 'updateParticipant'])->name('scales.participants.update');
    Route::delete('/scales/{schedule}/participants/{participant}', [ScaleController::class, 'removeParticipant'])->name('scales.participants.remove');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});

// Public route
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');
