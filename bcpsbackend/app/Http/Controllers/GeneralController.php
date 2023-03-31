<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function healthCheck() {

        return response()->json([
            'status' => 'Success',
            'message' => 'Checking Health'
        ], http_response_code()); 

    }

    public function apiDocs() {
        return view('swagger.index');
    }
}
