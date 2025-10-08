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
        Schema::create('plans', function (Blueprint $table) {
            $table->id()->comment('Auto increment primary key');
            $table->uuid('reference')->unique()->comment('UUID unique identifier for relationships');
            $table->uuid('original_plan')->nullable()->comment('Se for plano anual, vai referenciar aqui o equivalente ao plano mensal');
            $table->string('label')->comment('Plan display name');
            $table->string('price')->comment('Plan price value');
            $table->string('type')->comment('Vai dizer se o tipo de plano é mensal (monthly) ou anual (yearly)');
            $table->decimal('percentage_discount', 5, 2)->nullable()->comment('Desconto percentual se o plano for anual');
            $table->integer('storage')->comment('Quantidade de armazenamento de gigabyte');
            $table->integer('lot')->comment('Quantidade de cota de gravação de arquivos');
            $table->timestamps();

            // Indexes
            $table->index('reference');
            $table->index('original_plan');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plans');
    }
};
