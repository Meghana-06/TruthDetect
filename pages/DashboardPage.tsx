import React from 'react';
import { ICONS } from '../constants';
import { Page } from '../types';

interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
  path: Page;
}

const features: Feature[] = [
  {
    title: 'AI Image Detection',
    icon: ICONS.image,
    description: 'Analyze images for signs of AI generation to verify authenticity.',
    path: 'dashboard/image',
  },
  {
    title: 'Article Misinformation',
    icon: ICONS.article,
    description: 'Check article credibility by cross-referencing claims with verified sources.',
    path: 'dashboard/article',
  },
  {
    title: 'AI Voice Detection',
    icon: ICONS.voice,
    description: 'Determine if an audio clip contains a human or AI-synthesized voice.',
    path: 'dashboard/voice',
  },
  {
    title: 'Trending Searches',
    icon: ICONS.trending,
    description: 'Monitor real-time online narratives to spot widespread misinformation.',
    path: 'dashboard/trending',
  },
  {
    title: 'Awareness Templates',
    icon: ICONS.template,
    description: 'Create shareable infographics from your findings to educate others.',
    path: 'dashboard/templates',
  },
  {
    title: 'User Insights',
    icon: ICONS.insights,
    description: 'Track your analysis history and view your achievements.',
    path: 'dashboard/insights',
  },
];


const ToolCard: React.FC<{ feature: Feature; onNavigate: (page: Page) => void; }> = ({ feature, onNavigate }) => (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="p-3 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-black dark:text-white mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h3>
      <p className="text-black dark:text-gray-300 text-sm mb-4 flex-grow">{feature.description}</p>
      <button 
        onClick={() => onNavigate(feature.path)}
        className="w-full mt-auto bg-black text-white dark:bg-white dark:text-black font-bold py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        Open Tool
      </button>
    </div>
);


const DashboardPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">AI Detection Suite</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                Welcome to your command center for truth. Select a tool below to begin your analysis and contribute to a more informed digital world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {features.map(feature => (
                   <ToolCard key={feature.path} feature={feature} onNavigate={onNavigate} />
               ))}
            </div>
        </div>
    );
};

export default DashboardPage;