<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Users\Services\ProfileService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profileService,
    ) {}

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
        $this->profileService->updateProfileWithAvatar(
            $request->user(),
            $request->validated(),
            $request->file('avatar'),
        );

        return back()->with('success', __('common.updated_successfully'));
    }

    public function sendEmailOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'new_email' => 'required|email|max:255',
        ]);

        $this->profileService->sendEmailChangeOtp(
            $request->user(),
            $request->input('new_email'),
            app()->getLocale()
        );

        return back()->with('success', __('auth.otp_sent'));
    }

    public function verifyEmailOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'new_email' => 'required|email|max:255',
            'code' => 'required|string|size:6',
        ]);

        $this->profileService->verifyAndChangeEmail(
            $request->user(),
            $request->input('new_email'),
            $request->input('code')
        );

        return back()->with('success', __('auth.email_updated_successfully'));
    }
}
