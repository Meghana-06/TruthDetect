import React, { useState, useEffect, useRef } from 'react';
import { generateAwarenessTemplateText, getTrendingTopics } from '../../services/geminiService';
import { Page } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

// Inform TypeScript about the global variable from the script tag in index.html
declare const htmlToImage: any;

interface TemplateContent {
    title: string;
    highlights: string[];
    tips: string[];
}

interface Topic {
    topic: string;
    risk: string;
    score: number;
}

const TemplateDisplay: React.FC<{ 
    content: TemplateContent; 
    onCopy: () => void; 
    isCopied: boolean; 
    onDownloadText: () => void;
    onDownloadImage: () => void;
    templateRef: React.RefObject<HTMLDivElement>;
}> = ({ content, onCopy, isCopied, onDownloadText, onDownloadImage, templateRef }) => {
    return (
        <div ref={templateRef} className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 relative shadow-md font-sans">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                 <button
                    onClick={onCopy}
                    className="flex items-center space-x-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-1.5 px-3 text-xs rounded-full transition duration-300"
                    title="Copy to clipboard"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
                 <button
                    onClick={onDownloadText}
                    className="flex items-center space-x-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white font-semibold py-1.5 px-3 text-xs rounded-full transition duration-300"
                    title="Download as .txt file"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>.txt</span>
                </button>
                 <button
                    onClick={onDownloadImage}
                    className="flex items-center space-x-1.5 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold py-1.5 px-3 text-xs rounded-full transition duration-300"
                    title="Download as .png image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>.png</span>
                </button>
            </div>

            <header className="text-center mb-8">
                <div className="inline-block bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                    Awareness Info
                </div>
                <h2 className="text-3xl font-bold text-black dark:text-white">{content.title}</h2>
            </header>

            <main className="space-y-6">
                <div className="bg-amber-100/60 dark:bg-amber-900/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center">
                        <span className="mr-2 text-xl">🤔</span> Why it might be misleading...
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-black dark:text-gray-300">
                        {content.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-teal-100/60 dark:bg-teal-900/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200 mb-2 flex items-center">
                       <span className="mr-2 text-xl">💡</span> How to stay safe...
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-black dark:text-gray-300">
                         {content.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            </main>

            <footer className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
                Generated by CodeHustlers ✨ Be smart, stay safe.
            </footer>
        </div>
    );
};

const AwarenessTemplatesPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<TemplateContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [trendingTopics, setTrendingTopics] = useState<Topic[]>([]);
    const [isTopicsLoading, setIsTopicsLoading] = useState(true);
    const templateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const topicFromNav = sessionStorage.getItem('templateTopic');
        if (topicFromNav) {
            setPrompt(topicFromNav);
            sessionStorage.removeItem('templateTopic');
        }

        const fetchTopics = async () => {
            try {
                const topics = await getTrendingTopics();
                setTrendingTopics(topics);
            } catch (error) {
                console.error("Failed to fetch trending topics", error);
            } finally {
                setIsTopicsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const generatedContent = await generateAwarenessTemplateText(prompt);
            setResult(generatedContent);
        } catch (err) {
            console.error(err);
            setError("Failed to generate the template. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        if (!result) return;
        const textToCopy = `
Title: ${result.title}

Key Points:
${result.highlights.map(h => `- ${h}`).join('\n')}

Tips & Sources:
${result.tips.map(t => `- ${t}`).join('\n')}
        `.trim();
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
    
    const handleDownloadText = () => {
        if (!result) return;

        const formattedText = `
AWARENESS TEMPLATE from CodeHustlers ✨
-------------------------------------

Title: ${result.title}

🤔 Why it might be misleading:
${result.highlights.map(h => `  • ${h}`).join('\n')}

💡 How to stay safe:
${result.tips.map(t => `  • ${t}`).join('\n')}

-------------------------------------
Be smart, stay safe.
        `.trim();

        const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const safeTitle = result.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30).toLowerCase();
        const fileName = `codehustlers_template_${safeTitle}.txt`;

        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadImage = async () => {
        if (!templateRef.current || !result) {
            console.error("Template ref not found or no result to download.");
            return;
        }

        try {
            const dataUrl = await htmlToImage.toPng(templateRef.current, { 
                quality: 1,
                pixelRatio: 2, // Generate a higher-resolution image
                style: {
                    // Ensure the background color is captured correctly for the image
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#f8fafc',
                }
            });

            const link = document.createElement('a');
            const safeTitle = result.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30).toLowerCase();
            const fileName = `codehustlers_template_${safeTitle}.png`;

            link.download = fileName;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to generate template image:', error);
            setError("Sorry, there was an issue creating the image. Please try again.");
        }
    };

    const handleTopicSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTopic = e.target.value;
        setPrompt(selectedTopic);
    };

    return (
        <div>
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-black dark:text-white underline hover:opacity-80 mb-4">
                &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">Awareness Campaign Templates</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Enter a topic to generate concise, shareable content for an awareness infographic. Help combat misinformation by educating others.
            </p>

            <div className="max-w-3xl mx-auto">
                <DashboardCard title="Template Generator" icon={ICONS.template}>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full">
                            <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Or select a trending topic
                            </label>
                            <select
                                id="topic-select"
                                onChange={handleTopicSelect}
                                disabled={isTopicsLoading}
                                className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                                value={prompt}
                            >
                                <option value="">{isTopicsLoading ? 'Loading topics...' : 'Select a topic...'}</option>
                                {trendingTopics.map((topic, index) => (
                                    <option key={index} value={topic.topic}>{topic.topic}</option>
                                ))}
                            </select>
                        </div>
                        
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'The myth that vaccines cause autism'"
                            className="w-full h-24 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            disabled={isLoading}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Generating...
                                </>
                            ) : (
                                "Generate Template"
                            )}
                        </button>
                    </div>
                </DashboardCard>

                {result && (
                    <div className="mt-8 animate-fade-in-up">
                        <TemplateDisplay 
                            templateRef={templateRef}
                            content={result} 
                            onCopy={handleCopyToClipboard} 
                            isCopied={isCopied} 
                            onDownloadText={handleDownloadText}
                            onDownloadImage={handleDownloadImage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AwarenessTemplatesPage;