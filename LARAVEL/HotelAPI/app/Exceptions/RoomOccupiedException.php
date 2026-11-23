<?php

namespace App\Exceptions;

use RuntimeException;

class RoomOccupiedException extends RuntimeException
{
    protected $message = 'Habitación ocupada en la fecha requerida.';
}
