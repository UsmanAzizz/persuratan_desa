<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BaseApiController extends ResourceController
{
    /**
     * Format balasan standar (Success)
     */
    protected function respondSuccess($data = null, string $message = 'Success')
    {
        return $this->respond([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ]);
    }

    /**
     * Format balasan standar (Error)
     */
    protected function respondError(string $message = 'Error', int $statusCode = 400, $errors = null)
    {
        return $this->respond([
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ], $statusCode);
    }
}
