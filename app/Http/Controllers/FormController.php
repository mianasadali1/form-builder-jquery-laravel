<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormData;

class FormController extends Controller
{
    public function store(Request $request)
    {
        // Check if any FormData entry exists
        $existingFormData = FormData::first();

        if ($existingFormData) {
            // Update the existing FormData entry
            $existingFormData->form_data = $request->all(); // Update form data directly, without validation
            $existingFormData->save();

            // Return a JSON response for successful update
            return response()->json(['success' => true, 'message' => 'Form data updated successfully!']);
        } else {
            // Store the form data
            $formData = new FormData();
            $formData->form_data = $request->all(); // Save the validated form data

            $formData->save();

            // Return a JSON response for successful creation
            return response()->json(['success' => true, 'message' => 'Form data saved successfully!']);
        }
    }

    public function getForm(Request $request) {
        // Check if any FormData entry exists
        $existingFormData = FormData::first();

        // Initialize form data variable
        $formData = [];

        if ($existingFormData) {
            // If FormData exists, assign form data to the variable
            $formData = $existingFormData->form_data;
        }

        // Pass form data (existing or empty) to the view
        return view('form-builder', ['formData' => $formData]);
    }
}