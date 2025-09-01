import React, { useState } from 'react';
import { generateAwarenessTemplateText } from '../../services/geminiService';
import { Page } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

interface TemplateContent {
    title: string;
    highlights: string[];
    tips: string[];
}

const AwarenessTemplatesPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<TemplateContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

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
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }

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
                        <DashboardCard title="Generated Infographic Content" icon={ICONS.insights}>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg">Title</h4>
                                    <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md font-bold">{result.title}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Key Highlights</h4>
                                    <ul className="list-disc list-inside space-y-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                        {result.highlights.map((highlight, index) => (
                                            <li key={index}>{highlight}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Safety Tips / Sources</h4>
                                    <ul className="list-disc list-inside space-y-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                        {result.tips.map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={handleCopyToClipboard}
                                    className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                            </div>
                        </DashboardCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AwarenessTemplatesPage;