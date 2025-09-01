import React from 'react';
import { Page, UserHistoryItem } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ICONS } from '../../constants';

// Mock data for demonstration
const mockHistory: UserHistoryItem[] = [
    { id: '1', type: 'image', query: 'city_skyline.jpg', result: 'AI-generated (88%)', timestamp: '2024-07-28 14:30' },
    { id: '2', type: 'article', query: 'Article on miracle cures...', result: 'High Risk (95)', timestamp: '2024-07-28 11:15' },
    { id: '3', type: 'voice', query: 'political_speech.mp3', result: 'Human Voice (92%)', timestamp: '2024-07-27 18:45' },
    { id: '4', type: 'image', query: 'family_photo.png', result: 'Authentic (98%)', timestamp: '2024-07-26 09:00' },
];

const achievements = [
    { name: 'Truth Seeker', description: 'Perform your first 5 analyses.', earned: true, icon: '🛡️' },
    { name: 'Fact-Checker', description: 'Analyze 10 articles.', earned: true, icon: '🔎' },
    { name: 'Image Detective', description: 'Analyze 10 images.', earned: false, icon: '🖼️' },
    { name: 'Vigilant Citizen', description: 'Share 5 awareness templates.', earned: false, icon: '📢' },
    { name: 'Myth Buster', description: 'Analyze 25 items in total.', earned: false, icon: '💥' },
];

const HistoryItem: React.FC<{ item: UserHistoryItem }> = ({ item }) => {
    const getIcon = (type: 'image' | 'article' | 'voice') => {
        switch (type) {
            case 'image': return ICONS.image;
            case 'article': return ICONS.article;
            case 'voice': return ICONS.voice;
        }
    }
    return (
        <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-between">
            <div className="flex items-center">
                <span className="mr-3">{getIcon(item.type)}</span>
                <div>
                    <p className="font-semibold truncate max-w-[150px] sm:max-w-xs">{item.query}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.timestamp}</p>
                </div>
            </div>
            <p className="text-sm font-medium text-right">{item.result}</p>
        </li>
    );
};

const AchievementBadge: React.FC<{ name: string, description: string, earned: boolean, icon: string }> = ({ name, description, earned, icon }) => (
    <div className={`p-4 text-center border rounded-lg ${earned ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 opacity-60'}`}>
        <div className="text-4xl mb-2">{icon}</div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);


const UserInsightsPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div>
            <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-black dark:text-white underline hover:opacity-80 mb-4">
                &larr; Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-white">User Insights</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Review your activity, track your contributions, and see the badges you've earned on your journey to combat misinformation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DashboardCard title="Analysis History" icon={ICONS.insights}>
                    {mockHistory.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                           {mockHistory.map(item => <HistoryItem key={item.id} item={item} />)}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Your analysis history will appear here once you start using the tools.</p>
                    )}
                </DashboardCard>

                <DashboardCard title="Achievements" icon={<span>🏆</span>}>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {achievements.map(ach => <AchievementBadge key={ach.name} {...ach} />)}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default UserInsightsPage;