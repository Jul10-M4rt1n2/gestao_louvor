<?php

namespace App\Http\Requests\Scale;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'type' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'scheduled_at' => 'sometimes|required|date',
            'duration' => 'nullable|date_format:H:i:s',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|in:planejada,confirmada,em_andamento,concluida,cancelada',
            'group_id' => 'sometimes|required|exists:groups,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título da escala é obrigatório.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',
            'type.max' => 'O tipo não pode ter mais de 100 caracteres.',
            'scheduled_at.required' => 'A data e hora são obrigatórias.',
            'scheduled_at.date' => 'A data e hora devem ser válidas.',
            'duration.date_format' => 'A duração deve estar no formato HH:MM:SS.',
            'location.max' => 'O local não pode ter mais de 255 caracteres.',
            'status.in' => 'O status deve ser: planejada, confirmada, em andamento, concluída ou cancelada.',
            'group_id.required' => 'O grupo é obrigatório.',
            'group_id.exists' => 'O grupo selecionado não existe.',
        ];
    }
}
