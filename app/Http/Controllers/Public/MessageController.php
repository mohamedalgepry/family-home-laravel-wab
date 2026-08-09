<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Actions\CreateMessageAction;
use App\Domain\Listings\DTOs\CreateMessageData;
use App\Domain\Listings\Models\Unit;
use App\Http\Requests\Public\StoreMessageRequest;
use Illuminate\Http\RedirectResponse;

class MessageController
{
    public function __construct(
        private readonly CreateMessageAction $createMessageAction,
    ) {}

    public function store(StoreMessageRequest $request, Unit $unit): RedirectResponse
    {
        // لا نستقبل تواصل لوحدات غير فعّالة/منتهية
        if (! $unit->is_active) {
            abort(404);
        }

        $data = CreateMessageData::validateAndCreate([
            'unit_id' => $unit->id,
            ...$request->validated(),
        ]);

        $this->createMessageAction->execute($data);

        return back()->with('success', __('messages.message_sent'));
    }

    public function storeContact(StoreMessageRequest $request): RedirectResponse
    {
        $data = CreateMessageData::validateAndCreate([
            'unit_id' => null,
            ...$request->validated(),
        ]);

        $this->createMessageAction->execute($data);

        return back()->with('success', __('messages.message_sent'));
    }
}
