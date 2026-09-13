<?php

namespace App\Http\Controllers\Public;

use App\Domain\Assistant\Services\AssistantOrchestratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiAssistantController
{
    public function __construct(
        private readonly AssistantOrchestratorService $orchestrator,
    ) {}

    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:1', 'max:1000'],
            'history' => ['nullable', 'array', 'max:10'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:1000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
            'context_url' => ['nullable', 'string', 'max:500'],
            'context_title' => ['nullable', 'string', 'max:300'],
            'page_context' => ['nullable', 'array'],
        ]);

        $message = trim((string) $validated['message']);
        $history = $validated['history'] ?? [];
        $locale = $validated['locale'] ?? app()->getLocale() ?: 'ar';

        $pageContext = is_array($validated['page_context'] ?? null) ? $validated['page_context'] : [];
        if (!empty($validated['context_url'])) {
            $pageContext['url'] = (string) $validated['context_url'];
        }
        if (!empty($validated['context_title'])) {
            $pageContext['title'] = (string) $validated['context_title'];
        }

        try {
            $result = $this->orchestrator->chat(
                message: $message,
                history: $history,
                locale: $locale,
                pageContext: $pageContext
            );

            return response()->json([
                'success' => true,
                'reply' => $result['reply'],
                'recommended_units' => $result['recommended_units'] ?? [],
                'quick_replies' => $result['quick_replies'] ?? [],
                'is_fallback' => $result['is_fallback'] ?? false,
            ]);
        } catch (\Throwable $e) {
            // Fail-closed: log structured telemetry without user message or sensitive PII
            Log::warning('AiAssistantController caught unhandled exception, falling back safely', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => true,
                'is_fallback' => true,
                'reply' => $locale === 'en'
                    ? 'Hello! I am Hossam from Family Home. Would you like to explore our active projects or check available units?'
                    : 'أهلاً بك! أنا «حسام» من فاميلي هوم. تحب أساعدك في استعراض أحدث المشاريع العقارية أو الوحدات المتاحة للبيع والإيجار؟',
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Show available projects', 'Apartments for sale', 'Contact our team']
                    : ['استعراض المشاريع المتاحة', 'شقق للبيع بالتقسيط', 'تواصل مع فريق المبيعات'],
            ], 200);
        }
    }
}
