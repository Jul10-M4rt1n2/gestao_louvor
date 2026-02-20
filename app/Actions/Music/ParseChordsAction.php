<?php

namespace App\Actions\Music;

use App\Domain\Music\Enums\Key;

/**
 * Action for parsing and detecting chords in text.
 * 
 * This action provides single-responsibility functionality for:
 * - Detecting chords in plain text
 * - Extracting unique chords from text
 * - Identifying chord progressions
 * - Validating chord notation
 */
class ParseChordsAction
{
    /**
     * Regular expression pattern for matching chord notation.
     * Matches: C, Cm, C#, Cmaj7, Dsus4, G/B, etc.
     */
    private const CHORD_PATTERN = '/\b([A-G][#b]?)(m|maj|min|dim|aug|sus[24]|add)?([0-9]+)?(\/[A-G][#b]?)?\b/';

    /**
     * Parse text and extract all chord matches with their positions.
     *
     * @param string $text Text to parse for chords
     * @return array{chord: string, position: int}[]
     */
    public function execute(string $text): array
    {
        if (empty($text)) {
            return [];
        }

        preg_match_all(self::CHORD_PATTERN, $text, $matches, PREG_OFFSET_CAPTURE);

        $chords = [];
        foreach ($matches[0] as $match) {
            $chordText = $match[0];
            $position = $match[1];

            // Validate that it's actually a chord (not just a letter)
            if ($this->isValidChord($chordText)) {
                $chords[] = [
                    'chord' => $chordText,
                    'position' => $position,
                ];
            }
        }

        return $chords;
    }

    /**
     * Extract unique chords from text (without positions).
     *
     * @param string $text Text to parse for chords
     * @return string[] Array of unique chord names
     */
    public function extractUniqueChords(string $text): array
    {
        $allChords = $this->execute($text);
        $uniqueChords = [];

        foreach ($allChords as $chordData) {
            $chord = $chordData['chord'];
            if (! in_array($chord, $uniqueChords)) {
                $uniqueChords[] = $chord;
            }
        }

        return $uniqueChords;
    }

    /**
     * Count occurrences of each chord in text.
     *
     * @param string $text Text to parse for chords
     * @return array<string, int> Associative array of chord => count
     */
    public function countChords(string $text): array
    {
        $allChords = $this->execute($text);
        $counts = [];

        foreach ($allChords as $chordData) {
            $chord = $chordData['chord'];
            if (! isset($counts[$chord])) {
                $counts[$chord] = 0;
            }
            $counts[$chord]++;
        }

        // Sort by frequency (most common first)
        arsort($counts);

        return $counts;
    }

    /**
     * Detect chord progressions (sequences of chords).
     *
     * @param string $text Text to parse for chord progressions
     * @return string[][] Array of chord progressions (arrays of chord sequences)
     */
    public function detectProgressions(string $text): array
    {
        $lines = explode("\n", $text);
        $progressions = [];

        foreach ($lines as $line) {
            $lineChords = $this->extractUniqueChords($line);

            // Only consider lines with 2 or more chords as progressions
            if (count($lineChords) >= 2) {
                $progressions[] = $lineChords;
            }
        }

        return $progressions;
    }

    /**
     * Identify the most likely key based on chord usage.
     * This is a heuristic approach based on common chord progressions.
     *
     * @param string $text Text containing chords
     * @return string|null Most likely key, or null if cannot determine
     */
    public function suggestKey(string $text): ?string
    {
        $chordCounts = $this->countChords($text);

        if (empty($chordCounts)) {
            return null;
        }

        // Get the most frequent chord
        $mostFrequent = array_key_first($chordCounts);

        // Extract root note from the chord
        preg_match('/^([A-G][#b]?)/', $mostFrequent, $matches);
        $rootNote = $matches[1] ?? null;

        if (! $rootNote) {
            return null;
        }

        // Check if most frequent chord is minor
        $isMinor = str_contains($mostFrequent, 'm') && ! str_contains($mostFrequent, 'maj');

        // Return suggested key
        return $isMinor ? $rootNote.'m' : $rootNote;
    }

    /**
     * Validate if a string is a valid chord notation.
     *
     * @param string $chord Chord notation to validate
     * @return bool True if valid chord
     */
    public function isValidChord(string $chord): bool
    {
        // Must match our chord pattern
        if (! preg_match('/^'.self::CHORD_PATTERN.'$/', $chord)) {
            return false;
        }

        // Extract root note
        preg_match('/^([A-G][#b]?)/', $chord, $matches);
        $rootNote = $matches[1] ?? '';

        // Validate root note is in valid musical range
        $validRoots = ['A', 'A#', 'Ab', 'B', 'Bb', 'C', 'C#', 'D', 'D#', 'Db', 'E', 'Eb', 'F', 'F#', 'G', 'G#', 'Gb'];

        return in_array($rootNote, $validRoots);
    }

    /**
     * Replace chords in text with transposed versions.
     * This delegates to ChordTranspositionService but operates on the text level.
     *
     * @param string $text Text containing chords
     * @param callable $transposeCallback Callback function to transpose each chord
     * @return string Text with transposed chords
     */
    public function replaceChords(string $text, callable $transposeCallback): string
    {
        return preg_replace_callback(
            self::CHORD_PATTERN,
            function ($matches) use ($transposeCallback) {
                $originalChord = $matches[0];

                if (! $this->isValidChord($originalChord)) {
                    return $originalChord;
                }

                return $transposeCallback($originalChord);
            },
            $text
        );
    }

    /**
     * Separate chord lines from lyric lines in text.
     *
     * @param string $text Text with mixed chords and lyrics
     * @return array{chordLines: string[], lyricLines: string[], allLines: array}
     */
    public function separateChordLines(string $text): array
    {
        $lines = explode("\n", $text);
        $chordLines = [];
        $lyricLines = [];
        $allLines = [];

        foreach ($lines as $index => $line) {
            $trimmedLine = trim($line);

            if (empty($trimmedLine)) {
                $allLines[] = ['type' => 'empty', 'content' => ''];

                continue;
            }

            // Count chords and words in line
            $chords = $this->extractUniqueChords($trimmedLine);
            $words = preg_split('/\s+/', $trimmedLine);
            $wordCount = count($words);
            $chordCount = count($chords);

            // If more than 40% of words are chords, classify as chord line
            $isChordLine = $wordCount > 0 && ($chordCount / $wordCount) >= 0.4;

            if ($isChordLine) {
                $chordLines[] = $trimmedLine;
                $allLines[] = ['type' => 'chords', 'content' => $trimmedLine];
            } else {
                $lyricLines[] = $trimmedLine;
                $allLines[] = ['type' => 'lyrics', 'content' => $trimmedLine];
            }
        }

        return [
            'chordLines' => $chordLines,
            'lyricLines' => $lyricLines,
            'allLines' => $allLines,
        ];
    }

    /**
     * Format text with chords above lyrics.
     *
     * @param string $text Text to format
     * @return string Formatted text with chords positioned above lyrics
     */
    public function formatChordsAboveLyrics(string $text): string
    {
        $separated = $this->separateChordLines($text);
        $formatted = [];

        foreach ($separated['allLines'] as $line) {
            if ($line['type'] === 'chords') {
                $formatted[] = $line['content'];
            } elseif ($line['type'] === 'lyrics') {
                $formatted[] = $line['content'];
            } else {
                $formatted[] = '';
            }
        }

        return implode("\n", $formatted);
    }
}
