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
        Schema::rename('functions', 'ministry_functions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('ministry_functions', 'functions');
    }
};
