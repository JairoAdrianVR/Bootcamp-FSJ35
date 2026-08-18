<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Producto extends Model
{
    //le decimos el nombre de la tabla
    protected $table = 'productos';
   // select * from productos; -> all()

   // desactivamos el created_at y updated_ad
    public $timestamps = false;

    //le decimos cuales son las columnas con las que vamos a trabajar
    protected $fillable = [
        'nombre',
        'precio',
        'descuento',
        'cantidad'
    ];

    public static function resetAutoincrement(){
        DB::statement("ALTER TABLE productos AUTO_INCREMENT = 1");
    }
}
