import React, { useState } from 'react';
import { analyzeArticleContent } from '../../services/geminiService';
import { ArticleAnalysisResult, Page } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

const ArticleAnalysisPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [articleText, setArticleText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ArticleAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleAnalyze = async () => {
        if (!articleText.trim()) {
            setError("Article content cannot be empty.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        
        try {
            const analysisResult = await analyzeArticleContent(articleText);
            setResult(analysisResult);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze the article. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-500';
            case 'low': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div>
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-black dark:text-white underline hover:opacity-80 mb-4">
                &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">Article Misinformation Analysis</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Paste the content of an article below to check its credibility. The AI will fact-check claims and provide a risk assessment.
            </p>

            <div className="max-w-4xl mx-auto">
                 <DashboardCard title="Article Input" icon={ICONS.article}>
                     <div className="flex flex-col items-center space-y-4">
                        <textarea
                            value={articleText}
                            onChange={(e) => setArticleText(e.target.value)}
                            placeholder="Paste article text here..."
                            className="w-full h-48 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                            disabled={isLoading}
                        />
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                         <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !articleText}
                            className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                             {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Article"
                            )}
                         </button>
                     </div>
                 </DashboardCard>

                 {result && (
                     <div className="mt-8 animate-fade-in-up">
                         <DashboardCard title="Analysis Result" icon={ICONS.insights}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                 <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                     <h4 className="font-semibold text-lg">Risk Level</h4>
                                     <p className={`font-bold text-2xl ${getRiskColor(result.riskLevel)}`}>{result.riskLevel}</p>
                                 </div>
                                 <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                     <h4 className="font-semibold text-lg">Credibility Score</h4>
                                     <p className="font-bold text-2xl">{result.credibilityScore} / 100</p>
                                 </div>
                             </div>
                             <div className="space-y-4">
                                 <div>
                                     <h4 className="font-semibold text-lg mb-2">Summary</h4>
                                     <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">{result.summary}</p>
                                 </div>
                                  <div>
                                    <h4 className="font-semibold text-lg mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.tags.map(tag => (
                                            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                 <div>
                                     <h4 className="font-semibold text-lg mb-2">Claim Analysis</h4>
                                     <ul className="space-y-3">
                                         {result.claims.map((item, index) => (
                                             <li key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                                                 <p className="font-semibold">Claim: <span className="font-normal">{item.claim}</span></p>
                                                 <p className="font-semibold mt-1 text-sm">Verification: <span className="font-normal text-gray-600 dark:text-gray-300">{item.verification}</span></p>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             </div>
                         </DashboardCard>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ArticleAnalysisPage;