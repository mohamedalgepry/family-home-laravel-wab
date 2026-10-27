<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\NewMessageNotification;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Message::class);

        $user = request()->user();
        $filters = request()->only(['status', 'agent_id']);

        $query = Message::with([
            'unit',
            'agent:id,name',
        ]);

        UserScopeQueryBuilder::applyTeamScope($query, $user);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['agent_id'])) {
            $query->where('agent_id', $filters['agent_id']);
        }

        $messages = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        $visibleMessageIds = $messages->pluck('id')->all();
        if (! empty($visibleMessageIds)) {
            $user->unreadNotifications()
                ->where('type', NewMessageNotification::class)
                ->whereIn('data->message_id', $visibleMessageIds)
                ->update(['read_at' => now()]);

            app(\App\Domain\Users\Services\NotificationService::class)->clearUserCache($user);
        }

        if ($user->isAdmin()) {
            $agents = User::where('role', 'agent')->select('id', 'name')->orderBy('name')->get();
        } elseif ($user->isManager()) {
            $agents = $user->agents()->select('id', 'name')->orderBy('name')->get();
            $agents->prepend(User::select('id', 'name')->find($user->id));
        } else {
            $agents = User::where('id', $user->id)->select('id', 'name')->get();
        }

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'agents' => $agents,
            'filters' => $filters,
        ]);
    }

    public function export(Request $request)
    {
        $this->authorize('viewAny', Message::class);

        $user = $request->user();
        $filters = $request->only(['status', 'agent_id']);

        $query = Message::with([
            'unit:id,name,name_ar,name_en',
            'agent:id,name',
        ]);

        UserScopeQueryBuilder::applyTeamScope($query, $user);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['agent_id'])) {
            $query->where('agent_id', $filters['agent_id']);
        }

        $filename = 'messages_' . date('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");

            fputcsv($file, [
                __('admin.csv_id'),
                __('admin.csv_name'),
                __('admin.csv_phone'),
                __('admin.csv_email'),
                __('admin.csv_unit'),
                __('admin.csv_agent'),
                __('admin.csv_status'),
                __('admin.csv_content'),
                __('admin.csv_created_at'),
                __('admin.csv_replied_at'),
            ]);

            $sanitize = function (?string $val): string {
                if ($val === null || $val === '') {
                    return '';
                }
                if (in_array($val[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
                    return "'" . $val;
                }
                return $val;
            };

            foreach ($query->orderByDesc('created_at')->cursor() as $msg) {
                $unitLabel = $msg->unit ? ($msg->unit->name_ar ?: ($msg->unit->name ?: $msg->unit->name_en)) : __('admin.csv_general');
                $agentLabel = $msg->agent?->name ?? __('admin.csv_unspecified');
                $statusLabel = $msg->status === 'replied' ? __('admin.csv_status_replied') : __('admin.csv_status_pending');

                fputcsv($file, [
                    $msg->id,
                    $sanitize($msg->client_name),
                    $sanitize($msg->client_phone),
                    $sanitize($msg->client_email),
                    $sanitize($unitLabel),
                    $sanitize($agentLabel),
                    $sanitize($statusLabel),
                    $sanitize($msg->content),
                    $msg->created_at?->format('Y-m-d H:i') ?? '',
                    $msg->replied_at?->format('Y-m-d H:i') ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $request->headers->remove('X-Inertia');
        $request->headers->remove('X-Inertia-Version');

        try {
            $user = $request->user();
            if (! $user) {
                return response()->json(['count' => 0]);
            }

            $query = Message::where('status', 'pending');

            UserScopeQueryBuilder::applyTeamScope($query, $user);

            $count = $query->count();

            return response()->json(['count' => $count]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Failed to get unread messages count', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['count' => 0]);
        }
    }

    public function destroy(Message $message): RedirectResponse
    {
        $this->authorize('delete', $message);

        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', __('common.deleted_successfully'));
    }

    public function markAsReplied(Message $message): RedirectResponse
    {
        $this->authorize('markAsReplied', $message);

        $message->update([
            'status' => 'replied',
            'replied_at' => now(),
        ]);

        return redirect()->route('admin.messages.index')
            ->with('success', __('messages.marked_as_replied'));
    }
}
