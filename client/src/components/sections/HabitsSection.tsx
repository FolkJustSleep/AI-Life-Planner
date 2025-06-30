import React, { useState } from 'react';
import { Repeat, Flame, Plus, Target, } from 'lucide-react';
import { Card } from '../Card';
import { Habit } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export function HabitsSection() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const navigate = useNavigate();

  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      category: 'productivity',
      frequency: 'daily',
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date(),
    };
    
    setHabits([...habits, habit]);
    setNewHabit('');
    setShowForm(false);
  };

  const markComplete = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const alreadyCompleted = habit.completedDates.includes(today);
        if (alreadyCompleted) return habit;
        
        const newCompletedDates = [...habit.completedDates, today];
        const newCurrentStreak = habit.currentStreak + 1;
        const newBestStreak = Math.max(habit.bestStreak, newCurrentStreak);
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
        };
      }
      return habit;
    }));
  };

  const recommendedHabits = [
    { name: "Morning meditation", description: "Start your day with 5 minutes of mindfulness", category: "mindfulness" },
    { name: "Evening reading", description: "Read for 20 minutes before bed", category: "learning" },
    { name: "Daily exercise", description: "30 minutes of physical activity", category: "health" },
    { name: "Deep work block", description: "2-hour focused work session", category: "productivity" },
  ];

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">Build consistent routines for lasting change</p>
        </div>
        <button
          onClick={() => navigate('/add-habit')}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {showForm && (
        <Card className="border-2 border-dashed border-[#A8D1E7]">
          <div className="space-y-4">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="What habit would you like to build?"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
            />
            <div className="flex space-x-3">
              <button
                onClick={addHabit}
                className="flex-1 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Current Habits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <Card key={habit.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#A8D1E7]/30 to-[#D2D0F5]/30 rounded-full -mr-8 -mt-8" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
                  <Repeat className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {habit.currentStreak}
                  </span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{habit.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Current streak</span>
                  <span className="text-orange-500 font-medium">{habit.currentStreak} days</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Best streak</span>
                  <span className="text-green-500 font-medium">{habit.bestStreak} days</span>
                </div>
                
                <button
                  onClick={() => markComplete(habit.id)}
                  disabled={isCompletedToday(habit)}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                    isCompletedToday(habit)
                      ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#A8D1E7] hover:to-[#D2D0F5] hover:text-white hover:shadow-lg'
                  }`}
                >
                  {isCompletedToday(habit) ? '✓ Completed Today' : 'Mark Complete'}
                </button>
                
                {habit.currentStreak >= 3 && (
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg text-center">
                    <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      🔥 {habit.currentStreak}-day streak! Keep it up!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommended Habits */}
      {habits.length < 3 && (
        <Card gradient="from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#D2D0F5]">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Habits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Based on your goals and patterns</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {recommendedHabits.map((habit, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#FFBCFA] dark:hover:border-[#D2D0F5] transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setNewHabit(habit.name);
                  setShowForm(true);
                }}
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{habit.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{habit.description}</p>
                <span className="text-xs px-2 py-1 bg-[#FFBCFA]/20 text-[#FFBCFA] dark:text-[#D2D0F5] rounded-full">
                  {habit.category}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {habits.length === 0 && (
        <Card className="text-center py-12" gradient="from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No habits yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start building consistent routines that will transform your life
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Create Your First Habit
          </button>
        </Card>
      )}
    </div>
  );
}