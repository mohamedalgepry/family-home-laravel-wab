<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    public function show(int $id, Request $request): Response
    {
        $agent = User::with('profile')->where('is_active', true)->findOrFail($id);

        $units = Unit::active()
            ->where('user_id', $agent->id)
            ->with(['type', 'area', 'images'])
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Agents/Show', [
            'agent' => [
                'id' => $agent->id,
                'name' => $agent->name,
                'avatar' => $agent->profile?->avatar,
                'phone' => $agent->profile?->phone,
                'whatsapp' => $agent->profile?->whatsapp,
                'facebook' => $agent->profile?->facebook,
                'linkedin' => $agent->profile?->linkedin,
                'role' => $agent->role,
            ],
            'units' => $units,
        ]);
    }
}
