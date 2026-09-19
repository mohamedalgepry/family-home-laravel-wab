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
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'], // 5MB max
        ]);

        $file = $request->file('image');
        $extension = $file->guessExtension() ?: $file->extension();
        $filename = Str::random(40).'.'.$extension;

        try {
            $path = $file->storeAs('editor/'.date('Y/m'), $filename, 'public');

            if (! $path) {
                return response()->json([
                    'error' => __('common.upload_failed'),
                ], 422);
            }

            return response()->json([
                'url' => Storage::url($path),
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Media upload failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()?->id,
            ]);

            return response()->json([
                'error' => __('common.upload_failed'),
            ], 500);
        }
    }
}
