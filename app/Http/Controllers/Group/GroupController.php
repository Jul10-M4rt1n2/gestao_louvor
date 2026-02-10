<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Http\Requests\Group\StoreGroupRequest;
use App\Http\Requests\Group\UpdateGroupRequest;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Models\Ministry;
use App\Services\Group\GroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public function __construct(
        private readonly GroupService $groupService
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Group::class);

        $groups = $this->groupService->list(
            organizationId: $request->user()->organization_id,
            filters: $request->only(['search', 'ministry_id', 'active']),
            perPage: $request->input('per_page', 15)
        );

        $ministries = Ministry::where('organization_id', $request->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Group/Index', [
            'groups' => GroupResource::collection($groups),
            'ministries' => $ministries,
            'filters' => $request->only(['search', 'ministry_id', 'active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Group::class);

        $ministries = Ministry::where('organization_id', auth()->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Group/Create', [
            'ministries' => $ministries,
        ]);
    }

    public function store(StoreGroupRequest $request): RedirectResponse
    {
        $this->authorize('create', Group::class);

        $group = $this->groupService->create(
            $request->validated(),
            $request->user()->organization_id
        );

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Grupo criado com sucesso!');
    }

    public function show(Request $request, Group $group): Response
    {
        $this->authorize('view', $group);

        $groupData = $this->groupService->find($group->id, $request->user()->organization_id);
        $members = $this->groupService->getMembers($group);

        return Inertia::render('Group/Show', [
            'group' => new GroupResource($groupData),
            'members' => $members,
        ]);
    }

    public function edit(Group $group): Response
    {
        $this->authorize('update', $group);

        $ministries = Ministry::where('organization_id', auth()->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Group/Edit', [
            'group' => new GroupResource($group->load('ministry')),
            'ministries' => $ministries,
        ]);
    }

    public function update(UpdateGroupRequest $request, Group $group): RedirectResponse
    {
        $this->authorize('update', $group);

        $group = $this->groupService->update($group, $request->validated());

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Grupo atualizado com sucesso!');
    }

    public function destroy(Group $group): RedirectResponse
    {
        $this->authorize('delete', $group);

        $this->groupService->delete($group);

        return redirect()
            ->route('groups.index')
            ->with('success', 'Grupo removido com sucesso!');
    }
}
