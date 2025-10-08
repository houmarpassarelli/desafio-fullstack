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
        Schema::create('user_plan_usages', function (Blueprint $table) {
            $table->id()->comment('Auto increment primary key');
            $table->uuid('reference')->unique()->comment('UUID unique identifier for relationships');
            $table->uuid('user_plan_reference')->comment('Foreign key connection with user_plan.reference');
            $table->integer('lot_used')->default(0)->comment('Quantidade de cota que já foi usada');
            $table->integer('storage_used')->default(0)->comment('Quantidade de armazenamento que já foi usado em gigabytes');
            $table->timestamps();

            // Indexes
            $table->index('reference');
            $table->index('user_plan_reference');

            // Foreign Key with CASCADE delete
            $table->foreign('user_plan_reference')
                  ->references('reference')
                  ->on('user_plans')
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
        Schema::dropIfExists('user_plan_usages');
    }
};
