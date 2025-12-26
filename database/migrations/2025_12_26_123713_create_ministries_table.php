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
        Schema::create('ministries', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Louvor, Mídia, Áudio, Transmissão
            $table->string('slug')->unique(); // louvor, midia, audio, transmissao
            $table->text('description')->nullable();
            $table->string('icon')->nullable(); // Para UI: music, video, mic, broadcast
            $table->string('color', 7)->default('#3B82F6'); // Cor hex para UI
            $table->boolean('active')->default(true);
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            // Índices para performance
            $table->index(['organization_id', 'active']);
            $table->unique(['organization_id', 'slug']); // slug único por organização
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ministries');
    }
};
