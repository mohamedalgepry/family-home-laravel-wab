<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Assistant\Services\HossamKnowledgeService;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiKnowledgeController extends Controller
{
    public function __construct(
        private readonly HossamKnowledgeService $knowledgeService,
    ) {}

    public function index(Request $request): Response
    {
        $items = $this->knowledgeService->getAllItems();
        $stats = $this->knowledgeService->getStats();

        // Optional filtering
        $search = trim((string) $request->input('search', ''));
        $locale = $request->input('locale');
        $filterType = $request->input('type'); // 'all', 'custom', 'learned'

        if (!empty($search)) {
            $normSearch = $this->knowledgeService->normalizeText($search);
            $items = array_values(array_filter($items, function ($item) use ($search, $normSearch) {
                return str_contains(mb_strtolower($item['question']), mb_strtolower($search)) ||
                    str_contains(mb_strtolower($item['reply']), mb_strtolower($search)) ||
                    (!empty($normSearch) && str_contains($this->knowledgeService->normalizeText($item['question']), $normSearch));
            }));
        }

        if (!empty($locale) && in_array($locale, ['ar', 'en'])) {
            $items = array_values(array_filter($items, fn($item) => ($item['locale'] ?? 'ar') === $locale));
        }

        if ($filterType === 'custom') {
            $items = array_values(array_filter($items, fn($item) => !empty($item['is_custom'])));
        } elseif ($filterType === 'learned') {
            $items = array_values(array_filter($items, fn($item) => empty($item['is_custom'])));
        }

        return Inertia::render('Admin/Assistant/Knowledge', [
            'items' => $items,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'locale' => $locale,
                'type' => $filterType ?: 'all',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'min:3', 'max:300'],
            'reply' => ['required', 'string', 'min:5', 'max:3000'],
            'locale' => ['required', 'string', 'in:ar,en'],
            'keywords' => ['nullable'],
            'quick_replies' => ['nullable'],
            'is_active' => ['nullable', 'boolean'],
            'is_hot_lead' => ['nullable', 'boolean'],
        ]);

        $this->knowledgeService->saveItem($validated);

        return redirect()->route('admin.assistant-knowledge.index')
            ->with('success', 'تم حفظ الرد الجاهز في بنك المعرفة بنجاح');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'min:3', 'max:300'],
            'reply' => ['required', 'string', 'min:5', 'max:3000'],
            'locale' => ['required', 'string', 'in:ar,en'],
            'keywords' => ['nullable'],
            'quick_replies' => ['nullable'],
            'is_active' => ['nullable', 'boolean'],
            'is_hot_lead' => ['nullable', 'boolean'],
        ]);

        $this->knowledgeService->saveItem($validated, $id);

        return redirect()->route('admin.assistant-knowledge.index')
            ->with('success', 'تم تحديث الرد في بنك المعرفة بنجاح');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->knowledgeService->deleteItem($id);

        return redirect()->route('admin.assistant-knowledge.index')
            ->with('success', 'تم حذف الرد من بنك المعرفة بنجاح');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $active = $this->knowledgeService->toggleStatus($id);

        return back()->with('success', $active ? 'تم تفعيل الرد بنجاح' : 'تم تعطيل الرد');
    }

    public function clearCache(): RedirectResponse
    {
        $this->knowledgeService->clearCache();

        return back()->with('success', 'تم تحديث كاش المعرفة فوراً');
    }
}

