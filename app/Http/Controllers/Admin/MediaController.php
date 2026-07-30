<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController
{
    public function upload(Request $request)
    {
        abort_unless($request->user() && ($request->user()->isAdmin() || $request->user()->isManager()), 403);

        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB max
        ]);

        $file = $request->file('image');
        $extension = $file->extension();
        $filename = Str::random(40).'.'.$extension;

        $path = $file->storeAs('editor/'.date('Y/m'), $filename, 'public');

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
