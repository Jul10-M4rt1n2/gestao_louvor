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
        Schema::create('user_functions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('function_id')->constrained('ministry_functions')->cascadeOnDelete();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'function_id', 'group_id']); // Evita duplicatas exatas

            $table->index(['group_id', 'function_id', 'active']); // Para consultas rápidas de funções ativas por grupo
            $table->index(['user_id', 'active']); // Para consultas rápidas das funções ativas de um usuário
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_functions');
    }
};
