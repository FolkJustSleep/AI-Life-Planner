import React, { useState } from 'react';
import { Calendar, Clock, Zap, Leaf, CheckSquare, Plus } from 'lucide-react';
import { Card } from '../Card';
import { Task, PlannerMode } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function ScheduleSection() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [plannerMode, setPlannerMode] = useLocalStorage<PlannerMode>('plannerMode', {
    type: 'sustainable',
    preferences: {
      workBlockDuration: 50,
      breakDuration: 10,
      deepWorkHours: [9, 10, 11],
      maxTasksPerDay: 6
    }
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      estimatedMinutes: 30,
      category: 'work',
      priority: 'medium',
      scheduledFor: new Date(),
      createdAt: new Date(),
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setShowTaskForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const generateTimeBlocks = () => {
    const blocks = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const isDeepWork = plannerMode.preferences.deepWorkHours.includes(hour);
      blocks.push({
        time: `${hour}:00 - ${hour + 1}:00`,
        type: isDeepWork ? 'Deep Work' : 'Regular Tasks',
        color: isDeepWork ? 'from-[#A8D1E7] to-[#D2D0F5]' : 'from-[#D2D0F5] to-[#FFBCFA]'
      });
    }
    
    return blocks;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule & Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400">Organize your day with AI-optimized time blocks</p>
        </div>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Planner Mode Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Planning Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your productivity approach
            </p>
          </div>
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
            <button
              onClick={() => setPlannerMode({...plannerMode, type: 'speed'})}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                plannerMode.type === 'speed'
                  ? 'bg-gradient-to-r from-[#FFBCFA] to-[#A8D1E7] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Speed</span>
            </button>
            <button
              onClick={() => setPlannerMode({...plannerMode, type: 'sustainable'})}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                plannerMode.type === 'sustainable'
                  ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Leaf className="h-4 w-4" />
              <span className="text-sm font-medium">Sustainable</span>
            </button>
          </div>
        </div>
      </Card>

      {showTaskForm && (
        <Card className="border-2 border-dashed border-[#D2D0F5]">
          <div className="space-y-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#D2D0F5] focus:border-transparent"
            />
            <div className="flex space-x-3">
              <button
                onClick={addTask}
                className="flex-1 py-2 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowTaskForm(false)}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Time Blocks */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plannerMode.type === 'speed' ? 'High-intensity focus blocks' : 'Balanced work rhythm'}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {generateTimeBlocks().map((block, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl bg-gradient-to-r ${block.color} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{block.time}</span>
                  </div>
                  <span className="text-sm opacity-90">{block.type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Task List */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#D2D0F5]">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tasks.filter(t => !t.completed).length} pending, {tasks.filter(t => t.completed).length} completed
              </p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] border-transparent'
                        : 'border-gray-300 dark:border-gray-500 hover:border-[#A8D1E7]'
                    }`}
                  >
                    {task.completed && <CheckSquare className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      task.completed
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ~{task.estimatedMinutes}min
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}