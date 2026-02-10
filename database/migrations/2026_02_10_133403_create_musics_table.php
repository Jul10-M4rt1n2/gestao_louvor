<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('musics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('artist')->nullable();
            $table->string('genre')->nullable();
            $table->string('original_key', 5)->nullable(); // C, Dm, G#, etc.
            $table->integer('bpm')->nullable();
            $table->longText('lyrics')->nullable(); // Letra com cifras integradas
            $table->longText('chords_text')->nullable(); // Somente acordes
            $table->string('file_path')->nullable(); // Caminho do arquivo PDF/DOCX original
            $table->string('file_type', 10)->nullable(); // pdf, docx
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true);
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            
            $table->index(['organization_id', 'active']);
            $table->index(['artist']);
            $table->index(['genre']);
            $table->index(['original_key']);
            
            // Full-text search only for MySQL/MariaDB
            if (DB::getDriverName() === 'mysql') {
                $table->fullText(['title', 'artist', 'genre']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('musics');
    }
};
