<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class ReservationConfirmation
 * 
 * Modela el comprobante y voucher oficial de confirmación de una reserva.
 */
class ReservationConfirmation extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_CHECKED_IN = 'checked_in';

    protected $fillable = [
        'reservation_id',
        'confirmation_code',
        'verification_hash',
        'qr_payload',
        'issued_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    /**
     * Una confirmación pertenece a una reserva.
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
