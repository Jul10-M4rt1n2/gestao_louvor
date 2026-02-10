<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'schedule_frequency' => $this->schedule_frequency,
            'meeting_days' => $this->meeting_days,
            'active' => $this->active,
            'ministry' => $this->whenLoaded('ministry', function () {
                return [
                    'id' => $this->ministry->id,
                    'name' => $this->ministry->name,
                    'slug' => $this->ministry->slug,
                    'icon' => $this->ministry->icon,
                    'color' => $this->ministry->color,
                ];
            }),
            'members_count' => $this->whenLoaded('users', function () {
                return $this->users->count();
            }),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
            'updated_at' => $this->updated_at?->format('d/m/Y H:i'),
        ];
    }
}
