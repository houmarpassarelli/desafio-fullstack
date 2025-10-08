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
        Schema::create('user_plans', function (Blueprint $table) {
            $table->id()->comment('Auto increment primary key');
            $table->uuid('reference')->unique()->comment('UUID unique identifier for relationships');
            $table->uuid('user_reference')->comment('Foreign key connection with user.reference');
            $table->uuid('plan_reference')->comment('Foreign key connection with plan.reference');
            $table->timestamp('expires_in')->comment('Data de expiração do plano');
            $table->json('meta_data')->comment('Grava um json com informações do plano baseado no momento em que ele foi adquirido, garantindo assim que se o plano mudar na tabela plan, mantenha a informação contratada pelo usuário');
            $table->boolean('active')->default(true)->comment('Se ativo é o plano atual');
            $table->timestamps();

            // Indexes
            $table->index('reference');
            $table->index('user_reference');
            $table->index('plan_reference');

            // Foreign Keys
            $table->foreign('user_reference')
                  ->references('reference')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('plan_reference')
                  ->references('reference')
                  ->on('plans')
                  ->onDelete('restrict')
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
        Schema::dropIfExists('user_plans');
    }
};
