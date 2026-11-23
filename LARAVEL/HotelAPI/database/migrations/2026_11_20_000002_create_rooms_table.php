<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('room_number', 20);
            $table->enum('type', ['single', 'double', 'suite', 'deluxe'])->default('single')->index();
            $table->unsignedSmallInteger('capacity')->default(1)->index();
            $table->decimal('price_per_night', 10, 2)->index();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'maintenance', 'inactive'])->default('available')->index();
            $table->timestamps();

            $table->unique(['hotel_id', 'room_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
