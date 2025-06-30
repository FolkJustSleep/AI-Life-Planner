import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import LoginPage from './components/features/auth/LoginPage';
import LandingPage from './components/features/LandingPage';

import PlannerPage from './pages/PlannerPage';
import HabitsPage from './pages/HabitsPage';
import InsightsPage from './pages/InsightsPage';
import AssistantPage from './pages/AssistantPage';
import FinancePage from './pages/FinancePage';
import BonusPage from './pages/BonusPage';
import GoalsOverview from './pages/GoalsOverview';
import UserProfile from './pages/UserProfile';
import AddHabitPage from './components/features/habits/AddHabitPage';

import { supabase } from './utils/supabase';

function App() {
  const getInitialTab = () => {
    // Always show LandingPage first for new sessions (not logged in)
    return 'dashboard';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const savedTab = localStorage.getItem('activeTab');
    setActiveTab(savedTab || 'dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('activeTab');
    setActiveTab('dashboard');
  };

  useEffect(() => {
    if (activeTab !== 'login') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user?.id || null);
        const savedTab = localStorage.getItem('activeTab');
        setActiveTab(savedTab || 'dashboard');
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        // Always show LandingPage for new/guest users
        setActiveTab('dashboard');
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user?.id || null);
        const savedTab = localStorage.getItem('activeTab');
        setActiveTab(savedTab || 'dashboard');
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setActiveTab('dashboard');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  // Debug: log current state
  console.log('isLoggedIn:', isLoggedIn, 'activeTab:', activeTab);

  if (!isLoggedIn) {
    if (activeTab === 'login') {
      return (
        <ThemeProvider>
          <LoginPage onLogin={handleLogin} />
        </ThemeProvider>
      );
    } else if (activeTab === 'dashboard') {
      return (
        <ThemeProvider>
          <LandingPage onStart={() => {
            console.log('LandingPage onStart clicked');
            setActiveTab('login');
          }} />
        </ThemeProvider>
      );
    } else {
      // fallback for any other tab
      return (
        <ThemeProvider>
          <LandingPage onStart={() => {
            setActiveTab('login');
          }} />
        </ThemeProvider>
      );
    }
  }

  const renderContent = () => {
    console.log('Rendering tab:', activeTab);
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'goals-overview':
        return (
          <GoalsOverview 
            onAddGoal={() => setActiveTab('goals')} 
          />
        );
      case 'goals':
        return <Goals onNavigate={setActiveTab} />;
      case 'profile':
        return <UserProfile />;
      case 'planner':
        return <PlannerPage />;
      case 'habits':
        return <HabitsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'finance':
        return <FinancePage />;
      case 'bonus':
        return <BonusPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'add-habit':
        return <AddHabitPage />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileClick={() => setActiveTab('profile')}
      >
        {renderContent()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;