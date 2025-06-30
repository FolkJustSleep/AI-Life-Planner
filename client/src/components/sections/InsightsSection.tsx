import React from 'react';
import { BarChart3, TrendingUp, Calendar, Award, Clock, Target } from 'lucide-react';
import { Card } from '../Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Goal, Habit } from '../../types';

export function InsightsSection() {
  const [goals] = useLocalStorage<Goal[]>('goals', []);
  const [habits] = useLocalStorage<Habit[]>('habits', []);

  const completedHabits = habits.filter(habit => habit.streak > 0);
  const avgGoalProgress = goals.length > 0
    ? Math.round(
        goals.reduce((sum, goal) => {
          if (goal.plan && goal.plan.subtasks && goal.plan.subtasks.length > 0) {
            const completed = goal.plan.subtasks.filter(st => st.completed).length;
            return sum + (completed / goal.plan.subtasks.length) * 100;
          }
          return sum;
        }, 0) / goals.length
      )
    : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const weeklyData = [
    { day: 'Mon', tasks: 8, focus: 85 },
    { day: 'Tue', tasks: 6, focus: 78 },
    { day: 'Wed', tasks: 10, focus: 92 },
    { day: 'Thu', tasks: 7, focus: 80 },
    { day: 'Fri', tasks: 9, focus: 88 },
    { day: 'Sat', tasks: 4, focus: 65 },
    { day: 'Sun', tasks: 5, focus: 70 },
  ];

  const maxTasks = Math.max(...weeklyData.map(d => d.tasks));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Insights Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your progress and patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5] w-fit mx-auto mb-3">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {avgGoalProgress}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</div>
        </Card>

        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#D2D0F5] to-[#FFBCFA] w-fit mx-auto mb-3">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {completedHabits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Habits Completed</div>
        </Card>

        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#A8D1E7] w-fit mx-auto mb-3">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {longestStreak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
        </Card>

        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#FFBCFA] w-fit mx-auto mb-3">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {/* {totalHabitDays} */}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Habit Days</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks completed and focus levels</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{day.day}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 dark:text-gray-400">{day.tasks} tasks</span>
                    <span className="text-[#A8D1E7]">{day.focus}% focus</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.tasks / maxTasks) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${day.focus}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Habit Calendar */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#D2D0F5]">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Habit Heatmap</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your consistency over time</p>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 35 }, (_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    intensity > 0.7 ? 'bg-[#A8D1E7]' :
                    intensity > 0.4 ? 'bg-[#A8D1E7]/60' :
                    intensity > 0.2 ? 'bg-[#A8D1E7]/30' :
                    'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              );
            })}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>5 weeks ago</span>
            <div className="flex items-center space-x-1">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-sm" />
                <div className="w-2 h-2 bg-[#A8D1E7]/30 rounded-sm" />
                <div className="w-2 h-2 bg-[#A8D1E7]/60 rounded-sm" />
                <div className="w-2 h-2 bg-[#A8D1E7] rounded-sm" />
              </div>
              <span>More</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card gradient="from-[#A8D1E7]/10 to-[#D2D0F5]/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#A8D1E7]">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 Pattern Detected</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You're most productive on Wednesdays with 92% focus time. Consider scheduling important tasks on this day.
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📈 Improvement Tip</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your weekend productivity drops 35%. Try setting lighter goals or batching easier tasks for weekends.
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Goal Recommendation</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You've completed {completedHabits.length} tasks this week. Consider adding a "Deep Work" habit to boost focus further.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}