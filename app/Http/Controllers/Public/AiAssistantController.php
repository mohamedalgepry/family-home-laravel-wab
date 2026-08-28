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
            'history' => ['nullable', 'array', 'max:12'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:1500'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        $message = trim((string) $validated['message']);
        $history = $validated['history'] ?? [];
        $locale = $validated['locale'] ?? app()->getLocale() ?: 'ar';

        try {
            $result = $this->hossamService->chat($message, $history, $locale);

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
