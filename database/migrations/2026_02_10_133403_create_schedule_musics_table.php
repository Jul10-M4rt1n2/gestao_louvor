<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_musics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('music_id')->constrained('musics')->cascadeOnDelete();
            $table->string('custom_key', 5)->nullable(); // Tonalidade customizada para essa escala
            $table->integer('order')->default(0); // Ordem na escala
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['schedule_id', 'music_id']);
            $table->index(['schedule_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_musics');
    }
};
