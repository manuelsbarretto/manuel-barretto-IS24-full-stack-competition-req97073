<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function healthCheck() {

        return response()->json([
            'message' => 'Checking Health'
        ], http_response_code()); 

    }
}
