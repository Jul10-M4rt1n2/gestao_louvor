<?php

namespace App\Services\Music;

class ChordDictionaryService
{
    private array $chords = [];

    public function __construct()
    {
        $this->initializeChords();
    }

    /**
     * Get chords with optional filters.
     */
    public function getChords(string $search = '', string $key = '', string $type = ''): array
    {
        $chords = $this->chords;

        // Filter by search
        if ($search) {
            $chords = array_filter($chords, function ($chord) use ($search) {
                return stripos($chord['name'], $search) !== false;
            });
        }

        // Filter by key
        if ($key) {
            $chords = array_filter($chords, function ($chord) use ($key) {
                return $chord['key'] === $key;
            });
        }

        // Filter by type
        if ($type) {
            $chords = array_filter($chords, function ($chord) use ($type) {
                return $chord['type'] === $type;
            });
        }

        return array_values($chords);
    }

    /**
     * Get a specific chord by name.
     */
    public function getChordByName(string $name): ?array
    {
        foreach ($this->chords as $chord) {
            if ($chord['name'] === $name) {
                return $chord;
            }
        }

        return null;
    }

    /**
     * Get related chords (same key or similar type).
     */
    public function getRelatedChords(string $name, int $limit = 6): array
    {
        $chord = $this->getChordByName($name);
        if (! $chord) {
            return [];
        }

        $related = array_filter($this->chords, function ($c) use ($chord, $name) {
            return $c['name'] !== $name &&
                   ($c['key'] === $chord['key'] || $c['type'] === $chord['type']);
        });

        return array_slice(array_values($related), 0, $limit);
    }

    /**
     * Initialize chord database with common chords.
     */
    private function initializeChords(): void
    {
        $keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Major chords
        foreach ($keys as $key) {
            $this->chords[] = $this->createMajorChord($key);
        }

        // Minor chords
        foreach ($keys as $key) {
            $this->chords[] = $this->createMinorChord($key);
        }

        // Seventh chords
        foreach ($keys as $key) {
            $this->chords[] = $this->createSeventhChord($key);
        }

        // Major seventh chords
        foreach ($keys as $key) {
            $this->chords[] = $this->createMajorSeventhChord($key);
        }

        // Minor seventh chords
        foreach ($keys as $key) {
            $this->chords[] = $this->createMinorSeventhChord($key);
        }

        // Add some suspended chords for C, D, E, F, G, A
        $commonKeys = ['C', 'D', 'E', 'F', 'G', 'A'];
        foreach ($commonKeys as $key) {
            $this->chords[] = $this->createSus2Chord($key);
            $this->chords[] = $this->createSus4Chord($key);
        }

        // Add diminished and augmented for common keys
        foreach ($commonKeys as $key) {
            $this->chords[] = $this->createDiminishedChord($key);
            $this->chords[] = $this->createAugmentedChord($key);
        }
    }

    private function createMajorChord(string $key): array
    {
        $fingerings = [
            'C' => ['string' => [0, 1, 0, 2, 3, 0], 'fret' => 0, 'fingers' => ['x', 1, 'o', 2, 3, 'o']],
            'D' => ['string' => [0, 0, 0, 2, 3, 2], 'fret' => 0, 'fingers' => ['x', 'x', 'o', 1, 3, 2]],
            'E' => ['string' => [0, 2, 2, 1, 0, 0], 'fret' => 0, 'fingers' => ['o', 2, 3, 1, 'o', 'o']],
            'F' => ['string' => [1, 3, 3, 2, 1, 1], 'fret' => 1, 'fingers' => [1, 3, 4, 2, 1, 1]],
            'G' => ['string' => [3, 2, 0, 0, 0, 3], 'fret' => 0, 'fingers' => [3, 2, 'o', 'o', 'o', 4]],
            'A' => ['string' => [0, 0, 2, 2, 2, 0], 'fret' => 0, 'fingers' => ['x', 'o', 2, 3, 4, 'o']],
        ];

        $fingering = $fingerings[$key] ?? ['string' => [1, 3, 3, 2, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 4, 2, 1, 1]];

        return [
            'name' => $key,
            'fullName' => $key.' Major',
            'key' => $key,
            'type' => 'major',
            'notes' => $this->getMajorNotes($key),
            'guitar' => $fingering,
        ];
    }

    private function createMinorChord(string $key): array
    {
        $fingerings = [
            'C' => ['string' => [0, 1, 3, 3, 3, 0], 'fret' => 0, 'fingers' => ['x', 1, 3, 4, 2, 'x']],
            'D' => ['string' => [0, 0, 0, 2, 3, 1], 'fret' => 0, 'fingers' => ['x', 'x', 'o', 2, 3, 1]],
            'E' => ['string' => [0, 2, 2, 0, 0, 0], 'fret' => 0, 'fingers' => ['o', 2, 3, 'o', 'o', 'o']],
            'A' => ['string' => [0, 0, 2, 2, 1, 0], 'fret' => 0, 'fingers' => ['x', 'o', 2, 3, 1, 'o']],
        ];

        $fingering = $fingerings[$key] ?? ['string' => [1, 3, 3, 1, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 4, 1, 1, 1]];

        return [
            'name' => $key.'m',
            'fullName' => $key.' Minor',
            'key' => $key,
            'type' => 'minor',
            'notes' => $this->getMinorNotes($key),
            'guitar' => $fingering,
        ];
    }

