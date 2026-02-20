<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Music>
 */
class MusicFactory extends Factory
{
    public function definition(): array
    {
        $keys = [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B',
            'Cm',
            'Dm',
            'Em',
            'Fm',
            'Gm',
            'Am',
            'Bm'
        ];

        $genres = ['Adoração', 'Gospel', 'Louvor', 'Worship', 'Contemporâneo', 'Hino', 'CCM'];

        $titles = [
            'Grande é o Senhor',
            'Quão Grande é o Meu Deus',
            'Canta oh Minha Alma',
            'Goodness of God',
            'Way Maker',
            'Reckless Love',
            'What a Beautiful Name',
            'Oceans',
            'Blessed Be Your Name',
            'How Great Is Our God',
            'Ninguém Explica Deus',
            'Lugar Secreto',
            'Eu Me Rendo',
            'A Casa é Sua',
            'Meu Deus é Fiel',
            'Santo Espírito',
            'Yeshua',
            'Raridade',
            'Deus de Promessas',
            'Ousado Amor',
            'Teu Santo Nome',
            'Fiel a Mim',
            'Bondade de Deus',
            'Me Atraiu',
            'Creio em Ti',
            'Oceanos',
            'Aquieta Minh\'alma',
            'Sou Feliz',
            'Canção do Céu',
            'Vim Para Adorar-te',
        ];

        $artists = [
            'Hillsong',
            'Bethel Music',
            'Elevation Worship',
            'Aline Barros',
            'Fernandinho',
            'Gabriela Rocha',
            'Diante do Trono',
            'David Quinlan',
            'Priscilla Alcantara',
            'Thalles Roberto',
            'André Valadão',
            'Laura Souguellis',
            'Casa Worship',
            'Central 3',
            'Morada',
            'Alessandro Vilas Boas',
            'Ana Nóbrega',
            'Isadora Pompeo',
        ];

        $sampleLyrics = <<<EOT
[Intro]
C  G  Am  F

[Verso 1]
C                G
Quão grande é o meu Deus
Am              F
Cantarei quão grande é o meu Deus
C                G
E todos verão como é grande
Am        F
O meu Deus

[Refrão]
C        G
Grande é o Senhor
Am       F
Digno de louvor
C           G
A Ele toda honra e glória
Am      F
Ao Rei dos reis

[Verso 2]
C                  G
Idade alguma poderá conter
Am                F
Quão grande é o meu Deus
EOT;

        return [
            'title' => fake()->randomElement($titles),
            'artist' => fake()->randomElement($artists),
            'genre' => fake()->randomElement($genres),
            'original_key' => fake()->randomElement($keys),
            'bpm' => fake()->numberBetween(60, 180),
            'lyrics' => $sampleLyrics,
            'chords_text' => 'C G Am F',
            'notes' => fake()->optional(0.3)->sentence(6),
            'active' => fake()->boolean(95),
            'organization_id' => Organization::factory(),
            'created_by' => User::factory(),
        ];
    }
}
