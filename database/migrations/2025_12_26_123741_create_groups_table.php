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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Grupo Louvor 1, Mídia Domingo, etc.
            $table->string('slug')->unique(); // grupo-louvor-1, midia-domingo
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->json('meeting_days')->nullable(); // [0, 6] = domingo e sábado
            $table->time('meeting_time')->nullable(); // Horário padrão dos encontros
            $table->foreignId('ministry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // Índices para performance
            $table->index(['ministry_id', 'active']);
            $table->index(['organization_id', 'active']);
            $table->unique(['organization_id', 'slug']); // slug único por organização
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
