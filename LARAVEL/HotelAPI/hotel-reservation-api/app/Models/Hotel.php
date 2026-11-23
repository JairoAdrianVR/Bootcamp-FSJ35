<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Hotel
 * 
 * Representa la entidad Hotel donde se alojan las habitaciones.
 */
class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'country',
        'phone',
        'email',
        'star_rating',
        'is_active',
    ];

    protected $casts = [
        'star_rating' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Un hotel tiene muchas habitaciones.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}
