<?php

namespace App\Services\Music;

use Exception;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

/**
 * Service for parsing and extracting text from PDF and DOCX files.
 * 
 * This service handles:
 * - PDF text extraction using smalot/pdfparser
 * - DOCX text extraction using phpoffice/phpword
 * - Post-processing to separate chords from lyrics
 * - Error handling and logging
 */
class FileParserService
{
    /**
     * Extract text from a PDF file.
     *
     * @param string $filePath Full path to the PDF file
     * @return array{text: string, success: bool, error: string|null}
     */
    public function extractFromPdf(string $filePath): array
    {
        try {
            if (! file_exists($filePath)) {
                return [
                    'text' => '',
                    'success' => false,
                    'error' => 'File not found',
                ];
            }

            $parser = new PdfParser();
            $pdf = $parser->parseFile($filePath);
            $text = $pdf->getText();

            // Clean up the extracted text
            $cleanText = $this->cleanExtractedText($text);

            return [
                'text' => $cleanText,
                'success' => true,
                'error' => null,
            ];
        } catch (Exception $e) {
            Log::error('PDF extraction failed', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);

            return [
                'text' => '',
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Extract text from a DOCX file.
     *
     * @param string $filePath Full path to the DOCX file
     * @return array{text: string, success: bool, error: string|null}
     */
    public function extractFromDocx(string $filePath): array
    {
        try {
            if (! file_exists($filePath)) {
                return [
                    'text' => '',
                    'success' => false,
                    'error' => 'File not found',
                ];
            }

            $phpWord = IOFactory::load($filePath);
            $text = '';

            foreach ($phpWord->getSections() as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    // Get text from different element types
                    if (method_exists($element, 'getText')) {
                        $text .= $element->getText()."\n";
                    } elseif (method_exists($element, 'getElements')) {
                        // Handle nested elements (like tables)
                        foreach ($element->getElements() as $childElement) {
                            if (method_exists($childElement, 'getText')) {
                                $text .= $childElement->getText()."\n";
                            }
                        }
                    }
                }
            }

            // Clean up the extracted text
            $cleanText = $this->cleanExtractedText($text);

            return [
                'text' => $cleanText,
                'success' => true,
                'error' => null,
            ];
        } catch (Exception $e) {
            Log::error('DOCX extraction failed', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);

            return [
                'text' => '',
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Extract text from DOC file (older Word format).
     * Note: DOC files are more complex and may require additional libraries.
     * For now, we attempt to read as text or return an error message.
     *
     * @param string $filePath Full path to the DOC file
     * @return array{text: string, success: bool, error: string|null}
     */
    public function extractFromDoc(string $filePath): array
    {
        try {
            if (! file_exists($filePath)) {
                return [
                    'text' => '',
                    'success' => false,
                    'error' => 'File not found',
                ];
            }

            // Try to load as DOCX (some .doc files are actually DOCX)
            try {
                return $this->extractFromDocx($filePath);
            } catch (Exception $e) {
                // If that fails, provide a helpful message
                return [
                    'text' => '',
                    'success' => false,
                    'error' => 'Old DOC format not fully supported. Please convert to DOCX or PDF.',
                ];
            }
        } catch (Exception $e) {
            Log::error('DOC extraction failed', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);

            return [
                'text' => '',
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Extract text from a file based on its extension.
     *
     * @param string $filePath Full path to the file
     * @param string|null $extension File extension (auto-detected if null)
     * @return array{text: string, success: bool, error: string|null}
     */
    public function extractFromFile(string $filePath, ?string $extension = null): array
    {
        if ($extension === null) {
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        }

        return match ($extension) {
            'pdf' => $this->extractFromPdf($filePath),
            'docx' => $this->extractFromDocx($filePath),
            'doc' => $this->extractFromDoc($filePath),
            default => [
                'text' => '',
                'success' => false,
                'error' => "Unsupported file type: {$extension}",
            ],
        };
    }

    /**
     * Clean up extracted text by removing excessive whitespace and normalizing line breaks.
     *
     * @param string $text Raw extracted text
     * @return string Cleaned text
     */
    private function cleanExtractedText(string $text): string
    {
        // Normalize line breaks
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Remove excessive blank lines (more than 2 consecutive)
        $text = preg_replace("/\n{3,}/", "\n\n", $text);

        // Trim whitespace from each line
        $lines = explode("\n", $text);
        $lines = array_map('trim', $lines);
        $text = implode("\n", $lines);

        // Trim overall text
        return trim($text);
    }

    /**
     * Attempt to separate chords from lyrics in extracted text.
     * This is a heuristic approach that looks for lines that contain mostly chord notation.
     *
     * @param string $text Extracted text
     * @return array{lyrics: string, chords: string, combined: string}
     */
    public function separateChordsAndLyrics(string $text): array
    {
        $lines = explode("\n", $text);
        $chordLines = [];
        $lyricLines = [];
        $combined = [];

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            if (empty($trimmedLine)) {
                $combined[] = '';

                continue;
            }

            // Heuristic: if line has many chord patterns and few words, it's likely a chord line
            if ($this->isLikelyChordLine($trimmedLine)) {
                $chordLines[] = $trimmedLine;
                $combined[] = $trimmedLine;
            } else {
                $lyricLines[] = $trimmedLine;
                $combined[] = $trimmedLine;
            }
        }

        return [
            'lyrics' => implode("\n", $lyricLines),
            'chords' => implode(' ', $chordLines),
            'combined' => implode("\n", $combined),
        ];
    }

    /**
     * Determine if a line is likely to contain chord notation.
     *
     * @param string $line Line of text to analyze
     * @return bool True if line appears to be chord notation
     */
    private function isLikelyChordLine(string $line): bool
    {
        // Pattern for chord notation: A-G followed by modifiers (m, maj, 7, etc.)
        $chordPattern = '/\b[A-G][#b]?(m|maj|min|dim|aug|sus[24]|add)?[0-9]*(\/[A-G][#b]?)?\b/';

        preg_match_all($chordPattern, $line, $matches);
        $chordCount = count($matches[0]);

        // Split line into words
        $words = preg_split('/\s+/', $line);
        $wordCount = count($words);

        // If more than 50% of words are chords, it's likely a chord line
        return $wordCount > 0 && ($chordCount / $wordCount) > 0.5;
    }
}
