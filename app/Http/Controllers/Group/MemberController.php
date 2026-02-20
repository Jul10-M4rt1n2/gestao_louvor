<?php

namespace App\Http\Controllers\Group;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\MinistryFunction;
use App\Models\User;
use App\Services\Group\GroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function __construct(
        private readonly GroupService $groupService
    ) {}

    public function store(Request $request, Group $group): RedirectResponse
    {
        $this->authorize('update', $group);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'function_ids' => 'nullable|array',
            'function_ids.*' => 'exists:ministry_functions,id',
        ], [
            'user_id.required' => 'O usuário é obrigatório.',
            'user_id.exists' => 'Usuário não encontrado.',
            'function_ids.array' => 'As funções devem ser um array.',
            'function_ids.*.exists' => 'Função inválida.',
        ]);

        $user = User::findOrFail($request->user_id);

        if ($user->organization_id !== $request->user()->organization_id) {
            return back()->withErrors(['user_id' => 'Usuário não pertence à sua organização.']);
        }

        $this->groupService->addMember(
            $group,
            $request->user_id,
            $request->input('function_ids', [])
        );

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Membro adicionado ao grupo com sucesso!');
    }

    public function update(Request $request, Group $group, int $userId): RedirectResponse
    {
        $this->authorize('update', $group);

        $request->validate([
            'function_ids' => 'nullable|array',
            'function_ids.*' => 'exists:ministry_functions,id',
        ], [
            'function_ids.array' => 'As funções devem ser um array.',
            'function_ids.*.exists' => 'Função inválida.',
        ]);

        $this->groupService->updateMemberFunctions(
            $group,
            $userId,
            $request->input('function_ids', [])
        );

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Funções do membro atualizadas com sucesso!');
    }

    public function destroy(Group $group, int $userId): RedirectResponse
    {
        $this->authorize('update', $group);

        $this->groupService->removeMember($group, $userId);

        return redirect()
            ->route('groups.show', $group)
            ->with('success', 'Membro removido do grupo com sucesso!');
    }
}
