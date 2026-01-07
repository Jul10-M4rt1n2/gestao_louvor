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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // "Culto Domingo 05/01", "Ensaio Quarta 08/01"
            $table->string('type'); // 'culto', 'ensaio', 'evento_especial'
            $table->text('description')->nullable();
            $table->datetime('scheduled_at'); // Data e hora do evento
            $table->time('duration')->nullable(); // Duração estimada
            $table->string('location')->nullable(); // Local (igreja, salão, etc.)
            $table->enum('status', ['planejada', 'confirmada', 'em_andamento', 'concluida', 'cancelada'])->default('planejada');
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // Índices para performance
            $table->index(['group_id', 'scheduled_at']);
            $table->index(['organization_id', 'status']);
            $table->index(['scheduled_at', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
