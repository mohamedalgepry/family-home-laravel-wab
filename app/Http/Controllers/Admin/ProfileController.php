<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user()->loadMissing('profile');

        return Inertia::render('Admin/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->profile?->avatar,
                'phone' => $user->profile?->phone,
                'whatsapp' => $user->profile?->whatsapp,
                'facebook' => $user->profile?->facebook,
                'linkedin' => $user->profile?->linkedin,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validated();

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $userData = collect($data)->only(['name', 'email', 'password'])->toArray();
        $profileData = collect($data)->only(['phone', 'whatsapp', 'facebook', 'linkedin'])->toArray();

        if ($request->hasFile('avatar')) {
            if ($user->profile?->avatar) {
                Storage::disk('public')->delete($user->profile->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $profileData['avatar'] = $path;
        }

        $user->update($userData);
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        return redirect()->back()->with('success', __('messages.updated_successfully'));
    }
}
