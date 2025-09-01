import React, { useState, useEffect } from 'react';
import { getTrendingTopics } from '../../services/geminiService';
import { Page } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

interface Topic {
    topic: string;
    risk: string;
    score: number;
}

const TrendingTopicsPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedTopics = await getTrendingTopics();
                if (fetchedTopics && fetchedTopics.length > 0) {
                    setTopics(fetchedTopics);
                } else {
                     setError("No trending topics could be fetched at this time.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch trending topics.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };
    
    const getRiskTextColor = (risk: string) => {
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
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">Trending Misinformation Topics</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Stay updated on the latest misinformation narratives circulating online, powered by real-time Google Search data.
            </p>

            <div className="max-w-3xl mx-auto">
                 <DashboardCard title="Current Trends" icon={ICONS.trending}>
                     {isLoading ? (
                         <div className="flex justify-center items-center h-48">
                             <svg className="animate-spin h-8 w-8 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         </div>
                     ) : error ? (
                         <p className="text-center text-red-500">{error}</p>
                     ) : (
                         <ul className="space-y-4">
                             {topics.map((item, index) => (
                                 <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                                     <div className="flex-grow pr-4">
                                         <p className="font-semibold">{item.topic}</p>
                                         <p className={`text-sm font-bold ${getRiskTextColor(item.risk)}`}>Risk: {item.risk}</p>
                                     </div>
                                     <div className="flex-shrink-0 text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Credibility</p>
                                        <p className="font-bold text-lg">{item.score}/100</p>
                                     </div>
                                 </li>
                             ))}
                         </ul>
                     )}
                </DashboardCard>
            </div>
        </div>
    );
};

export default TrendingTopicsPage;