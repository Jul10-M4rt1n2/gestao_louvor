<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'description' => $this->description,
            'scheduled_at' => $this->scheduled_at?->format('d/m/Y H:i'),
            'scheduled_at_iso' => $this->scheduled_at?->toIso8601String(),
            'duration' => $this->duration?->format('H:i:s'),
            'location' => $this->location,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'group' => $this->when($this->relationLoaded('group'), function () {
                return [
                    'id' => $this->group->id,
                    'name' => $this->group->name,
                ];
            }),
            'organization' => $this->when($this->relationLoaded('organization'), function () {
                return [
                    'id' => $this->organization->id,
                    'name' => $this->organization->name,
                ];
            }),
            'participants' => $this->when($this->relationLoaded('participants'), function () {
                return $this->participants->map(function ($participant) {
                    return [
                        'id' => $participant->id,
                        'status' => $participant->status,
                        'notes' => $participant->notes,
                        'confirmed_at' => $participant->confirmed_at?->format('d/m/Y H:i'),
                        'user' => [
                            'id' => $participant->user->id,
                            'name' => $participant->user->name,
                            'email' => $participant->user->email,
                        ],
                        'function' => $participant->function ? [
                            'id' => $participant->function->id,
                            'name' => $participant->function->name,
                        ] : null,
                    ];
                });
            }),
            'musics' => $this->when($this->relationLoaded('musics'), function () {
                return $this->musics->map(function ($music) {
                    return [
                        'id' => $music->id,
                        'title' => $music->title,
                        'artist' => $music->artist,
                        'original_key' => $music->original_key,
                        'pivot' => [
                            'id' => $music->pivot->id,
                            'custom_key' => $music->pivot->custom_key,
                            'order' => $music->pivot->order,
                            'notes' => $music->pivot->notes,
                        ],
                    ];
                });
            }),
            'participants_count' => $this->when($this->relationLoaded('participants'), $this->participants->count()),
            'confirmed_participants_count' => $this->when(
                $this->relationLoaded('participants'),
                $this->participants->where('status', 'confirmado')->count()
            ),
            'musics_count' => $this->when($this->relationLoaded('musics'), $this->musics->count()),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
            'updated_at' => $this->updated_at?->format('d/m/Y H:i'),
        ];
    }

    /**
     * Get human-readable status label.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'planejada' => 'Planejada',
            'confirmada' => 'Confirmada',
            'em_andamento' => 'Em Andamento',
            'concluida' => 'Concluída',
            'cancelada' => 'Cancelada',
            default => $this->status,
        };
    }
}
