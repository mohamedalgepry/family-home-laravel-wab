<?php

namespace App\Http\Controllers\Admin;

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
            'unit:id,name,slug',
            'agent:id,name',
        ]);

        if ($user->isAgent()) {
            $query->where('agent_id', $user->id);
        } elseif ($user->isManager()) {
            $agentIds = $user->agents()->pluck('id');
            $query->where(function ($q) use ($user, $agentIds) {
                $q->where('agent_id', $user->id)
                    ->orWhereIn('agent_id', $agentIds);
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['agent_id'])) {
            $query->where('agent_id', $filters['agent_id']);
        }

        $messages = $query->orderByDesc('created_at')->paginate(15);

        $user->unreadNotifications()
            ->where('type', NewMessageNotification::class)
            ->update(['read_at' => now()]);

        if ($user->isManager()) {
            $agents = $user->agents()->select('id', 'name')->orderBy('name')->get();
        } else {
            $agents = User::where('role', 'agent')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'agents' => $agents,
            'filters' => $filters,
        ]);
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

            if ($user->isAgent()) {
                $query->where('agent_id', $user->id);
            } elseif ($user->isManager()) {
                $agentIds = $user->agents()->pluck('id');
                $query->where(function ($q) use ($user, $agentIds) {
                    $q->where('agent_id', $user->id)
                        ->orWhereIn('agent_id', $agentIds);
                });
            }

            $count = $query->count();

            return response()->json(['count' => $count]);
        } catch (\Throwable $e) {
            return response()->json(['count' => 0]);
        }
    }

    public function destroy(Message $message): RedirectResponse
    {
        $this->authorize('delete', $message);

        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', __('messages.deleted_successfully'));
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
