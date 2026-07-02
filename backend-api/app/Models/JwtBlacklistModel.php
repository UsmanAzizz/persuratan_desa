<?php

namespace App\Models;

use CodeIgniter\Model;

class JwtBlacklistModel extends Model
{
    protected $table            = 'jwt_blacklist';
    protected $primaryKey       = 'id_blacklist';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['token', 'blacklisted_at'];
}
