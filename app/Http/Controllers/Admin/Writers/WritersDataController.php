<?php

namespace App\Http\Controllers\Admin\Writers;

use App\Http\Controllers\Controller;
use App\Models\Writer;
use Illuminate\Http\Request;

class WritersDataController extends Controller
{
    function listWriters(Request $request){
        $data = Writer::with(['earnings', 'payouts'])->get()->map(function (Writer $writer) use($request){
            if($request->get('raw')){
                return $writer;
            }

            $writerArray = $writer->toArray();

            if(!$writer->isActive()){
                $writerArray['name'] .= ' (Inactive)';
            }

            return $writerArray;
        });

        if($request->get('raw')){
            return $data;
        }

        return $this->json($data);
    }
}
