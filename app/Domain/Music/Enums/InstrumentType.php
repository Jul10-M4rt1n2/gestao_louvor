<?php

namespace App\Domain\Music\Enums;

enum InstrumentType: string
{
    case GUITAR = 'guitar';
    case KEYBOARD = 'keyboard';
    case UKULELE = 'ukulele';
    case BASS = 'bass';

    /**
     * Get standard tuning for the instrument
     *
     * @return array<string>
     */
    public function getStandardTuning(): array
    {
        return match ($this) {
            self::GUITAR => ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
            self::BASS => ['E1', 'A1', 'D2', 'G2'],
            self::UKULELE => ['G4', 'C4', 'E4', 'A4'],
            self::KEYBOARD => [], // Piano doesn't have tuning strings
        };
    }

    /**
     * Get standard tuning frequencies in Hz
     *
     * @return array<float>
     */
    public function getStandardFrequencies(): array
    {
        return match ($this) {
            self::GUITAR => [82.41, 110.00, 146.83, 196.00, 246.94, 329.63],
            self::BASS => [41.20, 55.00, 73.42, 98.00],
            self::UKULELE => [196.00, 261.63, 329.63, 440.00],
            self::KEYBOARD => [],
        };
    }
}
