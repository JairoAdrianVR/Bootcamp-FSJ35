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
        //Schema -> Representa nuestra BD
        // create -> metodo que ejecutamos en la BD
        // a create le damos el nombre de tabla y los campos (es una funcion que utiliza blueprint)
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title',100);
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
