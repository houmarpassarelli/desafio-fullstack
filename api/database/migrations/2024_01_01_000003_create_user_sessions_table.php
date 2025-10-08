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
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id()->comment('Auto increment primary key');
            $table->uuid('reference')->unique()->comment('UUID unique identifier for relationships');
            $table->uuid('user_reference')->comment('Foreign key connection with user.reference');
            $table->text('refresh_token')->comment('JWT refresh token');
            $table->timestamps();

            // Indexes
            $table->index('reference');
            $table->index('user_reference');

            // Foreign Key with CASCADE delete
            $table->foreign('user_reference')
                  ->references('reference')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_sessions');
    }
};
