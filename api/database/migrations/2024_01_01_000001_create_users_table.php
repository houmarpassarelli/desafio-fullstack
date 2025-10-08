<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id()->comment('Auto increment primary key');
            $table->uuid('reference')->unique()->comment('UUID unique identifier for relationships');
            $table->string('name')->comment('User full name');
            $table->string('avatar')->nullable()->comment('User avatar image path');
            $table->string('email')->unique()->comment('User email address');
            $table->string('role')->comment('user para usuário comum e super para administração');
            $table->boolean('active')->default(true)->comment('User account status');
            $table->timestamps();

            // Indexes
            $table->index('reference');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
