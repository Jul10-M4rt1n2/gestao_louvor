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
        Schema::create('functions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Vocal, Guitarra, Bateria, Mídia, etc.
            $table->string('slug')->unique(); // vocal, guitarra, bateria, midia
            $table->text('description')->nullable();
            $table->string('icon')->nullable(); // Para UI: mic, guitar, drums, video
            $table->string('category')->default('music'); // music, tech, support
            $table->boolean('active')->default(true);
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            // Índices para performance
            $table->index(['organization_id', 'active']);
            $table->index(['category', 'active']);
            $table->unique(['organization_id', 'slug']); // slug único por organização
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('functions');
    }
};
