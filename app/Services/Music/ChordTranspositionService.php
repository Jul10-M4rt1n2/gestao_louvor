<?php

namespace App\Services\Music;

use App\Domain\Music\Enums\Key;

/**
 * Service for transposing musical chords
 *
 * This service implements a complete chord transposition algorithm that:
 * - Transposes chords to any key
 * - Handles all chord types (major, minor, 7, maj7, m7, dim, aug, sus2, sus4, etc.)
 * - Preserves bass notes (e.g., C/E → D/F#)
 * - Supports both sharps (#) and flats (b)
 * - Detects chords in text using regex
 */
class ChordTranspositionService
{
    /**
     * Chromatic scale (sharps)
     */
    private const CHROMATIC_SCALE_SHARPS = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
    ];

    /**
     * Chromatic scale (flats)
     */
    private const CHROMATIC_SCALE_FLATS = [
        'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
    ];

    /**
     * Chord pattern regex
     * Matches: C, Cm, C7, Cmaj7, C#m7, Db/F, Gsus4, Aadd9, etc.
     */
    private const CHORD_PATTERN = '/\b([A-G][#b]?)(m|maj|min|dim|aug|sus[24]|add[29])?([2-9]|1[0-3]|[Mm]aj7|m7b5|m7|6|7)?(\/([A-G][#b]?))?\b/';

    /**
     * Transpose a single chord by the specified number of semitones
     *
     * @param  string  $chord  The chord to transpose (e.g., "Cmaj7", "D#m", "G/B")
     * @param  int  $semitones  Number of semitones to transpose (positive or negative)
     * @param  bool  $useSharps  Whether to use sharps (true) or flats (false) for accidentals
     * @return string The transposed chord
     */
    public function transposeChord(string $chord, int $semitones, bool $useSharps = true): string
    {
        // Parse the chord using regex
        if (! preg_match(self::CHORD_PATTERN, $chord, $matches)) {
            return $chord; // Return unchanged if not a valid chord
        }

        $root = $matches[1]; // Root note (C, D#, Eb, etc.)
        $quality = $matches[2] ?? ''; // m, maj, min, dim, aug, sus2, sus4, add9, add2
        $extension = $matches[3] ?? ''; // 7, maj7, m7, 6, 9, etc.
        $bass = isset($matches[5]) ? $matches[5] : null; // Bass note for slash chords

        // Transpose root note
        $newRoot = $this->transposeNote($root, $semitones, $useSharps);

        // Transpose bass note if present
        $newBass = $bass ? $this->transposeNote($bass, $semitones, $useSharps) : null;

        // Reconstruct the chord
        $transposedChord = $newRoot.$quality.$extension;

        if ($newBass) {
            $transposedChord .= '/'.$newBass;
        }

        return $transposedChord;
    }

    /**
     * Transpose a single note by the specified number of semitones
     *
     * @param  string  $note  The note to transpose (C, D#, Eb, etc.)
     * @param  int  $semitones  Number of semitones to transpose
     * @param  bool  $useSharps  Whether to use sharps or flats
     * @return string The transposed note
     */
    private function transposeNote(string $note, int $semitones, bool $useSharps): string
    {
        $scale = $useSharps ? self::CHROMATIC_SCALE_SHARPS : self::CHROMATIC_SCALE_FLATS;

        // Find current position in chromatic scale
        $position = $this->getNotePosition($note);

        // Calculate new position (handle negative and overflow)
        $newPosition = ($position + $semitones) % 12;
        if ($newPosition < 0) {
            $newPosition += 12;
        }

        return $scale[$newPosition];
    }

    /**
     * Get the position of a note in the chromatic scale (0-11)
     *
     * @param  string  $note  The note (C, C#, Db, etc.)
     * @return int Position (0-11)
     */
    private function getNotePosition(string $note): int
    {
        // Normalize enharmonic equivalents
        $noteMap = [
            'C' => 0, 'C#' => 1, 'Db' => 1,
            'D' => 2, 'D#' => 3, 'Eb' => 3,
            'E' => 4,
            'F' => 5, 'F#' => 6, 'Gb' => 6,
            'G' => 7, 'G#' => 8, 'Ab' => 8,
            'A' => 9, 'A#' => 10, 'Bb' => 10,
            'B' => 11,
        ];

        return $noteMap[$note] ?? 0;
    }

    /**
     * Transpose all chords in a text
     *
     * @param  string  $text  Text containing chords (e.g., lyrics with chords)
     * @param  int  $semitones  Number of semitones to transpose
     * @param  bool  $useSharps  Whether to use sharps or flats
     * @return string Text with transposed chords
     */
    public function transposeText(string $text, int $semitones, bool $useSharps = true): string
    {
        return preg_replace_callback(
            self::CHORD_PATTERN,
            function ($matches) use ($semitones, $useSharps) {
                return $this->transposeChord($matches[0], $semitones, $useSharps);
            },
            $text
        );
    }

    /**
     * Transpose from one key to another
     *
     * @param  string  $text  Text containing chords
     * @param  Key|string  $fromKey  Original key
     * @param  Key|string  $toKey  Target key
     * @return string Text with transposed chords
     */
    public function transposeByKey(string $text, Key|string $fromKey, Key|string $toKey): string
    {
        // Convert string keys to Key enum if needed
        $from = is_string($fromKey) ? Key::from($fromKey) : $fromKey;
        $to = is_string($toKey) ? Key::from($toKey) : $toKey;

        // Calculate semitone difference
        $semitones = $to->chromaticPosition() - $from->chromaticPosition();

        // Determine if we should use sharps or flats based on target key
        $useSharps = ! str_contains($to->value, 'b');

        return $this->transposeText($text, $semitones, $useSharps);
    }

    /**
     * Detect all unique chords in a text
     *
     * @param  string  $text  Text containing chords
     * @return array<string> Array of unique chords found
     */
    public function detectChords(string $text): array
    {
        preg_match_all(self::CHORD_PATTERN, $text, $matches);

        return array_unique($matches[0]);
    }

    /**
     * Calculate the interval (in semitones) between two chords
     *
     * @param  string  $fromChord  Starting chord
     * @param  string  $toChord  Target chord
     * @return int Number of semitones
     */
    public function calculateInterval(string $fromChord, string $toChord): int
    {
        // Extract root notes
        preg_match('/^([A-G][#b]?)/', $fromChord, $fromMatches);
        preg_match('/^([A-G][#b]?)/', $toChord, $toMatches);

        if (! isset($fromMatches[1]) || ! isset($toMatches[1])) {
            return 0;
        }

        $fromPosition = $this->getNotePosition($fromMatches[1]);
        $toPosition = $this->getNotePosition($toMatches[1]);

        $interval = $toPosition - $fromPosition;

        // Normalize to 0-11 range
        if ($interval < 0) {
            $interval += 12;
        }

        return $interval;
    }

    /**
     * Check if a string contains valid chords
     *
     * @param  string  $text  Text to check
     * @return bool True if text contains chords
     */
    public function hasChords(string $text): bool
    {
        return (bool) preg_match(self::CHORD_PATTERN, $text);
    }

    /**
     * Get suggested keys for a piece based on detected chords
     * Analyzes chord progressions to suggest likely keys
     *
     * @param  string  $text  Text containing chords
     * @return array<string> Array of suggested keys (most likely first)
     */
    public function suggestKeys(string $text): array
    {
        $chords = $this->detectChords($text);

        if (empty($chords)) {
            return [];
        }

        // Count root notes
        $rootCounts = [];
        foreach ($chords as $chord) {
            preg_match('/^([A-G][#b]?)/', $chord, $matches);
            if (isset($matches[1])) {
                $root = $matches[1];
                $rootCounts[$root] = ($rootCounts[$root] ?? 0) + 1;
            }
        }

        // Sort by frequency
        arsort($rootCounts);

        // Return top 3 most common roots as suggested keys
        return array_slice(array_keys($rootCounts), 0, 3);
    }
}
