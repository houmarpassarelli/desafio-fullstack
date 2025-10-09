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
        Schema::table('user_plans', function (Blueprint $table) {
            $table->string('exchange_type', 20)
                  ->default('contract')
                  ->comment('Tipo de operação: contract (nova contratação) ou change (troca de plano)')
                  ->after('active');

            // Adicionar index para performance
            $table->index('exchange_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            $table->dropIndex(['exchange_type']);
            $table->dropColumn('exchange_type');
        });
    }
};
