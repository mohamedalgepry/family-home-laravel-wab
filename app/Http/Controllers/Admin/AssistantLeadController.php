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

    public function export()
    {
        $leads = AssistantLead::query()->orderByDesc('created_at')->get();

        $filename = 'assistant_leads_' . date('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($leads) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");

            fputcsv($file, [
                __('admin.csv_id'),
                __('admin.csv_name'),
                __('admin.csv_phone'),
                __('admin.csv_status'),
                __('admin.csv_lead_score'),
                __('admin.csv_lead_type'),
                __('admin.csv_context'),
                __('admin.csv_registered_at'),
            ]);

            foreach ($leads as $lead) {
                fputcsv($file, [
                    $lead->id,
                    $lead->name ?: __('admin.csv_unspecified'),
                    $lead->phone,
                    $lead->status === 'contacted' ? __('admin.csv_status_contacted') : __('admin.csv_status_new'),
                    $lead->lead_score ?? 0,
                    $lead->lead_status ?? 'normal',
                    $lead->context ?? '',
                    $lead->created_at?->format('Y-m-d H:i') ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
