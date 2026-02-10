<?php

namespace App\Domain\Music\Enums;

enum Key: string
{
    // Major Keys
    case C = 'C';
    case C_SHARP = 'C#';
    case D_FLAT = 'Db';
    case D = 'D';
    case D_SHARP = 'D#';
    case E_FLAT = 'Eb';
    case E = 'E';
    case F = 'F';
    case F_SHARP = 'F#';
    case G_FLAT = 'Gb';
    case G = 'G';
    case G_SHARP = 'G#';
    case A_FLAT = 'Ab';
    case A = 'A';
    case A_SHARP = 'A#';
    case B_FLAT = 'Bb';
    case B = 'B';

    // Minor Keys
    case C_MINOR = 'Cm';
    case C_SHARP_MINOR = 'C#m';
    case D_FLAT_MINOR = 'Dbm';
    case D_MINOR = 'Dm';
    case D_SHARP_MINOR = 'D#m';
    case E_FLAT_MINOR = 'Ebm';
    case E_MINOR = 'Em';
    case F_MINOR = 'Fm';
    case F_SHARP_MINOR = 'F#m';
    case G_FLAT_MINOR = 'Gbm';
    case G_MINOR = 'Gm';
    case G_SHARP_MINOR = 'G#m';
    case A_FLAT_MINOR = 'Abm';
    case A_MINOR = 'Am';
    case A_SHARP_MINOR = 'A#m';
    case B_FLAT_MINOR = 'Bbm';
    case B_MINOR = 'Bm';

    /**
     * Get all major keys
     *
     * @return array<Key>
     */
    public static function majors(): array
    {
        return [
            self::C, self::C_SHARP, self::D_FLAT, self::D, self::D_SHARP,
            self::E_FLAT, self::E, self::F, self::F_SHARP, self::G_FLAT,
            self::G, self::G_SHARP, self::A_FLAT, self::A, self::A_SHARP,
            self::B_FLAT, self::B,
        ];
    }

    /**
     * Get all minor keys
     *
     * @return array<Key>
     */
    public static function minors(): array
    {
        return [
            self::C_MINOR, self::C_SHARP_MINOR, self::D_FLAT_MINOR, self::D_MINOR,
            self::D_SHARP_MINOR, self::E_FLAT_MINOR, self::E_MINOR, self::F_MINOR,
            self::F_SHARP_MINOR, self::G_FLAT_MINOR, self::G_MINOR, self::G_SHARP_MINOR,
            self::A_FLAT_MINOR, self::A_MINOR, self::A_SHARP_MINOR, self::B_FLAT_MINOR,
            self::B_MINOR,
        ];
    }

    /**
     * Check if the key is major
     */
    public function isMajor(): bool
    {
        return !str_ends_with($this->value, 'm');
    }

    /**
     * Check if the key is minor
     */
    public function isMinor(): bool
    {
        return str_ends_with($this->value, 'm');
    }

    /**
     * Get the chromatic scale position (0-11)
     */
    public function chromaticPosition(): int
    {
        $root = $this->getRootNote();
        
        return match ($root) {
            'C' => 0,
            'C#', 'Db' => 1,
            'D' => 2,
            'D#', 'Eb' => 3,
            'E' => 4,
            'F' => 5,
            'F#', 'Gb' => 6,
            'G' => 7,
            'G#', 'Ab' => 8,
            'A' => 9,
            'A#', 'Bb' => 10,
            'B' => 11,
            default => 0,
        };
    }

    /**
     * Get the root note without the 'm' suffix
     */
    public function getRootNote(): string
    {
        return rtrim($this->value, 'm');
    }

    /**
     * Transpose by semitones
     */
    public function transpose(int $semitones): self
    {
        $position = $this->chromaticPosition();
        $newPosition = ($position + $semitones) % 12;
        if ($newPosition < 0) {
            $newPosition += 12;
        }

        $chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        $newRoot = $chromaticScale[$newPosition];

        if ($this->isMinor()) {
            $newRoot .= 'm';
        }

        return self::from($newRoot);
    }
}
