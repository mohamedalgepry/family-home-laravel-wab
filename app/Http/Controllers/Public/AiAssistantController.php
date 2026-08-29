<?php

namespace App\Http\Controllers\Public;

use App\Domain\Assistant\Services\HossamAssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiAssistantController
{
    public function __construct(
        private readonly HossamAssistantService $hossamService,
    ) {}

    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:1', 'max:1000'],
            'history' => ['nullable', 'array', 'max:30'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:2000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
            'context_url' => ['nullable', 'string', 'max:1000'],
            'context_title' => ['nullable', 'string', 'max:500'],
        ]);

        $message = trim((string) $validated['message']);
        $history = $validated['history'] ?? [];
        $locale = $validated['locale'] ?? app()->getLocale() ?: 'ar';
        $contextUrl = $validated['context_url'] ?? '';
        $contextTitle = $validated['context_title'] ?? '';

        // 1. Lead Capture
        if (preg_match('/(01[0125][0-9]{8})/u', $message, $matches)) {
            $phone = $matches[1];
            $historyWithCurrent = array_merge($history, [['role' => 'user', 'content' => $message]]);
            \App\Domain\Assistant\Models\AssistantLead::firstOrCreate(
                ['phone' => $phone],
                [
                    'context' => $contextUrl,
                    'chat_history' => $historyWithCurrent,
                    'status' => 'new',
                ]
            );
        }

        try {
            $result = $this->hossamService->chat($message, $history, $locale, $contextUrl, $contextTitle);

            return response()->json([
                'success' => true,
                'reply' => $result['reply'],
                'recommended_units' => $result['recommended_units'],
            ]);
        } catch (\Throwable $e) {
            Log::error('AiAssistantController error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'reply' => $locale === 'en'
                    ? 'I am currently unable to process your request. Please try again in a moment.'
                    : 'أعتذر، حدث خطأ غير متوقع أثناء معالجة طلبك. يرجى المحاولة مرة أخرى بعد قليل.',
                'recommended_units' => [],
            ], 500);
        }
    }
}
