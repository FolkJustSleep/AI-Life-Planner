import React, { useState } from 'react';
import { Plus, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../Card';
import { Goal } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function GoalsSection() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [newGoal, setNewGoal] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal,
      description: `AI-generated plan for: ${newGoal}`,
      category: 'productivity',
      priority: 'medium',
      progress: 0,
      createdAt: new Date(),
    };
    
    setGoals([...goals, goal]);
    setNewGoal('');
    setShowForm(false);
  };

  const generateAIPlan = (goalTitle: string) => {
    const plans = [
      "Break into 3 weekly milestones with daily 1-hour focused work blocks",
      "Use Pomodoro technique: 25-min work, 5-min break, with deep work in mornings",
      "Create accountability system: weekly check-ins and progress tracking",
      "Start with 15-min daily habit, gradually increase to sustainable routine"
    ];
    return plans[Math.floor(Math.random() * plans.length)];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Goals & AI Planning</h2>
          <p className="text-gray-600 dark:text-gray-400">Transform your aspirations into actionable plans</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {showForm && (
        <Card className="border-2 border-dashed border-[#A8D1E7] dark:border-[#D2D0F5]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What would you like to achieve?
              </label>
              <textarea
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="e.g., I want more time for personal projects, finish tasks before deadlines..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddGoal}
                className="flex-1 py-2 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Generate AI Plan
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FFBCFA]/20 to-[#D2D0F5]/20 rounded-full -mr-10 -mt-10" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {goal.priority}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.title}</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-[#A8D1E7]/20 to-[#D2D0F5]/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Plan</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {generateAIPlan(goal.title)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Started {new Date(goal.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[#A8D1E7] font-medium">{goal.progress}% complete</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {goals.length === 0 && (
          <Card className="col-span-full text-center py-12" gradient="from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by adding your first goal and let AI create a personalized plan for you
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Add Your First Goal
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}