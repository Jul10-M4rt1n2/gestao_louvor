import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect, useRef } from 'react';

export default function Tuner() {
    const [isActive, setIsActive] = useState(false);
    const [note, setNote] = useState('--');
    const [frequency, setFrequency] = useState(0);
    const [cents, setCents] = useState(0);
    const [error, setError] = useState('');
    
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const microphone = useRef(null);
    const animationFrame = useRef(null);

    const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const startTuner = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            analyser.current = audioContext.current.createAnalyser();
            microphone.current = audioContext.current.createMediaStreamSource(stream);
            
            analyser.current.fftSize = 4096;
            microphone.current.connect(analyser.current);
            
            setIsActive(true);
            detectPitch();
        } catch (err) {
            setError('Não foi possível acessar o microfone. Permita o acesso ao microfone.');
            console.error('Error accessing microphone:', err);
        }
    };

    const stopTuner = () => {
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        
        if (microphone.current && microphone.current.mediaStream) {
            microphone.current.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        if (audioContext.current) {
            audioContext.current.close();
        }
        
        setIsActive(false);
        setNote('--');
        setFrequency(0);
        setCents(0);
    };

    const detectPitch = () => {
        const bufferLength = analyser.current.fftSize;
        const buffer = new Float32Array(bufferLength);
        
        const updatePitch = () => {
            analyser.current.getFloatTimeDomainData(buffer);
            
            const detectedFrequency = autoCorrelate(buffer, audioContext.current.sampleRate);
            
            if (detectedFrequency > 0) {
                const noteInfo = frequencyToNote(detectedFrequency);
                setNote(noteInfo.note);
                setFrequency(Math.round(detectedFrequency * 10) / 10);
                setCents(noteInfo.cents);
            }
            
            animationFrame.current = requestAnimationFrame(updatePitch);
        };
        
        updatePitch();
    };

    const autoCorrelate = (buffer, sampleRate) => {
        let size = buffer.length;
        let maxSamples = Math.floor(size / 2);
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        
        for (let i = 0; i < size; i++) {
            let val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / size);
        
        if (rms < 0.01) return -1;
        
        let lastCorrelation = 1;
        for (let offset = 1; offset < maxSamples; offset++) {
            let correlation = 0;
            for (let i = 0; i < maxSamples; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }
            correlation = 1 - (correlation / maxSamples);
            
            if (correlation > 0.9 && correlation > lastCorrelation) {
                let foundGoodCorrelation = false;
                if (correlation > bestCorrelation) {
                    bestCorrelation = correlation;
                    bestOffset = offset;
                    foundGoodCorrelation = true;
                }
                
                if (foundGoodCorrelation) {
                    let shift = (buffer[maxSamples - offset] - buffer[maxSamples]) / 2;
                    return sampleRate / (bestOffset + (shift / 2));
                }
            }
            lastCorrelation = correlation;
        }
        
        if (bestCorrelation > 0.01) {
            return sampleRate / bestOffset;
        }
        return -1;
    };

    const frequencyToNote = (frequency) => {
        const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        const noteIndex = Math.round(noteNum) + 69;
        const noteName = noteStrings[noteIndex % 12];
        const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);
        
        return { note: noteName, cents: cents };
    };

    const getColorForCents = (cents) => {
        const absCents = Math.abs(cents);
        if (absCents < 10) return 'text-green-600';
        if (absCents < 25) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getNeedleRotation = (cents) => {
        return Math.max(-90, Math.min(90, cents * 1.8));
    };

    useEffect(() => {
        return () => {
            if (isActive) {
                stopTuner();
            }
        };
    }, []);

    return (
        <AppLayout>
            <Head title="Afinador Cromático" />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                🎸 Afinador Cromático
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Afine seu instrumento com precisão usando o microfone
                            </p>

                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Visual Tuner Display */}
                            <div className="mb-8 bg-gray-50 rounded-lg p-8">
                                {/* Gauge/Needle Display */}
                                <div className="relative h-64 flex items-center justify-center mb-6">
                                    {/* Scale marks */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="300" height="200" className="absolute">
                                            {/* Arc background */}
                                            <path
                                                d="M 50 150 A 100 100 0 0 1 250 150"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="20"
                                            />
                                            {/* Red zones */}
                                            <path
                                                d="M 50 150 A 100 100 0 0 0 90 80"
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="20"
                                            />
                                            <path
                                                d="M 210 80 A 100 100 0 0 0 250 150"
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="20"
                                            />
                                            {/* Yellow zones */}
                                            <path
                                                d="M 90 80 A 100 100 0 0 0 130 50"
                                                fill="none"
                                                stroke="#eab308"
                                                strokeWidth="20"
                                            />
                                            <path
                                                d="M 170 50 A 100 100 0 0 0 210 80"
                                                fill="none"
                                                stroke="#eab308"
                                                strokeWidth="20"
                                            />
                                            {/* Green zone */}
                                            <path
                                                d="M 130 50 A 100 100 0 0 0 170 50"
                                                fill="none"
                                                stroke="#22c55e"
                                                strokeWidth="20"
                                            />
                                            
                                            {/* Needle */}
                                            {isActive && (
                                                <g transform={`rotate(${getNeedleRotation(cents)} 150 150)`}>
                                                    <line
                                                        x1="150"
                                                        y1="150"
                                                        x2="150"
                                                        y2="60"
                                                        stroke="#1f2937"
                                                        strokeWidth="3"
                                                    />
                                                    <circle cx="150" cy="150" r="8" fill="#1f2937" />
                                                </g>
                                            )}
                                        </svg>
                                    </div>
                                </div>

                                {/* Note Display */}
                                <div className="text-center mb-6">
                                    <div className={`text-6xl font-bold mb-2 ${getColorForCents(cents)}`}>
                                        {note}
                                    </div>
                                    <div className="text-2xl text-gray-600">
                                        {frequency > 0 ? `${frequency} Hz` : '--'}
                                    </div>
                                    {isActive && cents !== 0 && (
                                        <div className={`text-lg mt-2 ${getColorForCents(cents)}`}>
                                            {cents > 0 ? `+${cents}` : cents} cents
                                            {Math.abs(cents) < 10 && ' ✓'}
                                        </div>
                                    )}
                                </div>

                                {/* Control Button */}
                                <div className="text-center">
                                    {!isActive ? (
                                        <button
                                            onClick={startTuner}
                                            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            🎤 Iniciar Afinador
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopTuner}
                                            className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                                        >
                                            ⏹ Parar
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Reference Tuning */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    📋 Afinação Padrão (Violão)
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">E2</div>
                                        <div className="text-sm text-gray-600">82.41 Hz</div>
                                        <div className="text-xs text-gray-500">6ª corda</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">A2</div>
                                        <div className="text-sm text-gray-600">110.00 Hz</div>
                                        <div className="text-xs text-gray-500">5ª corda</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">D3</div>
                                        <div className="text-sm text-gray-600">146.83 Hz</div>
                                        <div className="text-xs text-gray-500">4ª corda</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">G3</div>
                                        <div className="text-sm text-gray-600">196.00 Hz</div>
                                        <div className="text-xs text-gray-500">3ª corda</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">B3</div>
                                        <div className="text-sm text-gray-600">246.94 Hz</div>
                                        <div className="text-xs text-gray-500">2ª corda</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded">
                                        <div className="font-bold text-gray-900">E4</div>
                                        <div className="text-sm text-gray-600">329.63 Hz</div>
                                        <div className="text-xs text-gray-500">1ª corda</div>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm text-gray-600">
                                    <p className="mb-2"><strong>Dicas:</strong></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>🔴 Vermelho: muito desafinado (ajuste bastante)</li>
                                        <li>🟡 Amarelo: próximo (ajuste com cuidado)</li>
                                        <li>🟢 Verde: afinado! (perfeito)</li>
                                        <li>Toque uma corda de cada vez para melhor precisão</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
