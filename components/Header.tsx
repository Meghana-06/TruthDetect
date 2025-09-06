import React, { useState, useEffect, useRef } from 'react';
import type { Page, User } from '../types';
import { NAV_LINKS, ICONS } from '../constants';

interface HeaderProps {
  isLoggedIn: boolean;
  onNavigate: (page: Page) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onNavigate, isDarkMode, toggleDarkMode, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate(isLoggedIn ? 'home' : 'login')} className="flex-shrink-0 text-black dark:text-white text-xl font-bold flex items-center">
               <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              CodeHustlers
            </button>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                {isLoggedIn && NAV_LINKS.map((link) => (
                    <button
                    key={link.name}
                    onClick={() => onNavigate(link.page)}
                    className="text-black dark:text-gray-300 hover:text-opacity-70 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                    {link.name}
                    </button>
                ))}
                </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Toggle dark mode</span>
              {isDarkMode ? ICONS.sun : ICONS.moon}
            </button>
            {isLoggedIn && user && (
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        {user.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <span className="w-8 h-8 rounded-full bg-gray-800 text-white dark:bg-gray-200 dark:text-black flex items-center justify-center font-bold text-sm">
                                {getInitials(user.name)}
                            </span>
                        )}
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-md shadow-lg py-1 ring-1 ring-black dark:ring-white ring-opacity-5 z-50 animate-fade-in-down-sm">
                           <button onClick={() => { onNavigate('profile'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Profile
                            </button>
                            <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;