import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { getChatbotResponse } from '../services/geminiService';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hi! I'm the support assistant for CodeHustlers. How can I help you with the CodeHustlers app today?", sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (userInput.trim() === '' || isLoading) return;

        const newUserMessage: Message = { text: userInput, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const botResponseText = await getChatbotResponse(userInput);
        const newBotMessage: Message = { text: botResponseText, sender: 'bot' };

        setMessages(prev => [...prev, newBotMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg z-50 transform transition-transform hover:scale-110"
                aria-label="Open Chatbot"
            >
                {ICONS.chat}
            </button>
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-full max-w-sm h-full max-h-[600px] bg-white dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl z-50 flex flex-col animate-fade-in-up border border-gray-200 dark:border-gray-800">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="font-bold text-black dark:text-white">CodeHustlers Support</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">&times;</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                                    <svg className="animate-spin h-5 w-5 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a question..."
                                className="w-full bg-gray-100 dark:bg-gray-800 p-2 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="bg-black text-white dark:bg-white dark:text-black font-bold py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;