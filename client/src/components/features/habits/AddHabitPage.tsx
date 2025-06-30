import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../Card';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Habit } from '../../../types';
import { HabitsModel } from '../../../models/habits_model.ts';
import { HabitService } from '../../../services/habits_service';

export default function AddHabitPage() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [category, setCategory] = useState<Habit['category']>('productivity');
  const navigate = useNavigate();
  const handlerAddHabit = async () => {
    const Habitsdata: HabitsModel = {
      userid: '',
      name: name,
      description: details,
      frequency: frequency,
      category: category,
      target_count: targetCount,
      current_streak: 0,
      completed_dates: completedDates
    }
    try {
      console.log('Saving habit:', typeof(Habitsdata.target_count));
      const response = await HabitService.saveHabits(Habitsdata);
      alert(`Profile saved successfully: ${response.message || ''}`);
    } catch (error) {
      const err = error as Error;
      alert(`Error saving profile: ${err.message}`);
    }
    navigate(-1);
  }

  // const handleAdd = () => {
  //   if (!name.trim()) return;
  //   const habit: Habit = {
  //     id: Date.now().toString(),
  //     name,
  //     details,
  //     frequency,
  //     targetCount,
  //     completedDates,
  //     category,
  //     currentStreak: 0,
  //     bestStreak: 0,
  //     createdAt: new Date(),
  //   };
  //   setHabits([...habits, habit]);
  //   navigate(-1);
  // };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Habit</h2>
        <div className="space-y-4">
          {/* Habit Name */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">The title of your habit (e.g., "Drink Water").</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Habit Name"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
          />
          {/* Details */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">A short description or motivation for this habit.</label>
          <input
            type="text"
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Details"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
          />
          {/* Frequency */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">How often you want to do this habit.</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as Habit['frequency'])}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {/* Target Count */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">The number of times you aim to complete this habit in the selected frequency.</label>
          <input
            type="number"
            min={1}
            value={targetCount}
            onChange={e => setTargetCount(Number(e.target.value))}
            placeholder="Target Count"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
          />
          {/* Completed Dates */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">(Optional) Dates you already completed this habit, in YYYY-MM-DD format, separated by commas.</label>
          <input
            type="text"
            value={completedDates.join(',')}
            onChange={e => setCompletedDates(e.target.value.split(','))}
            placeholder="Completed Dates (comma separated YYYY-MM-DD)"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
          />
          {/* Category */}
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">The type of habit (e.g., productivity, health, learning, mindfulness).</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Habit['category'])}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="productivity">Productivity</option>
            <option value="health">Health</option>
            <option value="learning">Learning</option>
            <option value="mindfulness">Mindfulness</option>
          </select>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handlerAddHabit}
              className="flex-1 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Add Habit
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
