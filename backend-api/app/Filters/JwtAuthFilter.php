<?php

namespace App\Filters;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use App\Models\JwtBlacklistModel;
use Exception;

class JwtAuthFilter implements FilterInterface
{
    use ResponseTrait;

    public function before(RequestInterface $request, $arguments = null)
    {
        $authenticationHeader = $request->getServer('HTTP_AUTHORIZATION');

        try {
            helper('jwt');
            $encodedToken = getJWTFromRequest($authenticationHeader);
            
            // Check if token is blacklisted
            $blacklistModel = new JwtBlacklistModel();
            $isBlacklisted = $blacklistModel->where('token', $encodedToken)->first();
            
            if ($isBlacklisted) {
                throw new Exception('Token is invalid (Logged out)');
            }

            validateJWTFromRequest($encodedToken);
            
            return $request;
        } catch (Exception $e) {
            $response = Services::response();
            return $response
                ->setJSON([
                    'success' => false,
                    'message' => 'Unauthorized Access: ' . $e->getMessage(),
                    'errors'  => null
                ])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing here
    }
}
