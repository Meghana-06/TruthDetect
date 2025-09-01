import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Chatbot from './components/Chatbot';
import VoiceAssistant from './components/VoiceAssistant';
import { User } from './types';

// Import new tool pages
import ImageDetectionPage from './pages/dashboard/ImageDetectionPage';
import ArticleAnalysisPage from './pages/dashboard/ArticleAnalysisPage';
import VoiceDetectionPage from './pages/dashboard/VoiceDetectionPage';
import TrendingTopicsPage from './pages/dashboard/TrendingTopicsPage';
import AwarenessTemplatesPage from './pages/dashboard/AwarenessTemplatesPage';
import UserInsightsPage from './pages/dashboard/UserInsightsPage';


const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // This effect synchronizes the theme with the <html> element's class
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  const handleLogin = useCallback((credentials: { email?: string; googleUser?: Partial<User> }) => {
    const { email, googleUser } = credentials;

    let finalUser: User;
    
    const deriveNameFromEmail = (email: string) => email.split('@')[0]
                                   .replace(/[._-]/g, ' ')
                                   .split(' ')
                                   .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
                                   .join(' ');

    if (googleUser && googleUser.email) {
        finalUser = {
            name: deriveNameFromEmail(googleUser.email),
            email: googleUser.email,
            profileImageUrl: googleUser.profileImageUrl || null,
        };
    } else if (email) {
        finalUser = {
            name: deriveNameFromEmail(email),
            email: email,
            profileImageUrl: null,
        };
    } else {
        finalUser = {
            name: 'Alex Doe',
            email: 'alex.doe@example.com',
            profileImageUrl: null,
        };
    }

    setUser(finalUser);
    setIsLoggedIn(true);
    setCurrentPage('home');
  }, []);


  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('login');
    setAuthPage('login');
  }, []);

  const handleRegister = useCallback((email: string) => {
    const nameFromEmail = email.split('@')[0]
                               .replace(/[._-]/g, ' ')
                               .split(' ')
                               .map(namePart => namePart.charAt(0).toUpperCase() + namePart.slice(1))
                               .join(' ');
    
    setUser({
      name: nameFromEmail,
      email: email,
      profileImageUrl: null,
    });
    setIsLoggedIn(true);
    setCurrentPage('home');
  }, []);


  const handleProfileUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const handleNavigation = useCallback((page: string) => {
    if (page === 'login' && isLoggedIn) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(page);
    }
  }, [isLoggedIn]);

  const renderPage = useMemo(() => {
    if (!isLoggedIn) {
      if (authPage === 'register') {
        return <RegistrationPage onRegister={handleRegister} onSwitchToLogin={() => setAuthPage('login')} onLogin={handleLogin} />;
      }
      return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthPage('register')} />;
    }
    
    if (currentPage.startsWith('dashboard/')) {
        const subpage = currentPage.split('/')[1];
        switch (subpage) {
            case 'image': return <ImageDetectionPage onNavigate={handleNavigation} />;
            case 'article': return <ArticleAnalysisPage onNavigate={handleNavigation} />;
            case 'voice': return <VoiceDetectionPage onNavigate={handleNavigation} />;
            case 'trending': return <TrendingTopicsPage onNavigate={handleNavigation} />;
            case 'templates': return <AwarenessTemplatesPage onNavigate={handleNavigation} />;
            case 'insights': return <UserInsightsPage onNavigate={handleNavigation} />;
            default: return <DashboardPage onNavigate={handleNavigation} />;
        }
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigation} />;
      case 'faq':
        return <FaqPage />;
      case 'contact':
        return <ContactPage />;
      case 'profile':
        return <ProfilePage user={user!} onUpdateProfile={handleProfileUpdate} onLogout={handleLogout} />;
      default:
        return <DashboardPage onNavigate={handleNavigation} />;
    }
  }, [currentPage, isLoggedIn, handleLogin, authPage, handleRegister, user, handleProfileUpdate, handleLogout, handleNavigation]);

  return (
    <div className="relative flex flex-col min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <Header 
        isLoggedIn={isLoggedIn} 
        onNavigate={handleNavigation} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        onLogout={handleLogout}
      />
      <main key={currentPage} className="flex-grow container mx-auto px-4 py-8 animate-fade-in-up">
        {renderPage}
      </main>
      <Footer />
      {isLoggedIn && <VoiceAssistant />}
      {isLoggedIn && <Chatbot />}
    </div>
  );
};

export default App;