    private function createSeventhChord(string $key): array
    {
        return [
            'name' => $key.'7',
            'fullName' => $key.' Seventh',
            'key' => $key,
            'type' => '7',
            'notes' => $this->getSeventhNotes($key),
            'guitar' => ['string' => [1, 3, 1, 2, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 1, 2, 1, 1]],
        ];
    }

    private function createMajorSeventhChord(string $key): array
    {
        return [
            'name' => $key.'maj7',
            'fullName' => $key.' Major Seventh',
            'key' => $key,
            'type' => 'maj7',
            'notes' => $this->getMajorSeventhNotes($key),
            'guitar' => ['string' => [1, 3, 3, 2, 0, 0], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 4, 2, 'x', 'x']],
        ];
    }

    private function createMinorSeventhChord(string $key): array
    {
        return [
            'name' => $key.'m7',
            'fullName' => $key.' Minor Seventh',
            'key' => $key,
            'type' => 'm7',
            'notes' => $this->getMinorSeventhNotes($key),
            'guitar' => ['string' => [1, 3, 1, 1, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 1, 1, 1, 1]],
        ];
    }

    private function createSus2Chord(string $key): array
    {
        return [
            'name' => $key.'sus2',
            'fullName' => $key.' Suspended 2nd',
            'key' => $key,
            'type' => 'sus2',
            'notes' => [$key, $this->getNoteOffset($key, 2), $this->getNoteOffset($key, 7)],
            'guitar' => ['string' => [1, 3, 3, 0, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 4, 'o', 1, 1]],
        ];
    }

    private function createSus4Chord(string $key): array
    {
        return [
            'name' => $key.'sus4',
            'fullName' => $key.' Suspended 4th',
            'key' => $key,
            'type' => 'sus4',
            'notes' => [$key, $this->getNoteOffset($key, 5), $this->getNoteOffset($key, 7)],
            'guitar' => ['string' => [1, 3, 3, 3, 1, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 3, 4, 4, 1, 1]],
        ];
    }

    private function createDiminishedChord(string $key): array
    {
        return [
            'name' => $key.'dim',
            'fullName' => $key.' Diminished',
            'key' => $key,
            'type' => 'dim',
            'notes' => [$key, $this->getNoteOffset($key, 3), $this->getNoteOffset($key, 6)],
            'guitar' => ['string' => [1, 2, 3, 2, 0, 0], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 2, 4, 3, 'x', 'x']],
        ];
    }

    private function createAugmentedChord(string $key): array
    {
        return [
            'name' => $key.'aug',
            'fullName' => $key.' Augmented',
            'key' => $key,
            'type' => 'aug',
            'notes' => [$key, $this->getNoteOffset($key, 4), $this->getNoteOffset($key, 8)],
            'guitar' => ['string' => [1, 0, 3, 2, 2, 1], 'fret' => $this->getBaseFret($key), 'fingers' => [1, 'x', 4, 2, 3, 1]],
        ];
    }

    private function getMajorNotes(string $key): array
    {
        return [$key, $this->getNoteOffset($key, 4), $this->getNoteOffset($key, 7)];
    }

    private function getMinorNotes(string $key): array
    {
        return [$key, $this->getNoteOffset($key, 3), $this->getNoteOffset($key, 7)];
    }

    private function getSeventhNotes(string $key): array
    {
        return [$key, $this->getNoteOffset($key, 4), $this->getNoteOffset($key, 7), $this->getNoteOffset($key, 10)];
    }

    private function getMajorSeventhNotes(string $key): array
    {
        return [$key, $this->getNoteOffset($key, 4), $this->getNoteOffset($key, 7), $this->getNoteOffset($key, 11)];
    }

    private function getMinorSeventhNotes(string $key): array
    {
        return [$key, $this->getNoteOffset($key, 3), $this->getNoteOffset($key, 7), $this->getNoteOffset($key, 10)];
    }

    private function getNoteOffset(string $note, int $semitones): string
    {
        $notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        $index = array_search($note, $notes);
        if ($index === false) {
            return $note;
        }

        return $notes[($index + $semitones) % 12];
    }

    private function getBaseFret(string $key): int
    {
        $frets = [
            'C' => 0, 'C#' => 1, 'D' => 0, 'D#' => 1,
            'E' => 0, 'F' => 1, 'F#' => 2, 'G' => 0,
            'G#' => 1, 'A' => 0, 'A#' => 1, 'B' => 2,
        ];

        return $frets[$key] ?? 0;
    }
}
