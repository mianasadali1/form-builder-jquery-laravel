<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormData extends Model
{
    protected $fillable = [
        'form_data'
    ];

    protected $casts = [
        'form_data' => 'array', // Cast the form_data column to an array
    ];
}