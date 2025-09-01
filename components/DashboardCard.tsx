import React from 'react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-gray-200/80 dark:bg-gray-800/80 text-black dark:text-white mr-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
        </div>
        <div className="text-black dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;