export default function ChordDiagram({ chord, size = 'medium' }) {
    const sizes = {
        small: { width: 120, height: 160, scale: 0.6 },
        medium: { width: 200, height: 240, scale: 1 },
        large: { width: 300, height: 360, scale: 1.5 },
    };

    const { width, height, scale } = sizes[size] || sizes.medium;
    
    const stringSpacing = 30 * scale;
    const fretSpacing = 40 * scale;
    const startX = 40 * scale;
    const startY = 40 * scale;
    const numStrings = 6;
    const numFrets = 5;

    if (!chord || !chord.guitar) {
        return <div className="text-gray-400">Diagrama não disponível</div>;
    }

    const { string, fret: baseFret, fingers } = chord.guitar;

    const renderFingerPosition = (stringIndex, fretPosition, finger) => {
        if (fretPosition === 0 || fretPosition === 'o' || fretPosition === 'x') {
            return null;
        }

        const x = startX + (stringIndex * stringSpacing);
        const relativeFret = fretPosition - (baseFret > 0 ? baseFret - 1 : 0);
        const y = startY + (relativeFret - 0.5) * fretSpacing;

        return (
            <g key={`finger-${stringIndex}`}>
                <circle
                    cx={x}
                    cy={y}
                    r={10 * scale}
                    fill="#1f2937"
                />
                {finger && finger !== 'o' && finger !== 'x' && (
                    <text
                        x={x}
                        y={y + (4 * scale)}
                        textAnchor="middle"
                        fontSize={12 * scale}
                        fill="white"
                        fontWeight="bold"
                    >
                        {finger}
                    </text>
                )}
            </g>
        );
    };

    const renderOpenOrMuted = (stringIndex, fretPosition, finger) => {
        const x = startX + (stringIndex * stringSpacing);
        const y = startY - (20 * scale);

        if (fretPosition === 0 || finger === 'o') {
            return (
                <circle
                    key={`open-${stringIndex}`}
                    cx={x}
                    cy={y}
                    r={8 * scale}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={2 * scale}
                />
            );
        }

        if (finger === 'x') {
            return (
                <g key={`muted-${stringIndex}`}>
                    <line
                        x1={x - (6 * scale)}
                        y1={y - (6 * scale)}
                        x2={x + (6 * scale)}
                        y2={y + (6 * scale)}
                        stroke="#ef4444"
                        strokeWidth={2 * scale}
                    />
                    <line
                        x1={x - (6 * scale)}
                        y1={y + (6 * scale)}
                        x2={x + (6 * scale)}
                        y2={y - (6 * scale)}
                        stroke="#ef4444"
                        strokeWidth={2 * scale}
                    />
                </g>
            );
        }

        return null;
    };

    return (
        <svg width={width} height={height} className="mx-auto">
            {/* Chord name */}
            <text
                x={width / 2}
                y={20 * scale}
                textAnchor="middle"
                fontSize={16 * scale}
                fontWeight="bold"
                fill="#1f2937"
            >
                {chord.name}
            </text>

            {/* Fret number indicator */}
            {baseFret > 0 && (
                <text
                    x={startX - (25 * scale)}
                    y={startY + (fretSpacing * 0.5)}
                    fontSize={14 * scale}
                    fill="#6b7280"
                >
                    {baseFret}
                </text>
            )}

            {/* Strings (vertical lines) */}
            {[...Array(numStrings)].map((_, i) => (
                <line
                    key={`string-${i}`}
                    x1={startX + (i * stringSpacing)}
                    y1={startY}
                    x2={startX + (i * stringSpacing)}
                    y2={startY + (numFrets * fretSpacing)}
                    stroke="#6b7280"
                    strokeWidth={1.5}
                />
            ))}

            {/* Frets (horizontal lines) */}
            {[...Array(numFrets + 1)].map((_, i) => (
                <line
                    key={`fret-${i}`}
                    x1={startX}
                    y1={startY + (i * fretSpacing)}
                    x2={startX + ((numStrings - 1) * stringSpacing)}
                    y2={startY + (i * fretSpacing)}
                    stroke="#1f2937"
                    strokeWidth={i === 0 && baseFret === 0 ? 4 : 2}
                />
            ))}

            {/* Open/Muted indicators */}
            {string.map((fret, index) => renderOpenOrMuted(index, fret, fingers[index]))}

            {/* Finger positions */}
            {string.map((fret, index) => renderFingerPosition(index, fret, fingers[index]))}
        </svg>
    );
}
