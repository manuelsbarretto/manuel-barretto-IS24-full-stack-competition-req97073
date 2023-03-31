<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(Request $request): array
    {
        if($request->route('product')) {

            return [
                "productName" => "required|string",
                "productOwnerName" => "required|string",
                "developers" => "required|string",
                "scrumMasterName" => "required|string",
                "methodology" => "required|string",
            ];

        } else {

            return [
                "productName" => "required|string",
                "productOwnerName" => "required|string",
                "developers" => "required|string",
                "scrumMasterName" => "required|string",
                "startDate" => "required|date",
                "methodology" => "required|string",
            ];

        }

    }
}
