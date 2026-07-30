<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    public $timestamps = false;

    protected $fillable = ['key', 'value'];

    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = self::find($key);

        return $setting ? $setting->value : $default;
    }
}
