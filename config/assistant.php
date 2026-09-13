<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Assistant Service Configuration
    |--------------------------------------------------------------------------
    |
    | Strictly scoped and secured AI Assistant configuration for Family Home.
    | Read-only operations restricted to public projects & units inventory.
    |
    */

    'provider' => env('ASSISTANT_PROVIDER', null),

    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY', ''),
        'model' => env('OPENROUTER_MODEL', 'google/gemini-2.0-flash-exp:free'),
        'fallback_model' => env('OPENROUTER_FALLBACK_MODEL', 'qwen/qwen-2.5-7b-instruct:free'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY', ''),
        'model' => env('GEMINI_MODEL', 'gemini-2.0-flash'),
    ],

    // Client request timeout in seconds
    'timeout_seconds' => (int) env('ASSISTANT_TIMEOUT_SECONDS', 30),

    // Real overall server timeout budget across entire chat turn (seconds)
    'total_budget_seconds' => (float) env('ASSISTANT_TOTAL_BUDGET_SECONDS', 40.0),

    // Ceiling per individual LLM request call (seconds)
    'per_request_timeout_seconds' => (float) env('ASSISTANT_PER_REQUEST_TIMEOUT_SECONDS', 30.0),

    // Maximum tool execution turns per request
    'max_tool_iterations' => 2,

    // Maximum history messages preserved
    'max_history_turns' => 6,

    // Max allowed message character length
    'max_message_chars' => 1000,

    // Default pagination limit for listings
    'default_per_page' => 6,
    'max_per_page' => 12,

    // Dedicated database connection enforcing read-only queries
    'db_connection' => env('ASSISTANT_DB_CONNECTION', 'assistant_readonly'),
    'db_connection_testing' => env('ASSISTANT_DB_CONNECTION_TESTING', null),

    // Company public WhatsApp for safe referral fallback
    'default_whatsapp' => env('COMPANY_WHATSAPP', '201000000000'),
];
