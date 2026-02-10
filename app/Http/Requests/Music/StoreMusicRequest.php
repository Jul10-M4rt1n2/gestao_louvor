<?php

namespace App\Http\Requests\Music;

use Illuminate\Foundation\Http\FormRequest;

class StoreMusicRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'genre' => 'nullable|string|max:255',
            'original_key' => 'nullable|string|max:5',
            'bpm' => 'nullable|integer|min:1|max:300',
            'lyrics' => 'nullable|string',
            'chords_text' => 'nullable|string',
            'notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
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
            'title.required' => 'O título da música é obrigatório.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',
            'artist.max' => 'O nome do artista não pode ter mais de 255 caracteres.',
            'genre.max' => 'O gênero não pode ter mais de 255 caracteres.',
            'original_key.max' => 'A tonalidade não pode ter mais de 5 caracteres.',
            'bpm.integer' => 'O BPM deve ser um número inteiro.',
            'bpm.min' => 'O BPM deve ser no mínimo 1.',
            'bpm.max' => 'O BPM deve ser no máximo 300.',
            'file.file' => 'O arquivo enviado deve ser válido.',
            'file.mimes' => 'O arquivo deve ser PDF, DOC ou DOCX.',
            'file.max' => 'O arquivo não pode ter mais de 10MB.',
        ];
    }
}
