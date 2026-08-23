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
        $decodedSlug = urldecode($slug);
        $agent = User::with('profile')
            ->where('is_active', true)
            ->where(function ($query) use ($slug, $decodedSlug) {
                $query->where('slug', $slug)
                    ->orWhere('slug', $decodedSlug);
                if (is_numeric($slug)) {
                    $query->orWhere('id', (int) $slug);
                }
            })
            ->firstOrFail();

        $units = Unit::active()
            ->where('user_id', $agent->id)
            ->with(['type', 'area', 'images'])
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $agentIdentifier = $agent->slug ?: $agent->id;

        $meta = app(SeoService::class)->forPage('agents', [
            'title' => $agent->name.' - '.config('app.name'),
            'canonical' => url('/'.app()->getLocale()."/agents/{$agentIdentifier}"),
            'hreflang' => [
                'ar' => url("/ar/agents/{$agentIdentifier}"),
                'en' => url("/en/agents/{$agentIdentifier}"),
                'x-default' => url("/ar/agents/{$agentIdentifier}"),
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
                'bio' => $agent->profile?->bio,
                'role' => $agent->role,
            ],
            'units' => $units,
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }
}
