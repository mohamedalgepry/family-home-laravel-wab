<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Assistant\Models\AssistantLead;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssistantLeadController extends Controller
{
    public function index(): Response
    {
        $leads = AssistantLead::query()
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Admin/AssistantLeads/Index', [
            'leads' => $leads,
        ]);
    }

    public function markAsContacted(AssistantLead $lead): RedirectResponse
    {
        $lead->update([
            'status' => 'contacted',
        ]);

        return back()->with('success', __('common.updated_successfully'));
    }

    public function destroy(AssistantLead $lead): RedirectResponse
    {
        $lead->delete();

        return back()->with('success', __('common.deleted_successfully'));
    }
}
