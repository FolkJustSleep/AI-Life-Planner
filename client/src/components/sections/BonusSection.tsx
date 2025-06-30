import React, { useState } from 'react';
import { Heart, Timer, RotateCcw, Briefcase, Music, Smile } from 'lucide-react';
import { Card } from '../Card';
import { MoodEntry } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function BonusSection() {
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('moodEntries', []);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState<number | null>(null);
  const [moodNotes, setMoodNotes] = useState('');
  const [focusTimer, setFocusTimer] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const energyLabels = ['Exhausted', 'Low', 'Okay', 'Good', 'Energized'];

  const saveMoodEntry = () => {
    if (currentMood === null || currentEnergy === null) return;

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood as 1 | 2 | 3 | 4 | 5,
      energy: currentEnergy as 1 | 2 | 3 | 4 | 5,
      notes: moodNotes,
    };

    setMoodEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      }
      return [...prev, entry];
    });

    setCurrentMood(null);
    setCurrentEnergy(null);
    setMoodNotes('');
  };

  const startFocusTimer = () => {
    setIsTimerRunning(true);
    setTimerMinutes(focusTimer);
    setTimerSeconds(0);
    
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev === 0) {
          setTimerMinutes(prevMin => {
            if (prevMin === 0) {
              setIsTimerRunning(false);
              clearInterval(interval);
              return focusTimer;
            }
            return prevMin - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(focusTimer);
    setTimerSeconds(0);
  };

  const weeklyReflection = {
    completedGoals: 3,
    totalGoals: 5,
    avgMood: moodEntries.length > 0 ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1) : '4.2',
    suggestedAdjustments: [
      "Consider reducing your daily task load by 20%",
      "Add a 10-minute morning meditation to improve focus",
      "Schedule more breaks between deep work sessions"
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bonus Features</h2>
        <p className="text-gray-600 dark:text-gray-400">Additional tools for well-being and productivity</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mood Tracker */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#A8D1E7]">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mood Tracker</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily mood and energy</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How are you feeling today?
              </label>
              <div className="flex justify-between">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMood(index + 1)}
                    className={`text-3xl p-3 rounded-xl transition-all duration-200 ${
                      currentMood === index + 1
                        ? 'bg-gradient-to-r from-[#FFBCFA] to-[#A8D1E7] scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Energy Level
              </label>
              <div className="space-y-2">
                {energyLabels.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentEnergy(index + 1)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      currentEnergy === index + 1
                        ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                placeholder="Any notes about your day?"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#FFBCFA] focus:border-transparent resize-none"
                rows={2}
              />
            </div>

            <button
              onClick={saveMoodEntry}
              disabled={currentMood === null || currentEnergy === null}
              className="w-full py-3 bg-gradient-to-r from-[#FFBCFA] to-[#A8D1E7] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Today's Mood
            </button>
          </div>
        </Card>

        {/* Focus Timer */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
              <Timer className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Timer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pomodoro technique with ambient sounds</p>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="relative">
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-[#A8D1E7] transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * ((focusTimer * 60 - timerMinutes * 60 - timerSeconds) / (focusTimer * 60)) - Math.PI/2)}% ${50 + 50 * Math.sin(2 * Math.PI * ((focusTimer * 60 - timerMinutes * 60 - timerSeconds) / (focusTimer * 60)) - Math.PI/2)}%, 50% 50%)`
                }}
              ></div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <select
                value={focusTimer}
                onChange={(e) => setFocusTimer(Number(e.target.value))}
                disabled={isTimerRunning}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              >
                <option value={25}>25 min (Pomodoro)</option>
                <option value={15}>15 min (Short)</option>
                <option value={45}>45 min (Deep Work)</option>
                <option value={90}>90 min (Flow State)</option>
              </select>
            </div>

            <div className="flex justify-center space-x-4">
              {!isTimerRunning ? (
                <button
                  onClick={startFocusTimer}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Timer className="h-4 w-4" />
                  <span>Start Focus</span>
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200"
                >
                  <span>Stop</span>
                </button>
              )}
            </div>

            <div className="p-4 bg-gradient-to-r from-[#A8D1E7]/10 to-[#D2D0F5]/10 rounded-xl">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Music className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Ambient Sounds</span>
              </div>
              <div className="flex justify-center space-x-2">
                {['Rain', 'Forest', 'Ocean', 'Cafe'].map((sound) => (
                  <button
                    key={sound}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-[#A8D1E7] hover:text-white transition-colors duration-200"
                  >
                    {sound}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Reflect & Reset */}
      <Card gradient="from-[#D2D0F5]/20 to-[#FFBCFA]/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#D2D0F5] to-[#FFBCFA]">
            <RotateCcw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Reflect & Reset</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyze your week and plan ahead</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {weeklyReflection.completedGoals}/{weeklyReflection.totalGoals}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Goals Completed</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyReflection.completedGoals / weeklyReflection.totalGoals) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">{moodEmojis[Math.floor(Number(weeklyReflection.avgMood)) - 1] || '😊'}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{weeklyReflection.avgMood}/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Mood</div>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">📝 Suggested Adjustments</h4>
            <div className="space-y-2">
              {weeklyReflection.suggestedAdjustments.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  • {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200">
            Start New Week Planning
          </button>
        </div>
      </Card>

      {/* Project Manager Preview */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#FFBCFA]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Manager</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Prioritize and track ongoing projects</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'Website Redesign', progress: 75, priority: 'high', tasks: 8 },
            { name: 'Mobile App MVP', progress: 40, priority: 'medium', tasks: 12 },
            { name: 'Content Strategy', progress: 20, priority: 'low', tasks: 5 },
          ].map((project, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#D2D0F5] transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  project.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {project.priority}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{project.tasks} tasks</span>
                  <span className="text-[#D2D0F5] font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#D2D0F5] to-[#A8D1E7] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-gradient-to-r from-[#A8D1E7] to-[#FFBCFA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200">
            Manage All Projects
          </button>
        </div>
      </Card>
    </div>
  );
}