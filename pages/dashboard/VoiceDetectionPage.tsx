import React, { useState } from 'react';
import { analyzeVoiceForAI } from '../../services/geminiService';
import { VoiceAnalysisResult, Page } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

const VoiceDetectionPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
             if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError("File is too large. Please select an audio file under 10MB.");
                return;
            }
            setAudioFile(file);
            setResult(null);
            setError(null);
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    }

    const handleDetect = async () => {
        if (!audioFile) return;
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const base64Audio = await fileToBase64(audioFile);
            const analysisResult = await analyzeVoiceForAI(base64Audio, audioFile.type);
            setResult(analysisResult);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze the audio. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const getConfidenceColor = (confidence: number) => {
        if (confidence > 75) return 'bg-green-500';
        if (confidence > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    return (
        <div>
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-black dark:text-white underline hover:opacity-80 mb-4">
                &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">AI Voice Detection</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Upload a short audio clip to determine if the voice is human or synthesized by AI.
            </p>

            <div className="max-w-2xl mx-auto">
                <DashboardCard title="Audio Uploader" icon={ICONS.voice}>
                    <div className="flex flex-col items-center space-y-4">
                         <input
                            type="file"
                            id="audio-upload"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="audio-upload" className="w-full text-center cursor-pointer bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition">
                             {audioFile ? (
                                <div className="text-center">
                                    <p className="font-semibold">Selected file:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{audioFile.name}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold">Click to upload an audio file</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP3, WAV, etc. up to 10MB</p>
                                </div>
                            )}
                        </label>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <button
                            onClick={handleDetect}
                            disabled={!audioFile || isLoading}
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Analyzing...
                                </>
                            ) : (
                                "Detect AI Voice"
                            )}
                        </button>
                    </div>
                </DashboardCard>
                
                {result && (
                    <div className="mt-8 animate-fade-in-up">
                        <DashboardCard title="Analysis Result" icon={ICONS.insights}>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg">Classification</h4>
                                    <p className={`font-bold text-xl ${result.classification === 'Human Voice' ? 'text-green-500' : 'text-red-500'}`}>{result.classification}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Confidence</h4>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                        <div className={`h-4 rounded-full ${getConfidenceColor(result.confidence)}`} style={{ width: `${result.confidence}%` }}></div>
                                    </div>
                                    <p className="text-right text-sm font-medium">{result.confidence}%</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Explanation</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{result.explanation}</p>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceDetectionPage;