<?php

namespace App\Domain\Music\Enums;

enum ChordType: string
{
    case MAJOR = 'major';
    case MINOR = 'minor';
    case DIMINISHED = 'dim';
    case AUGMENTED = 'aug';
    case SEVENTH = '7';
    case MAJOR_SEVENTH = 'maj7';
    case MINOR_SEVENTH = 'm7';
    case MINOR_MAJOR_SEVENTH = 'mMaj7';
    case DIMINISHED_SEVENTH = 'dim7';
    case HALF_DIMINISHED = 'm7b5';
    case AUGMENTED_SEVENTH = 'aug7';
    case SUSPENDED_SECOND = 'sus2';
    case SUSPENDED_FOURTH = 'sus4';
    case SIXTH = '6';
    case MINOR_SIXTH = 'm6';
    case NINTH = '9';
    case MAJOR_NINTH = 'maj9';
    case MINOR_NINTH = 'm9';
    case ELEVENTH = '11';
    case THIRTEENTH = '13';
    case ADD_NINE = 'add9';
    case ADD_TWO = 'add2';

    /**
     * Check if the chord is a major type
     */
    public function isMajor(): bool
    {
        return in_array($this, [
            self::MAJOR,
            self::MAJOR_SEVENTH,
            self::MAJOR_NINTH,
            self::SIXTH,
        ]);
    }

    /**
     * Check if the chord is a minor type
     */
    public function isMinor(): bool
    {
        return in_array($this, [
            self::MINOR,
            self::MINOR_SEVENTH,
            self::MINOR_SIXTH,
            self::MINOR_NINTH,
            self::MINOR_MAJOR_SEVENTH,
        ]);
    }

    /**
     * Check if the chord has a seventh
     */
    public function hasSeventh(): bool
    {
        return str_contains($this->value, '7');
    }

    /**
     * Check if the chord is suspended
     */
    public function isSuspended(): bool
    {
        return str_contains($this->value, 'sus');
    }
}
