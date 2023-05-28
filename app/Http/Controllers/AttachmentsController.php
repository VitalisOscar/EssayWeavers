<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AttachmentsController extends Controller
{
    function getAttachment(Request $request, $attachment){
        if(!$request->hasValidSignature()){
            return $this->json([
                    'success' => false,
                    'status' => 'Url is expired or invalid. Please click the attachment link again'
                ]);
        }

        // If image, return the url
        if($attachment->isImage()){
            return response()->file(storage_path('app/public/'.$attachment->path));
        }

        // Return file download response
        return response()->download(storage_path('app/public/'.$attachment->path), $attachment->name);
    }

}
