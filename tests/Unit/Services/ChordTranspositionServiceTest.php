<?php

namespace Tests\Unit\Services;

use PHPUnit\Framework\TestCase;
use App\Services\Music\ChordTranspositionService;
use App\Domain\Music\Enums\Key;

class ChordTranspositionServiceTest extends TestCase
{
    private ChordTranspositionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ChordTranspositionService();
    }

    public function test_transpose_major_chord_up(): void
    {
        $result = $this->service->transposeChord('C', 2, true);
        $this->assertEquals('D', $result);
    }

    public function test_transpose_minor_chord_up(): void
    {
        $result = $this->service->transposeChord('Am', 3, true);
        $this->assertEquals('Cm', $result);
    }

    public function test_transpose_seventh_chord(): void
    {
        $result = $this->service->transposeChord('G7', 2, true);
        $this->assertEquals('A7', $result);
    }

    public function test_transpose_major_seventh_chord(): void
    {
        $result = $this->service->transposeChord('Cmaj7', 5, true);
        $this->assertEquals('Fmaj7', $result);
    }

    public function test_transpose_minor_seventh_chord(): void
    {
        $result = $this->service->transposeChord('Dm7', 2, true);
        $this->assertEquals('Em7', $result);
    }

    public function test_transpose_suspended_chord(): void
    {
        $result = $this->service->transposeChord('Dsus4', 3, true);
        $this->assertEquals('Fsus4', $result);
    }

    public function test_transpose_slash_chord(): void
    {
        $result = $this->service->transposeChord('C/E', 2, true);
        $this->assertEquals('D/F#', $result);
    }

    public function test_transpose_with_sharps(): void
    {
        $result = $this->service->transposeChord('C', 1, true);
        $this->assertEquals('C#', $result);
    }

    public function test_transpose_with_flats(): void
    {
        $result = $this->service->transposeChord('C', 1, false);
        $this->assertEquals('Db', $result);
    }

    public function test_transpose_down(): void
    {
        $result = $this->service->transposeChord('D', -2, true);
        $this->assertEquals('C', $result);
    }

    public function test_transpose_text_with_multiple_chords(): void
    {
        $text = "C Am F G";
        $result = $this->service->transposeText($text, 2, true);
        $this->assertEquals("D Bm G A", $result);
    }

    public function test_transpose_text_preserves_non_chords(): void
    {
        $text = "Verso 1: C Am F G";
        $result = $this->service->transposeText($text, 2, true);
        $this->assertEquals("Verso 1: D Bm G A", $result);
    }

    public function test_transpose_by_key(): void
    {
        $text = "C Am Dm G";
        $result = $this->service->transposeByKey($text, Key::C, Key::D);
        $this->assertEquals("D Bm Em A", $result);
    }

    public function test_detect_chords(): void
    {
        $text = "C Am F G C Am";
        $chords = $this->service->detectChords($text);
        
        $this->assertCount(4, $chords);
        $this->assertContains('C', $chords);
        $this->assertContains('Am', $chords);
        $this->assertContains('F', $chords);
        $this->assertContains('G', $chords);
    }

    public function test_calculate_interval(): void
    {
        $interval = $this->service->calculateInterval('C', 'G');
        $this->assertEquals(7, $interval);
        
        $interval = $this->service->calculateInterval('C', 'F');
        $this->assertEquals(5, $interval);
    }

    public function test_has_chords_returns_true(): void
    {
        $text = "This is a C major chord";
        $this->assertTrue($this->service->hasChords($text));
    }

    public function test_has_chords_returns_false(): void
    {
        $text = "This is just text without chords";
        $this->assertFalse($this->service->hasChords($text));
    }

    public function test_suggest_keys(): void
    {
        $text = "C Am Dm G C Am F G C";
        $keys = $this->service->suggestKeys($text);
        
        $this->assertNotEmpty($keys);
        $this->assertEquals('C', $keys[0]); // C appears most frequently
    }

    public function test_transpose_wraps_around_octave(): void
    {
        $result = $this->service->transposeChord('C', 12, true);
        $this->assertEquals('C', $result);
        
        $result = $this->service->transposeChord('G', 5, true);
        $this->assertEquals('C', $result);
    }

    public function test_transpose_diminished_chord(): void
    {
        $result = $this->service->transposeChord('Bdim', 1, true);
        $this->assertEquals('Cdim', $result);
    }

    public function test_transpose_augmented_chord(): void
    {
        $result = $this->service->transposeChord('Caug', 3, true);
        $this->assertEquals('D#aug', $result);
    }

    public function test_transpose_add9_chord(): void
    {
        $result = $this->service->transposeChord('Dadd9', 2, true);
        $this->assertEquals('Eadd9', $result);
    }
}

