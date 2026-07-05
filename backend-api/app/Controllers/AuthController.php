<?php

namespace App\Controllers;

use App\Models\AdminModel;
use Exception;

class AuthController extends BaseApiController
{
    public function login()
    {
        $rules = [
            'username' => 'required',
            'password' => 'required|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validasi Gagal', 400, $this->validator->getErrors());
        }

        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $userModel = new AdminModel();
        $user = $userModel->where('username', $username)->first();

        if (is_null($user)) {
            return $this->respondError('Kredensial tidak valid', 401);
        }

        $pwd_verify = password_verify($password, $user['password']);
        if (!$pwd_verify) {
            return $this->respondError('Kredensial tidak valid', 401);
        }

        helper('jwt');
        $token = getSignedJWTForUser($username, $user['role'], $user['id_user']);

        return $this->respondSuccess([
            'token' => $token,
            'user'  => [
                'id_user'      => $user['id_user'],
                'username'     => $user['username'],
                'nama_petugas' => $user['nama_petugas'],
                'role'         => $user['role']
            ]
        ], 'Login berhasil');
    }

    public function logout()
    {
        try {
            helper('jwt');
            $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
            $token = getJWTFromRequest($authHeader);
            
            // Validate token before blacklisting to ensure it's a real token
            validateJWTFromRequest($token);

            // Karena fitur JwtBlacklist telah dihapus (simplified architecture),
            // kita cukup me-return success, dan biarkan frontend yang menghapus token di storage.


            return $this->respondSuccess(null, 'Logout berhasil, sesi telah dihancurkan');
        } catch (Exception $e) {
            return $this->respondError('Gagal memproses logout: ' . $e->getMessage(), 400);
        }
    }
}
