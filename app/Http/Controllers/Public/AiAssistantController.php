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

        // 1. Lead Capture & Scoring Preparation
        $phone = null;
        $historyWithCurrent = array_merge($history, [['role' => 'user', 'content' => $message]]);
        
        // Search full history (and current message) for a phone number
        foreach (array_reverse($historyWithCurrent) as $msg) {
            if ($msg['role'] === 'user' && preg_match('/(01[0125][0-9]{8})/u', $msg['content'], $matches)) {
                $phone = $matches[1];
                break; // Use the most recent phone number provided
            }
        }

        if ($phone) {
            \App\Domain\Assistant\Models\AssistantLead::updateOrCreate(
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

            if ($phone && !empty($result['is_hot_lead'])) {
                $lead = \App\Domain\Assistant\Models\AssistantLead::where('phone', $phone)->first();
                if ($lead) {
                    $lead->lead_status = 'hot';
                    $lead->lead_score = min(10, $lead->lead_score + 3);
                    $lead->save();
                }
            }

            return response()->json([
                'success' => true,
                'reply' => $result['reply'],
                'recommended_units' => $result['recommended_units'],
                'quick_replies' => $result['quick_replies'] ?? [],
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
                'quick_replies' => [],
            ], 500);
        }
    }
}
