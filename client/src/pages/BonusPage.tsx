import React, { useState, useEffect } from 'react';
import { Star, Heart, Music, Clock, RotateCcw, Play, Pause } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import { mockProjects } from '../utils/mockData';
import { MoodService } from '../services/mood_service';
import { MoodRequestModel, MoodData, MoodResponseModel } from '../models/mood_model';

const BonusPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodData[]>([]);
  const [currentSession, setCurrentSession] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Bad', color: 'text-red-500' },
    { value: 2, emoji: '😕', label: 'Bad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Excellent', color: 'text-blue-500' }
  ];

  const sessionTypes = {
    work: { duration: 25 * 60, label: 'Focus Time', color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' }
  };

  const getCurrentSessionInfo = () => sessionTypes[currentSession];

  const getNextSession = () => {
    if (currentSession === 'work') {
      const nextPomodoroCount = completedPomodoros + 1;
      // Every 4th completed pomodoro gets a long break
      return nextPomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  };

  const startNextSession = () => {
    const nextSessionType = getNextSession();
    
    if (currentSession === 'work') {
      setCompletedPomodoros(prev => prev + 1);
    }
    
    setCurrentSession(nextSessionType);
    setPomodoroTime(sessionTypes[nextSessionType].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            // Session completed - show completion message and prepare next session
            const sessionInfo = getCurrentSessionInfo();
            const nextSessionInfo = sessionTypes[getNextSession()];
            
            if (currentSession === 'work') {
              alert(`🍅 Pomodoro completed! Great focus session!\n\nNext up: ${nextSessionInfo.label} (${Math.floor(nextSessionInfo.duration / 60)} minutes)`);
            } else {
              alert(`✨ Break time over! Feeling refreshed?\n\nNext up: ${nextSessionInfo.label} (${Math.floor(nextSessionInfo.duration / 60)} minutes)`);
            }
            
            startNextSession();
            return sessionTypes[getNextSession()].duration;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, pomodoroTime]);

  // Reset timer when focus mode is disabled
  useEffect(() => {
    if (!focusMode) {
      setIsRunning(false);
      setCurrentSession('work');
      setPomodoroTime(25 * 60);
      setCompletedPomodoros(0);
    }
  }, [focusMode]);

  const fetchMood = async () => {
    try {
      const response: MoodResponseModel = await MoodService.getMoodOfCurrentUser();
      const moodArray: MoodData[] = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setMoodEntries(moodArray.reverse());
    } catch (error) {
      console.error('Error fetching mood:', error);
    }
  };

  useEffect(() => {
    fetchMood();
  }, []);

  const handleMoodSubmit = () => {
    if (selectedMood) {
      const moodRequest: MoodRequestModel = {
        mood: moods[selectedMood - 1].label,
        note: moodNote,
        user_id: '',
      };
      MoodService.saveMood(moodRequest)
        .then(() => {
          alert('Mood logged successfully!');
          fetchMood();
        })
        .catch(() => {
          alert('Failed to log mood. Please try again later.');
        });

      setSelectedMood(null);
      setMoodNote('');
    }
  };

  const handleTimerReset = () => {
    setCurrentSession('work');
    setPomodoroTime(25 * 60);
    setIsRunning(false);
    setCompletedPomodoros(0);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleSkipSession = () => {
    setIsRunning(false);
    startNextSession();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Star className="text-primary-500" size={32} />
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Bonus Features</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <Heart className="text-accent-500" size={24} />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Mood Tracker</h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">How are you feeling today?</p>
              <div className="flex justify-between">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${selectedMood === mood.value
                      ? 'bg-primary-100 dark:bg-primary-900/20 scale-110'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                  >
                    <span className="text-3xl mb-2">{mood.emoji}</span>
                    <span className={`text-xs font-medium ${mood.color}`}>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Add a note (optional)
              </label>
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>

            <Button onClick={handleMoodSubmit} disabled={!selectedMood} className="w-full">
              Log Mood
            </Button>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Recent Entries</h3>
              <div className="space-y-2">
                {moodEntries.slice(0, 3).map((entry) => {
                  const moodIndex = moods.findIndex((m) => m.label.toLowerCase() === entry.mood.toLowerCase());
                  const mood = moods[moodIndex];
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{mood?.emoji || '❓'}</span>
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {mood?.label || entry.mood}
                          </div>
                          {entry.note && (
                            <div className="text-xs text-neutral-600 dark:text-neutral-300">{entry.note}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="text-secondary-500" size={24} />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Focus Mode</h2>
            </div>
            <Toggle checked={focusMode} onChange={setFocusMode} label="Enable Focus Mode" />
          </div>

          {focusMode ? (
            <div className="space-y-6">
              <div className="text-center">
                {/* Session Type Indicator */}
                <div className={`inline-block px-4 py-2 rounded-full mb-4 ${getCurrentSessionInfo().bgColor}`}>
                  <span className={`text-sm font-semibold ${getCurrentSessionInfo().color}`}>
                    {getCurrentSessionInfo().label}
                  </span>
                </div>
                
                {/* Pomodoro Counter */}
                <div className="mb-4">
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">Completed Pomodoros:</span>
                    <span className="text-lg font-bold text-primary-500">{completedPomodoros}</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4].map((num) => (
                      <div
                        key={num}
                        className={`w-3 h-3 rounded-full ${
                          num <= (completedPomodoros % 4) || (completedPomodoros % 4 === 0 && completedPomodoros > 0 && num <= 4)
                            ? 'bg-red-500'
                            : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer Display */}
                <div className={`text-6xl font-bold mb-4 transition-colors duration-300 ${
                  isRunning 
                    ? getCurrentSessionInfo().color
                    : 'text-neutral-400'
                }`}>
                  {formatTime(pomodoroTime)}
                </div>
                
                {/* Timer Controls */}
                <div className="flex justify-center space-x-3">
                  <Button 
                    onClick={handlePlayPause} 
                    variant={isRunning ? 'secondary' : 'primary'}
                    className="flex items-center space-x-2"
                  >
                    {isRunning ? (
                      <>
                        <Pause size={20} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        <span>Start</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSkipSession}
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={isRunning}
                  >
                    <span>Skip</span>
                  </Button>
                  
                  <Button
                    onClick={handleTimerReset}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
                
                {/* Next Session Preview */}
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                  Next: {sessionTypes[getNextSession()].label} ({Math.floor(sessionTypes[getNextSession()].duration / 60)} min)
                </div>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Music className="text-accent-500" size={20} />
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Lo-fi Music Player</h3>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-neutral-400 dark:text-neutral-600 mb-4">
                <Clock size={48} className="mx-auto" />
              </div>
              <p className="text-neutral-600 dark:text-neutral-300">
                Enable Focus Mode to access the Pomodoro timer and lo-fi music player
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BonusPage;