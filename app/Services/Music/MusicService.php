<?php

namespace App\Services\Music;

use App\Models\Music;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MusicService
{
    public function __construct(
        private readonly ChordTranspositionService $transpositionService
    ) {}

    /**
     * Get paginated list of musics for an organization.
     */
    public function getPaginated(
        int $organizationId,
        ?string $search = null,
        ?string $genre = null,
        ?string $key = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = Music::where('organization_id', $organizationId)
            ->where('active', true)
            ->with(['creator:id,name', 'organization:id,name']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('artist', 'like', "%{$search}%")
                    ->orWhere('genre', 'like', "%{$search}%");
            });
        }

        if ($genre) {
            $query->where('genre', $genre);
        }

        if ($key) {
            $query->where('original_key', $key);
        }

        return $query->orderBy('title')
            ->paginate($perPage);
    }

    /**
     * Get all genres for an organization.
     */
    public function getGenres(int $organizationId): Collection
    {
        return Music::where('organization_id', $organizationId)
            ->where('active', true)
            ->whereNotNull('genre')
            ->distinct()
            ->pluck('genre')
            ->sort()
            ->values();
    }

    /**
     * Create a new music.
     */
    public function create(array $data, User $user): Music
    {
        DB::beginTransaction();
        try {
            $music = Music::create([
                'title' => $data['title'],
                'artist' => $data['artist'] ?? null,
                'genre' => $data['genre'] ?? null,
                'original_key' => $data['original_key'] ?? null,
                'bpm' => $data['bpm'] ?? null,
                'lyrics' => $data['lyrics'] ?? null,
                'chords_text' => $data['chords_text'] ?? null,
                'notes' => $data['notes'] ?? null,
                'active' => true,
                'organization_id' => $user->organization_id,
                'created_by' => $user->id,
            ]);

            // Handle file upload if present
            if (isset($data['file'])) {
                $this->handleFileUpload($music, $data['file']);
            }

            DB::commit();
            return $music->fresh(['creator', 'organization']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing music.
     */
    public function update(Music $music, array $data): Music
    {
        DB::beginTransaction();
        try {
            $music->update([
                'title' => $data['title'] ?? $music->title,
                'artist' => $data['artist'] ?? $music->artist,
                'genre' => $data['genre'] ?? $music->genre,
                'original_key' => $data['original_key'] ?? $music->original_key,
                'bpm' => $data['bpm'] ?? $music->bpm,
                'lyrics' => $data['lyrics'] ?? $music->lyrics,
                'chords_text' => $data['chords_text'] ?? $music->chords_text,
                'notes' => $data['notes'] ?? $music->notes,
            ]);

            // Handle new file upload if present
            if (isset($data['file'])) {
                // Delete old file if exists
                if ($music->file_path) {
                    Storage::disk('public')->delete($music->file_path);
                }
                $this->handleFileUpload($music, $data['file']);
            }

            DB::commit();
            return $music->fresh(['creator', 'organization']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a music (soft delete by setting active to false).
     */
    public function delete(Music $music): bool
    {
        return $music->update(['active' => false]);
    }

    /**
     * Permanently delete a music and its file.
     */
    public function forceDelete(Music $music): bool
    {
        DB::beginTransaction();
        try {
            // Delete file if exists
            if ($music->file_path) {
                Storage::disk('public')->delete($music->file_path);
            }

            $music->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Transpose a music to a new key.
     */
    public function transpose(Music $music, string $fromKey, string $toKey): array
    {
        $transposedLyrics = null;
        $transposedChords = null;

        if ($music->lyrics) {
            $transposedLyrics = $this->transpositionService->transposeByKey(
                $music->lyrics,
                \App\Domain\Music\Enums\Key::from($fromKey),
                \App\Domain\Music\Enums\Key::from($toKey)
            );
        }

        if ($music->chords_text) {
            $transposedChords = $this->transpositionService->transposeByKey(
                $music->chords_text,
                \App\Domain\Music\Enums\Key::from($fromKey),
                \App\Domain\Music\Enums\Key::from($toKey)
            );
        }

        return [
            'lyrics' => $transposedLyrics,
            'chords_text' => $transposedChords,
            'original_key' => $fromKey,
            'transposed_key' => $toKey,
        ];
    }

    /**
     * Get chords detected in a music.
     */
    public function getChords(Music $music): array
    {
        $text = $music->lyrics ?? $music->chords_text ?? '';
        return $this->transpositionService->detectChords($text);
    }

    /**
     * Search musics using full-text search (if supported by database).
     */
    public function search(int $organizationId, string $query, int $perPage = 15): LengthAwarePaginator
    {
        return Music::where('organization_id', $organizationId)
            ->where('active', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('artist', 'like', "%{$query}%")
                    ->orWhere('genre', 'like', "%{$query}%")
                    ->orWhere('lyrics', 'like', "%{$query}%");
            })
            ->with(['creator:id,name', 'organization:id,name'])
            ->orderBy('title')
            ->paginate($perPage);
    }

    /**
     * Handle file upload for a music.
     */
    private function handleFileUpload(Music $music, $file): void
    {
        $extension = $file->getClientOriginalExtension();
        $filename = time() . '_' . $music->id . '.' . $extension;
        $path = $file->storeAs('musics', $filename, 'public');

        $music->update([
            'file_path' => $path,
            'file_type' => $extension,
        ]);
    }
}
