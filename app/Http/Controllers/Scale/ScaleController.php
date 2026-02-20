<?php

namespace App\Http\Controllers\Scale;

use App\Http\Controllers\Controller;
use App\Http\Requests\Scale\StoreScaleRequest;
use App\Http\Requests\Scale\UpdateScaleRequest;
use App\Http\Resources\ScaleResource;
use App\Models\Group;
use App\Models\Music;
use App\Models\Schedule;
use App\Models\ScheduleMusic;
use App\Models\ScheduleParticipant;
use App\Models\User;
use App\Services\Scale\ScaleService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScaleController extends Controller
{
    public function __construct(
        private readonly ScaleService $scaleService
    ) {}

    /**
     * Display a listing of schedules.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Schedule::class);

        $schedules = $this->scaleService->getPaginated(
            organizationId: $request->user()->organization_id,
            search: $request->input('search'),
            status: $request->input('status'),
            groupId: $request->input('group_id'),
            startDate: $request->input('start_date'),
            endDate: $request->input('end_date'),
            perPage: $request->input('per_page', 15)
        );

        $groups = Group::where('organization_id', $request->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $statistics = $this->scaleService->getStatistics($request->user()->organization_id);

        return Inertia::render('Scale/Index', [
            'schedules' => $schedules->through(fn($schedule) => (new ScaleResource($schedule))->resolve()),
            'groups' => $groups,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'status', 'group_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Show the form for creating a new schedule.
     */
    public function create(): Response
    {
        $this->authorize('create', Schedule::class);

        $groups = Group::where('organization_id', auth()->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Scale/Create', [
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created schedule.
     */
    public function store(StoreScaleRequest $request): RedirectResponse
    {
        $this->authorize('create', Schedule::class);

        $schedule = $this->scaleService->create(
            $request->validated(),
            $request->user()
        );

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Escala criada com sucesso!');
    }

    /**
     * Display the specified schedule.
     */
    public function show(Request $request, Schedule $schedule): Response
    {
        $this->authorize('view', $schedule);

        $schedule->load(['group']);

        // Músicas da escala no formato que o frontend espera
        $scheduleMusics = ScheduleMusic::where('schedule_id', $schedule->id)
            ->with('music:id,title,artist,original_key,lyrics,chords_text')
            ->orderBy('order')
            ->get();

        // Participantes com nome da função resolvida
        $participantsRaw = ScheduleParticipant::where('schedule_id', $schedule->id)
            ->with(['user:id,name,email'])
            ->get();

        $functionIds = $participantsRaw->pluck('function_id')->filter()->unique()->values();
        $functionNames = \App\Models\MinistryFunction::whereIn('id', $functionIds)->pluck('name', 'id');

        $participants = $participantsRaw->map(function ($p) use ($functionNames) {
            return [
                'id' => $p->id,
                'user_id' => $p->user_id,
                'status' => $p->status,
                'notes' => $p->notes,
                'confirmed_at' => $p->confirmed_at?->format('d/m/Y H:i'),
                'user' => [
                    'id' => $p->user->id,
                    'name' => $p->user->name,
                    'email' => $p->user->email,
                ],
                'function' => $p->function_id ? ($functionNames[$p->function_id] ?? null) : null,
            ];
        });

        $availableMusics = Music::where('organization_id', $request->user()->organization_id)
            ->where('active', true)
            ->orderBy('title')
            ->get(['id', 'title', 'artist', 'original_key']);

        $availableUsers = User::where('organization_id', $request->user()->organization_id)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $availableFunctions = \App\Models\MinistryFunction::where('organization_id', $request->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'category']);

        return Inertia::render('Scale/Show', [
            'schedule' => (new ScaleResource($schedule))->resolve(),
            'scheduleMusics' => $scheduleMusics,
            'participants' => $participants,
            'availableMusics' => $availableMusics,
            'availableUsers' => $availableUsers,
            'availableFunctions' => $availableFunctions,
        ]);
    }

    /**
     * Show the form for editing the specified schedule.
     */
    public function edit(Schedule $schedule): Response
    {
        $this->authorize('update', $schedule);

        $groups = Group::where('organization_id', auth()->user()->organization_id)
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Scale/Edit', [
            'schedule' => (new ScaleResource($schedule->load('group')))->resolve(),
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified schedule.
     */
    public function update(UpdateScaleRequest $request, Schedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $schedule = $this->scaleService->update($schedule, $request->validated());

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Escala atualizada com sucesso!');
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(Schedule $schedule): RedirectResponse
    {
        $this->authorize('delete', $schedule);

        $this->scaleService->delete($schedule);

        return redirect()
            ->route('scales.index')
            ->with('success', 'Escala removida com sucesso!');
    }

    /**
     * Get schedules for a specific week.
     */
    public function week(Request $request): Response
    {
        $this->authorize('viewAny', Schedule::class);

        $date = $request->has('date')
            ? Carbon::parse($request->input('date'))
            : now();

        $schedules = $this->scaleService->getWeekSchedules(
            $request->user()->organization_id,
            $date
        );

        return Inertia::render('Scale/Week', [
            'schedules' => $schedules->map(fn($schedule) => (new ScaleResource($schedule))->resolve()),
            'currentDate' => $date->format('Y-m-d'),
            'startOfWeek' => $date->copy()->startOfWeek()->format('Y-m-d'),
            'endOfWeek' => $date->copy()->endOfWeek()->format('Y-m-d'),
        ]);
    }

    /**
     * Add music to schedule.
     */
    public function addMusic(Request $request, Schedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $request->validate([
            'music_id' => 'required|exists:musics,id',
            'custom_key' => 'nullable|string|max:5',
            'notes' => 'nullable|string',
        ], [
            'music_id.required' => 'A música é obrigatória.',
            'music_id.exists' => 'A música selecionada não existe.',
            'custom_key.max' => 'A tonalidade não pode ter mais de 5 caracteres.',
        ]);

        $this->scaleService->addMusic(
            $schedule,
            $request->input('music_id'),
            $request->input('custom_key'),
            $request->input('notes')
        );

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Música adicionada à escala!');
    }

    /**
     * Update music in schedule.
     */
    public function updateMusic(Request $request, Schedule $schedule, ScheduleMusic $scheduleMusic): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $request->validate([
            'custom_key' => 'nullable|string|max:5',
            'order' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
        ], [
            'custom_key.max' => 'A tonalidade não pode ter mais de 5 caracteres.',
            'order.integer' => 'A ordem deve ser um número inteiro.',
            'order.min' => 'A ordem deve ser no mínimo 1.',
        ]);

        $this->scaleService->updateMusic($scheduleMusic, $request->only(['custom_key', 'order', 'notes']));

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Música atualizada!');
    }

    /**
     * Remove music from schedule.
     */
    public function removeMusic(Schedule $schedule, ScheduleMusic $scheduleMusic): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $this->scaleService->removeMusic($scheduleMusic);

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Música removida da escala!');
    }

    /**
     * Reorder a music in the schedule (move up or down).
     */
    public function reorderMusic(Request $request, Schedule $schedule, ScheduleMusic $scheduleMusic): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $direction = $request->input('direction'); // 'up' or 'down'

        $allMusics = ScheduleMusic::where('schedule_id', $schedule->id)
            ->orderBy('order')
            ->get();

        $currentIndex = $allMusics->search(fn($m) => $m->id === $scheduleMusic->id);

        if ($currentIndex === false) {
            return redirect()->route('scales.show', $schedule);
        }

        $swapIndex = $direction === 'up' ? $currentIndex - 1 : $currentIndex + 1;

        if ($swapIndex < 0 || $swapIndex >= $allMusics->count()) {
            return redirect()->route('scales.show', $schedule);
        }

        $currentOrder = $allMusics[$currentIndex]->order;
        $swapOrder = $allMusics[$swapIndex]->order;

        $allMusics[$currentIndex]->update(['order' => $swapOrder]);
        $allMusics[$swapIndex]->update(['order' => $currentOrder]);

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Ordem das músicas atualizada!');
    }

    /**
     * Add participant to schedule.
     */
    public function addParticipant(Request $request, Schedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'function_id' => 'nullable|exists:ministry_functions,id',
            'status' => 'nullable|in:convidado,confirmado,rejeitado,ausente',
            'notes' => 'nullable|string',
        ], [
            'user_id.required' => 'O participante é obrigatório.',
            'user_id.exists' => 'O participante selecionado não existe.',
            'function_id.exists' => 'A função selecionada não existe.',
            'status.in' => 'O status deve ser: convidado, confirmado, rejeitado ou ausente.',
        ]);

        $this->scaleService->addParticipant(
            $schedule,
            $request->input('user_id'),
            $request->input('function_id'),
            $request->input('status', 'convidado'),
            $request->input('notes')
        );

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Participante adicionado à escala!');
    }

    /**
     * Update participant in schedule.
     */
    public function updateParticipant(Request $request, Schedule $schedule, ScheduleParticipant $participant): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $request->validate([
            'function_id' => 'nullable|exists:ministry_functions,id',
            'status' => 'nullable|in:convidado,confirmado,rejeitado,ausente',
            'notes' => 'nullable|string',
        ], [
            'function_id.exists' => 'A função selecionada não existe.',
            'status.in' => 'O status deve ser: convidado, confirmado, rejeitado ou ausente.',
        ]);

        $this->scaleService->updateParticipant($participant, $request->only(['function_id', 'status', 'notes']));

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Participante atualizado!');
    }

    /**
     * Remove participant from schedule.
     */
    public function removeParticipant(Schedule $schedule, ScheduleParticipant $participant): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $this->scaleService->removeParticipant($participant);

        return redirect()
            ->route('scales.show', $schedule)
            ->with('success', 'Participante removido da escala!');
    }
}
