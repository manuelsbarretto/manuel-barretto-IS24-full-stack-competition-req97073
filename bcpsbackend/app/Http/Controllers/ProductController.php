<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = json_decode(Storage::disk('local')->get('products.json'), true);

        if($request->has('developers')) {
            $products = $this->searchFor($request->developers, 'developers', $products);
        } 
        
        if ($request->has('scrummastername')) {
            $products = $this->searchFor($request->scrummastername, 'scrumMasterName', $products);
        }

        return response()->json([
            'status' => 'Success',
            'message' => 'Products Fetched',
            'products' => array_reverse($products)
        ], http_response_code()); 
    }

    // Function to search dataset
    public function searchFor($searchItem, $searchField, $data, $strict=false) {
        $filteredData = [];
        foreach ($data as $key => $val) { 
            $searchValue = $val[$searchField];
            if(gettype($val[$searchField]) == 'array') {
                $searchValue = implode(',', $val[$searchField]);
            } elseif (!in_array(gettype($val[$searchField]), ["string", "integer"])) {
                continue;
            }
            if($strict) {
                if (strtolower($searchValue) === strtolower($searchItem)) {
                    array_push($filteredData, $val);
                }
            } else {
                if(str_contains(strtolower($searchValue), strtolower($searchItem))) {
                    array_push($filteredData, $val);
                }
            }
            
        }
        return $filteredData;
    }

    // Function to find key of first item from dataset that matches paramaters
    public function getKey($searchItem, $searchField, $data, $strict=false) {

        foreach ($data as $key => $val) { 
            $searchValue = $val[$searchField];
            if(gettype($val[$searchField]) == 'array') {
                $searchValue = implode(',', $val[$searchField]);
            } elseif (!in_array(gettype($val[$searchField]), ["string", "integer"])) {
                continue;
            }
            if($strict) {
                if (strtolower($searchValue) === strtolower($searchItem)) {
                    return $key;
                }
            } else {
                if(str_contains(strtolower($searchValue), strtolower($searchItem))) {
                    return $key;
                }
            }
            
        }

        return null;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        // Get dataset from JSON.
        $products = json_decode(Storage::disk('local')->get('products.json'), true);

        // Get the last entry from array
        $lastProduct = end($products);
        
        // Create new product array along with productId. Also convert developers string to array.
        $product = ['productId' => $lastProduct['productId'] + 1] + $request->all();
        $product['developers'] = explode(",", preg_replace('/\s+/', '', $product['developers']));

        // Push new product to products array.
        array_push($products, $product);
        
        // Save dataset to JSON.
        Storage::disk('local')->put('products.json', json_encode($products));

        return response()->json([
            'status' => 'Success',
            'message' => 'Product Added',
            'products' => array_reverse($products)
        ], http_response_code()); 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Get dataset from JSON.
        $products = json_decode(Storage::disk('local')->get('products.json'), true);

        // Get Product from dataset
        $product = $this->searchFor($id, 'productId', $products, true);
        
        // If product does not exists
        if(!count($product)) {
            return response()->json([
                'status' => 'Failed',
                'message' => 'Product Not Found'
            ], http_response_code()); 
        } else {
            // Send response with product
            return response()->json([
                'status' => 'Success',
                'message' => 'Product Retrieved',
                'product' => $product[0]
            ], http_response_code()); 
        }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        // Get dataset from JSON.
        $products = json_decode(Storage::disk('local')->get('products.json'), true);

        // Get Product key from dataset
        $product_key = $this->getKey($id, 'productId', $products, true);

        // Checking if key exists
        if(!$product_key) {
            return response()->json([
                'status' => 'Failed',
                'message' => 'Product Not Found',
                'products' => $products
            ], http_response_code()); 
        }
        
        // Updating values for product in dataset
        $products[$product_key] = array_replace($products[$product_key], $request->all());
        $products[$product_key]['developers'] = explode(",", preg_replace('/\s+/', '', $products[$product_key]['developers']));

        // Save dataset to JSON.
        Storage::disk('local')->put('products.json', json_encode($products));

        return response()->json([
            'status' => 'Success',
            'message' => 'Product Edited',
            'products' => array_reverse($products)
        ], http_response_code()); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Get dataset from JSON.
        $products = json_decode(Storage::disk('local')->get('products.json'), true);

        // Get Product key from dataset
        $product_key = $this->getKey($id, 'productId', $products, true);

        // Checking if key exists
        if(!$product_key) {
            return response()->json([
                'status' => 'Failed',
                'message' => 'Product Not Found'
            ], http_response_code()); 
        }
        
        // Deleting key from products dataset
        unset($products[$product_key]);

        // Save dataset to JSON.
        Storage::disk('local')->put('products.json', json_encode($products));

        return response()->json([
            'status' => 'Success',
            'message' => 'Product Deleted'
        ], http_response_code()); 
    }
}
