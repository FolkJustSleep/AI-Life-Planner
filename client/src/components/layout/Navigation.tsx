import React from 'react';
import { 
  Target, 
  Calendar, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  DollarSign, 
  Star,
  Home,
  LogIn
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Badge from '../Badge';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}


const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  isLoggedIn,
  onLogout
}) => {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'goals-overview', label: 'Goals', icon: Target },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: Zap },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'bonus', label: 'Bonus Features', icon: Star },
    { id: 'login', label: isLoggedIn ? 'Logout' : 'Login', icon: LogIn }
  ];

  const handleItemClick = (id: string) => {
  if (id === 'login' && isLoggedIn) {
    onLogout(); // logout and go to login page
  } else {
    onTabChange(id);
  }
  onClose();
};


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={cn(
        'fixed left-0 top-0 h-screen w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 z-50 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 pt-20 md:pt-6 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200',
                      activeTab === item.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <Badge />
    </>
  );
};

export default Navigation;