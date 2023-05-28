<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentsController extends Controller
{
    function getAttachment(Request $request, $attachment){
        if(!$request->hasValidSignature()){
            return $this->json([
                    'success' => false,
                    'status' => 'Url is expired or invalid. Please click the attachment link again'
                ]);
        }

        $path = 'app/public/'.$attachment->path;

        if(!Storage::exists($path)){
            $path = 'app/'.$attachment->path;
        }

        // If image, return the url
        if($attachment->isImage()){
            return response()->file(storage_path($path));
        }

        // Return file download response
        return response()->download(storage_path($path), $attachment->name);
    }

}
