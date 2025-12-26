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
        Schema::create('user_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->timestamp('joined_at')->useCurrent();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'group_id']); // Um usuário não pode estar no mesmo grupo mais de uma vez

            $table->index(['group_id', 'active']);// Para consultas rápidas de membros ativos por grupo
            $table->index(['user_id', 'active']);// Para consultas rápidas dos grupos ativos de um usuário
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_groups');
    }
};
