import React, { useEffect, useState } from 'react';
import { Target, Calendar, Zap, BarChart3, Sparkles, TrendingUp, User, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UserService } from '../services/user_service';

interface DashboardProps {
  onNavigate: (tab: string) => void;

  initialProfile?: {
    full_name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, initialProfile }) => {
  const [full_name, setFullName] = useState(initialProfile?.full_name || '');
  const [age, setAge] = useState(initialProfile?.age || '');
  const [gender, setGender] = useState(initialProfile?.gender || 'None');
  const [height, setHeight] = useState(initialProfile?.height || '');
  const [weight, setWeight] = useState(initialProfile?.weight || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isEmptyProfile, setIsEmptyProfile] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Show setup dialog if profile is empty
    if (isEmptyProfile) {
      setShowSetupDialog(true);
    }
  }, [isEmptyProfile]);

  const fetchUserProfile = async () => {
    try {
      const profile = await UserService.getUserProfile();
      console.log('Fetched user profile:', profile);

      setFullName(profile.full_name || '');
      setAge(profile.age?.toString() || '');
      setGender(profile.gender || 'None');
      setHeight(profile.height?.toString() || '');
      setWeight(profile.weight?.toString() || '');

      const empty =
        (profile.full_name === null || profile.full_name === undefined) &&
        (profile.age === null || profile.age === undefined) &&
        (profile.gender === null || profile.gender === undefined) &&
        (profile.height === null || profile.height === undefined) &&
        (profile.weight === null || profile.weight === undefined);

      setIsEmptyProfile(empty);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSetupProfile = () => {
    setShowSetupDialog(false);
    onNavigate('profile');
  };

  const stats = [
    {
      title: 'Active Goals',
      value: '3',
      change: '+2 this week',
      icon: Target,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20'
    },
    {
      title: 'Completed Tasks',
      value: '12',
      change: '+5 today',
      icon: Calendar,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/20'
    },
    {
      title: 'Habit Streak',
      value: '7 days',
      change: 'Personal best!',
      icon: Zap,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100 dark:bg-accent-900/20'
    },
    {
      title: 'Productivity',
      value: '85%',
      change: '+12% this week',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ];

  const quickActions = [
    {
      title: 'Set New Goal',
      description: 'Create a new goal with AI-powered planning',
      icon: Target,
      color: 'bg-primary-400',
      action: () => onNavigate('goals-overview')
    },
    {
      title: 'Plan Your Day',
      description: 'Organize tasks and time blocks',
      icon: Calendar,
      color: 'bg-secondary-400',
      action: () => onNavigate('planner')
    },
    {
      title: 'Track Habits',
      description: 'Log your daily habits and streaks',
      icon: Zap,
      color: 'bg-accent-400',
      action: () => onNavigate('habits')
    },
    {
      title: 'View Insights',
      description: 'See your productivity trends',
      icon: BarChart3,
      color: 'bg-green-400',
      action: () => onNavigate('insights')
    }
  ];

  return (
    <div className="space-y-8">
      {/* First Time Setup Dialog */}
      {showSetupDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <User size={24} className="text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    Welcome to AI Life Planner!
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-neutral-600 dark:text-neutral-300">
                  To get the most personalized experience and better AI recommendations,
                  we'd love to learn a bit about you.
                </p>

                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-2">
                    Setting up your profile helps us:
                  </h4>
                  <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-1">
                    <li>• Provide personalized goal recommendations</li>
                    <li>• Create tailored workout and nutrition plans</li>
                    <li>• Track your progress more effectively</li>
                    <li>• Offer better AI-powered insights</li>
                  </ul>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSetupProfile}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    Set Up Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Good morning! 👋
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-2">
            Ready to make today productive?
          </p>
        </div>
        <Button onClick={() => onNavigate('assistant')}>
          <Sparkles size={20} className="mr-2" />
          Ask AI Assistant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card blurred key={stat.title} className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                {stat.title}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                {stat.change}
              </p>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} hover onClick={action.action}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 ${action.color} rounded-lg flex-shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Today's Focus
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Complete morning deep work session (90 minutes)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Review weekly goals and adjust priorities
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span className="text-neutral-700 dark:text-neutral-300">
              Practice gratitude journaling (5 minutes)
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;