import React, { useState } from 'react';
import { Calendar, Clock, Zap, MoreHorizontal } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';

const PlannerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [planType, setPlanType] = useState<'speed' | 'sustainable'>('speed');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const mockTasks = [
    {
      id: '1',
      title: 'Deep Work Session',
      time: '9:00 AM - 10:30 AM',
      category: 'productivity',
      color: 'bg-primary-400',
      completed: false
    },
    {
      id: '2',
      title: 'Review project proposal',
      time: '11:00 AM - 12:00 PM',
      category: 'work',
      color: 'bg-secondary-400',
      completed: true
    },
    {
      id: '3',
      title: 'Team meeting',
      time: '2:00 PM - 3:00 PM',
      category: 'meeting',
      color: 'bg-accent-400',
      completed: false
    }
  ];

  const dayColors: { [key: string]: string } = {
    Mon: '#FFEE58',
    Tue: '#F8BBD0',
    Wed: '#C8E6C9',
    Thu: '#FFE0B2',
    Fri: '#BBDEFB',
    Sat: '#E1BEE7',
    Sun: '#FFCDD2'
  };

  const planColorMap = {
    weekly: {
      speed: {
        bg: '#A8D1E7',
        text: '#1E3A8A'
      },
      sustainable: {
        bg: '#D2D0F5',
        text: '#4B0082'
      }
    },
    daily: {
      speed: {
        bg: '#FFBCFA',
        text: '#8B005D'
      },
      sustainable: {
        bg: '#FFE4B5',
        text: '#A05A00'
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card blurred>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="text-primary-500" size={32} />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Dynamic Planner
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Toggle View Mode */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-300">Daily</span>
              <Toggle
                checked={viewMode === 'weekly'}
                onChange={(checked) => setViewMode(checked ? 'weekly' : 'daily')}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">Weekly</span>
            </div>

            {/* Plan Type Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setPlanType('speed')}
                size="sm"
                style={{
                  backgroundColor: planType === 'speed' ? planColorMap[viewMode].speed.bg : 'transparent',
                  color: planType === 'speed' ? planColorMap[viewMode].speed.text : '#374151',
                  border: planType === 'speed' ? 'none' : '1px solid #D1D5DB',
                  padding: '0.25rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Zap size={16} className="mr-1" />
                Speed-focused
              </Button>
              <Button
                onClick={() => setPlanType('sustainable')}
                size="sm"
                style={{
                  backgroundColor: planType === 'sustainable' ? planColorMap[viewMode].sustainable.bg : 'transparent',
                  color: planType === 'sustainable' ? planColorMap[viewMode].sustainable.text : '#374151',
                  border: planType === 'sustainable' ? 'none' : '1px solid #D1D5DB',
                  padding: '0.25rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Clock size={16} className="mr-1" />
                Sustainable
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {viewMode === 'weekly' ? (
        <Card blurred>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-8 gap-4 mb-4">
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Time</div>
                {weekDays.map((day) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      {day}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Jan {Math.floor(Math.random() * 28) + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-4">
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 py-2">{time}</div>
                    {weekDays.map((day) => (
                      <div
                        key={`${day}-${time}`}
                        className="h-12 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        {Math.random() > 0.8 && (
                          <div
                            className="h-full rounded-lg p-2 text-white text-xs font-medium"
                            style={{ backgroundColor: dayColors[day] }}
                          >
                            Task
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card blurred>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                Today's Schedule
              </h2>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-l-4 ${task.color} bg-neutral-50 dark:bg-neutral-800`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" checked={task.completed} className="w-5 h-5 rounded" />
                        <div>
                          <h3
                            className={`font-medium ${
                              task.completed
                                ? 'line-through text-neutral-500'
                                : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {task.title}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">{task.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card blurred>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Quick Add Task
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
                <Button size="sm" className="w-full">
                  Add Task
                </Button>
              </div>
            </Card>

            <Card blurred>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Today's Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-300">Completed</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">3/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-300">Focus Time</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">2.5h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-300">Productivity</span>
                  <span className="font-medium text-green-600 dark:text-green-400">85%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerPage;