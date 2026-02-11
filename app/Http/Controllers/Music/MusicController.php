<?php

namespace App\Http\Controllers\Music;

use App\Http\Controllers\Controller;
use App\Http\Requests\Music\StoreMusicRequest;
use App\Http\Requests\Music\UpdateMusicRequest;
use App\Http\Resources\MusicResource;
use App\Models\Music;
use App\Services\Music\MusicService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MusicController extends Controller
{
    public function __construct(
        private readonly MusicService $musicService
    ) {}

    /**
     * Display a listing of musics.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Music::class);

        $musics = $this->musicService->getPaginated(
            organizationId: $request->user()->organization_id,
            search: $request->input('search'),
            genre: $request->input('genre'),
            key: $request->input('key'),
            perPage: $request->input('per_page', 15)
        );

        $genres = $this->musicService->getGenres($request->user()->organization_id);

        return Inertia::render('Music/Index', [
            'musics' => $musics->through(fn($music) => (new MusicResource($music))->resolve()),
            'genres' => $genres,
            'filters' => $request->only(['search', 'genre', 'key']),
        ]);
    }

    /**
     * Show the form for creating a new music.
     */
    public function create(): Response
    {
        $this->authorize('create', Music::class);

        return Inertia::render('Music/Create');
    }

    /**
     * Store a newly created music.
     */
    public function store(StoreMusicRequest $request): RedirectResponse
    {
        $this->authorize('create', Music::class);

        $music = $this->musicService->create(
            $request->validated(),
            $request->user()
        );

        return redirect()
            ->route('music.show', $music)
            ->with('success', 'Música cadastrada com sucesso!');
    }

    /**
     * Display the specified music.
     */
    public function show(Request $request, Music $music): Response
    {
        $this->authorize('view', $music);

        // Check if transposition is requested
        $transposedKey = $request->input('key', $music->original_key);
        $transposedData = null;

        if ($transposedKey && $transposedKey !== $music->original_key && $music->original_key) {
            $transposedData = $this->musicService->transpose(
                $music,
                $music->original_key,
                $transposedKey
            );
        }

        $chords = $this->musicService->getChords($music);

        return Inertia::render('Music/Show', [
            'music' => (new MusicResource($music->load(['creator', 'organization'])))->resolve(),
            'transposed' => $transposedData,
            'chords' => $chords,
            'currentKey' => $transposedKey,
        ]);
    }

    /**
     * Show the form for editing the specified music.
     */
    public function edit(Music $music): Response
    {
        $this->authorize('update', $music);

        return Inertia::render('Music/Edit', [
            'music' => (new MusicResource($music))->resolve(),
        ]);
    }

    /**
     * Update the specified music.
     */
    public function update(UpdateMusicRequest $request, Music $music): RedirectResponse
    {
        $this->authorize('update', $music);

        $music = $this->musicService->update($music, $request->validated());

        return redirect()
            ->route('music.show', $music)
            ->with('success', 'Música atualizada com sucesso!');
    }

    /**
     * Remove the specified music.
     */
    public function destroy(Music $music): RedirectResponse
    {
        $this->authorize('delete', $music);

        $this->musicService->delete($music);

        return redirect()
            ->route('music.index')
            ->with('success', 'Música removida com sucesso!');
    }

    /**
     * Search musics.
     */
    public function search(Request $request): Response
    {
        $this->authorize('viewAny', Music::class);

        $musics = $this->musicService->search(
            $request->user()->organization_id,
            $request->input('q', ''),
            $request->input('per_page', 15)
        );

        return Inertia::render('Music/Search', [
            'musics' => $musics->through(fn($music) => (new MusicResource($music))->resolve()),
            'query' => $request->input('q', ''),
        ]);
    }

    /**
     * Transpose a music to a different key.
     */
    public function transpose(Request $request, Music $music): Response
    {
        $this->authorize('view', $music);

        $request->validate([
            'from_key' => 'required|string',
            'to_key' => 'required|string',
        ]);

        $transposed = $this->musicService->transpose(
            $music,
            $request->input('from_key'),
            $request->input('to_key')
        );

        return Inertia::render('Music/Show', [
            'music' => (new MusicResource($music))->resolve(),
            'transposed' => $transposed,
            'chords' => $this->musicService->getChords($music),
            'currentKey' => $request->input('to_key'),
        ]);
    }
}
