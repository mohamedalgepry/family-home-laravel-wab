<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    public function show(string $slug, Request $request): Response
    {
        $agent = User::with('profile')->where('is_active', true)->where('slug', $slug)->firstOrFail();

        $units = Unit::active()
            ->where('user_id', $agent->id)
            ->with(['type', 'area', 'images'])
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $meta = app(SeoService::class)->forPage('agents', [
            'title' => $agent->name.' - '.config('app.name'),
            'canonical' => url('/'.app()->getLocale()."/agents/{$agent->slug}"),
            'hreflang' => [
                'ar' => url("/ar/agents/{$agent->slug}"),
                'en' => url("/en/agents/{$agent->slug}"),
                'x-default' => url("/ar/agents/{$agent->slug}"),
            ],
        ]);

        return Inertia::render('Public/Agents/Show', [
            'agent' => [
                'id' => $agent->id,
                'slug' => $agent->slug,
                'name' => $agent->name,
                'avatar' => $agent->profile?->avatar,
                'phone' => $agent->profile?->phone,
                'whatsapp' => $agent->profile?->whatsapp,
                'facebook' => $agent->profile?->facebook,
                'linkedin' => $agent->profile?->linkedin,
                'role' => $agent->role,
            ],
            'units' => $units,
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }
}
