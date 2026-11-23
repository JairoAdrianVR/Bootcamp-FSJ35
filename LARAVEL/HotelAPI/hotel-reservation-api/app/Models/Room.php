<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Room (Habitación)
 * 
 * Representa una habitación perteneciente a un hotel.
 */
class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'room_number',
        'type', // 'single', 'double', 'suite', 'deluxe'
        'capacity',
        'price_per_night',
        'description',
        'status', // 'available', 'maintenance', 'inactive'
    ];

    protected $casts = [
        'capacity' => 'integer',
        'price_per_night' => 'float',
    ];

    /**
     * Una habitación pertenece a un hotel.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    /**
     * Una habitación puede tener múltiples reservas en el tiempo.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
