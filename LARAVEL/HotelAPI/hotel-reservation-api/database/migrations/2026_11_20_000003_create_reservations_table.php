<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_code', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->unsignedSmallInteger('guests_count')->default(1);
            $table->unsignedSmallInteger('nights_count');
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending_payment', 'confirmed', 'cancelled', 'completed'])
                  ->default('pending_payment')
                  ->index();
            $table->text('special_requests')->nullable();
            $table->timestamps();

            // Índices compuestos para optimizar consultas de traslape y disponibilidad
            $table->index(['room_id', 'status', 'check_in_date', 'check_out_date'], 'idx_room_res_dates');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
