import React, { useState, useEffect, useRef } from 'react';
import { getVoiceAssistantResponse } from '../services/geminiService';
import { ICONS } from '../constants';

// Fix: Add type definitions for Web Speech API for TypeScript
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}


const VoiceAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Speech recognition not supported");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            setResponse('');
        };

        recognition.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
            handleAiResponse(currentTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === 'no-speech') {
                setResponse("I didn't hear anything. Please tap the mic to try again.");
            } else if (event.error !== 'aborted') {
                setResponse("Sorry, I couldn't understand. Please try again.");
            }
            setIsListening(false);
            setIsThinking(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const handleAiResponse = async (text: string) => {
        setIsListening(false);
        setIsThinking(true);
        const aiResponse = await getVoiceAssistantResponse(text);
        setResponse(aiResponse);
        setIsThinking(false);
        speakResponse(aiResponse);
    }
    
    const speakResponse = (text: string) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsOpen(false); // Close modal after speaking
        };
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
    }

    const toggleListen = () => {
        if (!isOpen) {
            setIsOpen(true);
        }
        
        if (isListening) {
            recognitionRef.current?.stop();
        } else if (!isSpeaking && !isThinking) {
             // Clear previous state before starting
            setResponse('');
            setTranscript('');
            recognitionRef.current?.start();
        }
    };
    
    const closeAssistant = () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
        window.speechSynthesis.cancel();
        setIsListening(false);
        setIsThinking(false);
        setIsSpeaking(false);
        setIsOpen(false);
    }

    const getStatusText = () => {
        if (isListening) return "Listening...";
        if (isThinking) return "Thinking...";
        if (isSpeaking) return response; // Show response while speaking
        if (transcript) return `"${transcript}"`;
        if (response) return response;
        return "Tap the mic and ask a question.";
    };

    return (
        <>
            <button
                onClick={toggleListen}
                className={`fixed bottom-6 left-6 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg z-50 transform transition-transform hover:scale-110 ${isListening ? 'animate-pulse' : ''}`}
                aria-label="Open Voice Assistant"
            >
                {ICONS.mic}
            </button>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
                    onClick={closeAssistant}
                >
                    <div 
                        className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center flex flex-col items-center animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                         <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-200 dark:bg-gray-800 relative">
                            {React.cloneElement(ICONS.mic, { className: 'h-10 w-10'})}
                            {(isListening || isThinking) && (
                                <div className="absolute inset-0 rounded-full border-4 border-black dark:border-white animate-pulse"></div>
                            )}
                        </div>
                        <p className="text-lg font-medium min-h-[56px] flex items-center justify-center">{getStatusText()}</p>
                        <button onClick={closeAssistant} className="mt-6 text-sm text-gray-500 dark:text-gray-400">Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoiceAssistant;