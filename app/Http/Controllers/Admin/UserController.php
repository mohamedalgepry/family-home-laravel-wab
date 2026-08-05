<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Users\Models\User;
use App\Domain\Users\Services\UserService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignAgentsRequest;
use App\Http\Requests\Admin\ChangeUserPasswordRequest;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\TransferProjectsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $filters = request()->only(['search', 'role']);

        $users = User::with('manager:id,name')
            ->orderBy('name')
            ->when(! empty($filters['search']), fn ($q) => $q->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%");
            }))
            ->when(! empty($filters['role']), fn ($q) => $q->where('role', $filters['role']))
            ->get();

        $managers = User::managers()
            ->select('id', 'name')
            ->with('agents:id,name,email,manager_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'managers' => $managers,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        $managers = User::managers()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Users/Create', [
            'managers' => $managers,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validated();

        $user = User::make([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'manager_id' => $data['role'] === 'agent' ? (!empty($data['manager_id']) ? $data['manager_id'] : $request->user()->id) : null,
        ]);

        $user->role = $data['role'];
        $user->is_active = true;
        $user->save();

        return redirect()->route('admin.users.index')
            ->with('success', __('users.user_created', ['name' => $user->name]));
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        if ($user->is_active) {
            $this->userService->deactivateUser($user->id);
        } else {
            $this->userService->activateUser($user->id);
        }

        return redirect()->route('admin.users.index')
            ->with('success', __('users.status_updated'));
    }

    public function transferProjects(TransferProjectsRequest $request): RedirectResponse
    {
        $this->authorize('transferProjects', User::class);

        $this->userService->transferProjects(
            fromUserId: (int) $request->input('from_user_id'),
            toUserId: (int) $request->input('to_user_id'),
        );

        return redirect()->route('admin.users.index')
            ->with('success', __('users.projects_transferred'));
    }

    public function assignAgents(AssignAgentsRequest $request): RedirectResponse
    {
        $this->authorize('assignAgents', User::class);

        $this->userService->assignAgentToManager(
            managerId: (int) $request->input('manager_id'),
            agentIds: $request->input('agent_ids', []),
        );

        return redirect()->route('admin.users.index')
            ->with('success', __('users.agents_assigned'));
    }

    public function checkRelations(User $user)
    {
        $this->authorize('delete', $user);

        return response()->json($this->userService->checkUserRelations($user->id));
    }

    public function destroy(User $user, Request $request): RedirectResponse
    {
        $this->authorize('delete', $user);

        $transferToId = $request->input('transfer_to_id');
        $this->userService->destroyUser($user->id, $transferToId ? (int) $transferToId : null);

        return redirect()->route('admin.users.index')
            ->with('success', __('users.user_deleted'));
    }

    public function changePassword(User $user, ChangeUserPasswordRequest $request): RedirectResponse
    {
        $this->authorize('update', $user);

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', __('users.password_changed'));
    }
}
