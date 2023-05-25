<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\DB;

abstract class Service{

    function run(){
        try{
            DB::beginTransaction();
            $result = $this->execute();
            DB::commit();
            return $result;

        }catch(Exception $e){
            DB::rollBack();
            return $e;
        }
    }

    abstract protected function execute();

}
