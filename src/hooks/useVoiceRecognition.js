import { useState, useEffect, useCallback, useRef } from 'react';
// Map your app's language codes to SpeechRecognition language tags
const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    ml: 'ml-IN'
};

export const useVoiceRecognition = (onResultCallback) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const callbackRef = useRef(onResultCallback);

    useEffect(() => {
        callbackRef.current = onResultCallback;
    }, [onResultCallback]);

    useEffect(() => {
        // Check if the browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false; // Stop after a single phrase
            recog.interimResults = false; // Only get final results for commands

            // Update the voice recognition language to default English
            recog.lang = 'en-IN';

            recog.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                if (callbackRef.current) {
                    callbackRef.current(transcript.toLowerCase().trim());
                }
            };

            recog.onend = () => setIsListening(false);
            recog.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current = recog;
        } else {
            console.warn("Speech recognition is not supported in this browser.");
        }
    }, []); // Re-initialize once

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Speech recognition start error", e);
            }
        }
    }, [isListening]);

    return { isListening, toggleListening, isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition) };
};
