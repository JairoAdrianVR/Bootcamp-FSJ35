<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'payment_reference',
        'reservation_id',
        'amount',
        'currency',
        'payment_method',
        'status',
        'gateway_transaction_id',
        'paid_at',
        'payment_details',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'payment_details' => 'array',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
