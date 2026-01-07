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
        Schema::create('schedule_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('function_id')->constrained('ministry_functions')->cascadeOnDelete();
            $table->enum('status', ['convidado', 'confirmado', 'rejeitado', 'ausente'])->default('convidado');
            $table->text('notes')->nullable(); // Observações específicas
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();

            // Índices para performance
            $table->index(['schedule_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->unique(['schedule_id', 'user_id', 'function_id']); // Evita duplicatas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_participants');
    }
};
