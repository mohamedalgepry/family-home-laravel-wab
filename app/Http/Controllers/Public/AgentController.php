<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\Public\HomeUnitCardResource;
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

        // استعلام الوحدات النشطة
        $baseQuery = Unit::active();

        if ($agent->isAdmin()) {
            // الأدمن هو المسؤول الأول وممثل الشركة، تعرض له كافة وحدات المنصة النشطة
        } elseif ($agent->isManager()) {
            // المدير تعرض له وحداته ووحدات وكلائه التابعين له ووحدات مشاريعهم
            $managedAgentIds = User::where('manager_id', $agent->id)->pluck('id')->push($agent->id)->all();
            $baseQuery->where(function ($query) use ($managedAgentIds) {
                $query->whereIn('user_id', $managedAgentIds)
                    ->orWhereHas('project', function ($q) use ($managedAgentIds) {
                        $q->whereIn('user_id', $managedAgentIds);
                    });
            });
        } else {
            // الوكيل تعرض له وحداته ووحدات مشاريعه
            $baseQuery->where(function ($query) use ($agent) {
                $query->where('user_id', $agent->id)
                    ->orWhereHas('project', function ($q) use ($agent) {
                        $q->where('user_id', $agent->id);
                    });
            });
        }

        // حساب الإحصائيات قبل تطبيق فلاتر الصفحة
        $statsBaseQuery = clone $baseQuery;
        $totalUnits = (clone $statsBaseQuery)->count();
        $forSaleCount = (clone $statsBaseQuery)->where('transaction', 'sale')->count();
        $forRentCount = (clone $statsBaseQuery)->where('transaction', 'rent')->count();

        // المناطق المتاحة التي بها عقارات لهذا المستشار
        $areaIds = (clone $statsBaseQuery)->whereNotNull('area_id')->distinct()->pluck('area_id');
        $availableAreas = Area::whereIn('id', $areaIds)
            ->select('id', 'name_ar', 'name_en', 'slug')
            ->orderBy('name_ar')
            ->get();

        // تطبيق الفلاتر الاختيارية (transaction, area_id, search, sort)
        $unitsQuery = clone $baseQuery;

        if ($request->filled('transaction') && in_array($request->query('transaction'), ['sale', 'rent'])) {
            $unitsQuery->where('transaction', $request->query('transaction'));
        }

        if ($request->filled('area_id')) {
            $unitsQuery->where('area_id', (int) $request->query('area_id'));
        }

        if ($request->filled('search')) {
            $searchTerm = trim($request->query('search'));
            $unitsQuery->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('name_ar', 'like', "%{$searchTerm}%")
                    ->orWhere('name_en', 'like', "%{$searchTerm}%")
                    ->orWhere('description_ar', 'like', "%{$searchTerm}%")
                    ->orWhere('description_en', 'like', "%{$searchTerm}%");
            });
        }

        // خيارات الترتيب
        $sort = $request->query('sort', 'latest');
        match ($sort) {
            'price_asc' => $unitsQuery->orderBy('price', 'asc'),
            'price_desc' => $unitsQuery->orderBy('price', 'desc'),
            'area_desc' => $unitsQuery->orderBy('area_sqm', 'desc'),
            default => $unitsQuery->orderByDesc('created_at'),
        };

        $units = $unitsQuery
            ->with(['type', 'area', 'images', 'finishingType', 'user.profile'])
            ->paginate(12)
            ->withQueryString();

        $agentIdentifier = $agent->slug ?: $agent->id;

        $title = $agent->name.' - '.config('app.name');
        $description = $agent->profile?->bio ?: (
            app()->getLocale() === 'ar'
                ? "تصفح جميع الوحدات والعقارات المتاحة عبر المستشار العقاري {$agent->name} من شركة فاميلي هوم للتطوير العقاري. شقق، فلل، ومحلات بأفضل الأسعار وخطط السداد في مصر."
                : "Explore all properties and real estate units offered by consultant {$agent->name} at Family Home Real Estate. Apartments, villas, and commercial spaces with the best payment plans in Egypt."
        );

        $meta = app(SeoService::class)->forPage('agents', [
            'title' => $title,
            'description' => $description,
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
                'email' => $agent->email,
            ],
            'stats' => [
                'total_units' => $totalUnits,
                'for_sale' => $forSaleCount,
                'for_rent' => $forRentCount,
                'areas_count' => $availableAreas->count(),
            ],
            'availableAreas' => $availableAreas,
            'filters' => [
                'transaction' => $request->query('transaction', ''),
                'area_id' => $request->query('area_id', ''),
                'sort' => $sort,
                'search' => $request->query('search', ''),
            ],
            'units' => HomeUnitCardResource::collection($units),
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }
}
