<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vocabulary extends Model
{
    protected $fillable = [
        'word',
        'meaning',
        'user_id',
        'notification_date',
        'notified_at',
        'test_notification_date'
    ];
}
