<?php

namespace App\Http\Controllers\Music;

use App\Http\Controllers\Controller;
use App\Services\Music\ChordDictionaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChordDictionaryController extends Controller
{
    public function __construct(
        private readonly ChordDictionaryService $chordDictionaryService
    ) {}

    /**
     * Display a listing of chords with search and filters.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $key = $request->input('key', '');
        $type = $request->input('type', '');

        $chords = $this->chordDictionaryService->getChords($search, $key, $type);

        return Inertia::render('ChordDictionary/Index', [
            'chords' => $chords,
            'filters' => [
                'search' => $search,
                'key' => $key,
                'type' => $type,
            ],
        ]);
    }

    /**
     * Display the specified chord.
     */
    public function show(string $name)
    {
        $chord = $this->chordDictionaryService->getChordByName($name);

        if (! $chord) {
            abort(404, 'Chord not found');
        }

        $relatedChords = $this->chordDictionaryService->getRelatedChords($name);

        return Inertia::render('ChordDictionary/Show', [
            'chord' => $chord,
            'relatedChords' => $relatedChords,
        ]);
    }
}
