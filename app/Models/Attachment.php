<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;

class Attachment extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['url'];

    protected $hidden = ['path'];


    // RELATIONS
    function parent(){
        return $this->morphTo();
    }


    // ACCESSORS
    public function getUrlAttribute(){
        return URL::temporarySignedRoute('download_attachment', now()->addHours(1), [
            'attachment' => $this->id
        ]);
    }

    function getExtensionAttribute(){
        return pathinfo($this->path, PATHINFO_EXTENSION);
    }


    // Helpers
    function isImage(){
        return strtolower(explode('/', $this->type)[0]) == 'image';
    }

    function isPdf(){
        return !$this->isImage() && $this->extension == 'pdf';
    }

    function isWordDoc(){
        return !$this->isImage() && ($this->extension == 'docx' || $this->extension == 'doc');
    }

    function isZip(){
        return !$this->isImage() && $this->extension == 'zip';
    }


    function toArray(){
        return [
            'id' => $this->id,
            'url' => $this->url,
            'name' => $this->name,
            'type' => $this->type
        ];
    }
}
