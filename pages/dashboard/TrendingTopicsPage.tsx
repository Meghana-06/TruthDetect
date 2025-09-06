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

const SkeletonLoader = () => (
    <ul className="space-y-4">
        {[...Array(5)].map((_, index) => (
            <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="w-1/6 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </li>
        ))}
    </ul>
);

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

    const handleCreateTemplate = (topic: string) => {
        sessionStorage.setItem('templateTopic', topic);
        onNavigate('dashboard/templates');
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
                         <SkeletonLoader />
                     ) : error ? (
                         <p className="text-center text-red-500">{error}</p>
                     ) : (
                         <ul className="space-y-4">
                             {topics.map((item, index) => (
                                <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                     <div className="flex-grow mb-3 sm:mb-0 sm:pr-4">
                                         <p className="font-semibold">{item.topic}</p>
                                         <div className="flex items-center mt-1">
                                            <p className={`text-sm font-bold ${getRiskTextColor(item.risk)}`}>Risk: {item.risk}</p>
                                            <span className="mx-2 text-gray-400">|</span>
                                            <p className="text-sm font-medium">Credibility: {item.score}/100</p>
                                         </div>
                                     </div>
                                     <button 
                                        onClick={() => handleCreateTemplate(item.topic)}
                                        className="w-full sm:w-auto flex-shrink-0 bg-black text-white dark:bg-white dark:text-black font-bold py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 text-sm transition-colors"
                                    >
                                        Create Template
                                    </button>
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