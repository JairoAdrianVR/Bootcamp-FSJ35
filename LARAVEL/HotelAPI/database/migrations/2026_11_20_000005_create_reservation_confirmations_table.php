<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete();
            $table->string('confirmation_code', 40)->unique();
            $table->string('verification_hash', 64);
            $table->string('qr_payload', 255);
            $table->timestamp('issued_at');
            $table->enum('status', ['active', 'cancelled', 'checked_in'])->default('active')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_confirmations');
    }
};
