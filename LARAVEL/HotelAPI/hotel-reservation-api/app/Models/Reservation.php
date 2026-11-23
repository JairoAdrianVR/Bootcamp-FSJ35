<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class Reservation (Reserva)
 * 
 * Modela la reservación de una habitación por parte de un cliente.
 */
class Reservation extends Model
{
    use HasFactory;

    // Estados de reserva
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'reservation_code',
        'user_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'guests_count',
        'nights_count',
        'price_per_night',
        'total_amount',
        'status',
        'special_requests',
    ];

    protected $casts = [
        'check_in_date' => 'date:Y-m-d',
        'check_out_date' => 'date:Y-m-d',
        'guests_count' => 'integer',
        'nights_count' => 'integer',
        'price_per_night' => 'float',
        'total_amount' => 'float',
    ];

    /**
     * Una reserva pertenece a un cliente/usuario.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Una reserva corresponde a una habitación.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Una reserva tiene un pago asociado (o histórico de pagos).
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Helper para verificar si está confirmada.
     */
    public function isConfirmed(): bool
    {
        return $this->status === self::STATUS_CONFIRMED;
    }
}
