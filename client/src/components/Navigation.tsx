import React from 'react';
import { 
  Target, 
  Calendar, 
  Repeat, 
  BarChart3, 
  MessageSquare, 
  DollarSign,
  Heart,
  Timer
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'goals', label: 'Goals', icon: Target, color: 'from-[#A8D1E7] to-[#D2D0F5]' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'from-[#D2D0F5] to-[#FFBCFA]' },
  { id: 'habits', label: 'Habits', icon: Repeat, color: 'from-[#A8D1E7] to-[#D2D0F5]' },
  { id: 'insights', label: 'Insights', icon: BarChart3, color: 'from-[#FFBCFA] to-[#A8D1E7]' },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, color: 'from-[#A8D1E7] to-[#FFBCFA]' },
  { id: 'finance', label: 'Finance', icon: DollarSign, color: 'from-[#D2D0F5] to-[#FFBCFA]' },
  { id: 'mood', label: 'Mood', icon: Heart, color: 'from-[#FFBCFA] to-[#A8D1E7]' },
  { id: 'focus', label: 'Focus', icon: Timer, color: 'from-[#A8D1E7] to-[#D2D0F5]' },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-20 lg:bg-white/50 lg:dark:bg-gray-900/50 lg:backdrop-blur-sm lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
        <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-500 scale-110'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}