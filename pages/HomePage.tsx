import React from 'react';
import { ICONS } from '../constants';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const features = [
    { 
        icon: ICONS.image,
        title: "AI Image Detection",
        description: "Analyze images for signs of AI generation, scrutinizing texture, lighting, and artifacts to verify authenticity.",
        path: 'dashboard/image'
    },
    { 
        icon: ICONS.article,
        title: "Article Misinformation",
        description: "Cross-check claims within articles against verified sources to assess credibility and identify potential falsehoods.",
        path: 'dashboard/article'
    },
    { 
        icon: ICONS.sms,
        title: "SMS Fraud Detection",
        description: "Analyze SMS messages to detect potential fraud and phishing attempts based on sender ID.",
        path: 'dashboard/sms'
    },
    { 
        icon: ICONS.voice,
        title: "Call Fraud Detection",
        description: "Analyze recorded calls for AI voices and scam keywords to detect fraud.",
        path: 'dashboard/voice'
    },
    { 
        icon: ICONS.aivoice,
        title: "AI Voice Detection",
        description: "Determine if a voice recording is AI-generated or a real person with high accuracy.",
        path: 'dashboard/aivoice'
    },
    { 
        icon: ICONS.template,
        title: "Awareness Templates",
        description: "Generate shareable infographics from your findings to help educate others and combat misinformation.",
        path: 'dashboard/templates'
    },
    { 
        icon: ICONS.insights,
        title: "User Insights",
        description: "Track your analysis history, see your impact, and earn badges for your commitment to finding the truth.",
        path: 'dashboard/insights'
    }
];

const FeatureCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
    <button onClick={onClick} className="bg-white/70 dark:bg-black/70 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-200 dark:border-gray-800 transform hover:-translate-y-1 transition-transform duration-300 w-full h-full flex flex-col">
        <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-black dark:text-white">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-black dark:text-white">{title}</h3>
        <p className="text-sm text-black dark:text-gray-300 flex-grow">{description}</p>
    </button>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl w-full bg-white/70 dark:bg-black/70 backdrop-blur-2xl rounded-2xl p-10 md:p-16 border border-gray-200 dark:border-white/10 shadow-2xl mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Welcome back to <span className="text-black dark:text-white">CodeHustlers</span>
        </h1>
        <p className="text-lg md:text-xl text-black dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Harness the power of advanced AI to navigate the complex digital landscape with confidence. Our tools provide real-time analysis of articles, images, and online trends to uncover misinformation, empowering you with the clarity to distinguish fact from fiction.
        </p>
        <div className="flex justify-center">
            <button onClick={() => onNavigate('dashboard')} className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
                Go to Dashboard
            </button>
        </div>
      </div>

      <div className="max-w-5xl w-full">
        <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">Our Specialised Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(feature => (
                 <FeatureCard 
                    key={feature.path}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    onClick={() => onNavigate(feature.path)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;