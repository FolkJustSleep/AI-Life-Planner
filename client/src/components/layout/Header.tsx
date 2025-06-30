import React from 'react';
import { Moon, Sun, User, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section: Logo and Menu */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Life Planner
            </h1>
          </div>
        </div>

        {/* Right section: Theme toggle and Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun size={16} className="text-neutral-600 dark:text-neutral-400" />
            <Toggle
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <Moon size={16} className="text-neutral-600 dark:text-neutral-400" />
          </div>
          <Button variant="ghost" size="sm" onClick={onProfileClick}>
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;