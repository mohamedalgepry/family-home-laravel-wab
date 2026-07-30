<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Users\Services\ProfileService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Requests\Auth\UploadAvatarRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

    public function edit(): Response
    {
        return Inertia::render('Shared/Profile');
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $this->profileService->updateProfile(
            $request->user(),
            $request->input('name'),
            $request->input('phone'),
            $request->input('whatsapp'),
            $request->input('facebook'),
        );

        return back()->with('success', __('auth.profile_updated'));
    }

    public function changePassword(ChangePasswordRequest $request): RedirectResponse
    {
        $this->profileService->changePassword(
            $request->user(),
            $request->input('current_password'),
            $request->input('password'),
        );

        return back()->with('success', __('auth.password_changed'));
    }

    public function uploadAvatar(UploadAvatarRequest $request): RedirectResponse
    {
        $this->profileService->uploadAvatar(
            $request->user(),
            $request->file('avatar'),
        );

        return back()->with('success', __('auth.profile_updated'));
    }
}
