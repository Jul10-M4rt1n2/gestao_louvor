<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'ministry_id' => 'sometimes|required|exists:ministries,id',
            'schedule_frequency' => 'nullable|string|max:255',
            'meeting_days' => 'nullable|array',
            'active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do grupo é obrigatório.',
            'name.max' => 'O nome não pode ter mais de 255 caracteres.',
            'ministry_id.required' => 'O ministério é obrigatório.',
            'ministry_id.exists' => 'Ministério inválido.',
            'schedule_frequency.max' => 'A frequência de ensaio não pode ter mais de 255 caracteres.',
            'meeting_days.array' => 'Os dias de ensaio devem ser um array.',
            'active.boolean' => 'O status ativo deve ser verdadeiro ou falso.',
        ];
    }
}
