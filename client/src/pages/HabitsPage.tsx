import React, { useState, useEffect } from 'react';
import { Zap, Target, Trophy, Flame, Play } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import HabitService from '../services/habits_service';
import { HabitData } from '../models/habits_model';

const iconMap: Record<string, string> = {
  health: '💪',
  productivity: '⚡',
  mindfulness: '🧘',
  learning: '📚',
  default: '🚩',
};

const HabitsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch habits from backend
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const data: HabitData[] = await HabitService.getHabits();
        // Map HabitData to display format
        const mapped = data.map((habit) => ({
          id: habit.id.toString(),
          title: habit.name,
          description: habit.description,
          category: habit.category,
          streak: habit.current_streak,
          target: habit.target_count,
          completed: habit.current_streak >= habit.target_count,
          icon: iconMap[habit.category] || iconMap.default,
        }));
        setHabits(mapped);
    } catch (err) {
        setHabits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const categories = [
    { id: 'all', label: 'All', color: 'bg-neutral-400' },
    { id: 'health', label: 'Health', color: 'bg-green-400' },
    { id: 'productivity', label: 'Productivity', color: 'bg-primary-400' },
    { id: 'mindfulness', label: 'Mindfulness', color: 'bg-secondary-400' },
    { id: 'learning', label: 'Learning', color: 'bg-accent-400' }
  ];

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter(habit => habit.category === selectedCategory);

  const recommendations = [
    {
      id: '1',
      title: 'Wake up 30 minutes earlier',
      description: 'Start your day with extra time for yourself',
      category: 'productivity',
      difficulty: 'easy',
      timeCommitment: '5 minutes',
      unlockStreak: 3
    },
    {
      id: '2',
      title: 'Take walking breaks',
      description: 'Short 5-minute walks every hour',
      category: 'health',
      difficulty: 'easy',
      timeCommitment: '5 minutes',
      unlockStreak: 5
    },
    {
      id: '3',
      title: 'Digital sunset',
      description: 'No screens 1 hour before bed',
      category: 'mindfulness',
      difficulty: 'medium',
      timeCommitment: '1 hour',
      unlockStreak: 7
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="text-primary-500" size={32} />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Habit Tracker
          </h1>
        </div>
        
        <Button onClick={() => navigate('/add-habit')}>
          <Target size={20} className="mr-2" />
          Add New Habit
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? `${category.color} text-white shadow-md`
                : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12 text-lg text-gray-500">Loading...</div>
        ) : filteredHabits.length === 0 ? (
          <div className="col-span-full flex justify-center py-12 text-lg text-gray-500">No habits found.</div>
        ) : (
          filteredHabits.map((habit) => (
            <Card key={habit.id} className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{habit.icon}</div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {habit.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {habit.description}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full ${habit.completed ? 'bg-green-500' : 'border-2 border-neutral-300 dark:border-neutral-600'}`}>
                  {habit.completed && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">Current Streak</span>
                  <div className="flex items-center space-x-1">
                    <Flame size={16} className="text-orange-500" />
                    <span className="font-bold text-orange-500">{habit.streak} days</span>
                  </div>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-400 to-secondary-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{habit.streak}/{habit.target} days</span>
                  <span>{habit.target - habit.streak} days to go</span>
                </div>
              </div>

              {habit.streak >= 3 && habit.streak % 3 === 0 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    🎉 Milestone!
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Habit Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Recommended Habits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card blurred key={rec.id} className="border-dashed border-2 border-neutral-300 dark:border-neutral-600">
              <div className="text-center space-y-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                    {rec.description}
                  </p>
                </div>
                
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                  <span className="capitalize">{rec.difficulty}</span>
                  <span>{rec.timeCommitment}</span>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  <Play size={14} className="mr-1" />
                  Try for 5 minutes
                </Button>

                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Unlocks after {rec.unlockStreak}-day streak
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Gamification Section */}
      <Card blurred>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Your Progress
          </h2>
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Level 3</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">12</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Total Streaks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-500 mb-2">40</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Days Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">85%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Success Rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HabitsPage;