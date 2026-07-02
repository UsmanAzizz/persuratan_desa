<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function getJWTFromRequest($authenticationHeader)
{
    if (is_null($authenticationHeader)) {
        throw new Exception('Missing or invalid JWT in request');
    }
    return explode(' ', $authenticationHeader)[1];
}

function validateJWTFromRequest(string $encodedToken)
{
    // Firebase PHP-JWT v6+ requires key to be at least 32 bytes for HS256
    $key = getenv('JWT_SECRET_KEY') ?: 'kutasari_secure_key_2026_!@#_long_enough_32bytes';
    if (!$key) {
        throw new Exception('JWT_SECRET_KEY is not configured in environment variables');
    }
    
    // Will throw exceptions if invalid/expired
    return JWT::decode($encodedToken, new Key($key, 'HS256'));
}

function getSignedJWTForUser($username, $role, $id)
{
    $key = getenv('JWT_SECRET_KEY') ?: 'kutasari_secure_key_2026_!@#_long_enough_32bytes';
    
    $issuedAtTime = time();
    $tokenTimeToLive = getenv('JWT_TIME_TO_LIVE') ?: 3600; // default 1 hour
    $tokenExpiration = $issuedAtTime + $tokenTimeToLive;

    $payload = [
        'username' => $username,
        'role'     => $role,
        'id'       => $id,
        'iat'      => $issuedAtTime,
        'exp'      => $tokenExpiration,
    ];

    return JWT::encode($payload, $key, 'HS256');
}
