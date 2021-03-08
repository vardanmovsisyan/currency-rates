<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToConversionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('to_conversions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("currency_id");
            $table->unsignedBigInteger("from_conversion_id");
            $table->decimal("amount");
            $table->timestamps();

            $table->foreign('from_conversion_id', 'from_to_conversions_fk')->references('id')->on('from_conversions')->onDelete('cascade');
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('to_conversions');
    }
}
