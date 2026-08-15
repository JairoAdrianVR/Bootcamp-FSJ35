<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //le decimos el nombre de la tabla
    protected $table = 'productos';
   // select * from productos; -> all()

    public $timestamps = false;

    //le decimos cuales son las columnas con las que vamos a trabajar
    protected $fillable = [
        'nombre',
        'precio',
        'descuento',
        'cantidad'
    ];
}
