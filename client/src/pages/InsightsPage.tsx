import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const InsightsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const focusData = [
    { time: '9 AM', focus: 90, distraction: 10 },
    { time: '10 AM', focus: 85, distraction: 15 },
    { time: '11 AM', focus: 75, distraction: 25 },
    { time: '12 PM', focus: 60, distraction: 40 },
    { time: '1 PM', focus: 45, distraction: 55 },
    { time: '2 PM', focus: 70, distraction: 30 },
    { time: '3 PM', focus: 80, distraction: 20 },
    { time: '4 PM', focus: 88, distraction: 12 },
    { time: '5 PM', focus: 75, distraction: 25 }
  ];

  const timeUsageData = [
    { name: 'Deep Work', value: 35, color: '#A8D1E7' },
    { name: 'Meetings', value: 20, color: '#D2D0F5' },
    { name: 'Email', value: 15, color: '#FFBCFA' },
    { name: 'Planning', value: 12, color: '#B8E6B8' },
    { name: 'Breaks', value: 18, color: '#FFE4B5' }
  ];

  const trendData = [
    { week: 'Week 1', productivity: 65, mood: 70, energy: 60 },
    { week: 'Week 2', productivity: 72, mood: 75, energy: 68 },
    { week: 'Week 3', productivity: 78, mood: 80, energy: 75 },
    { week: 'Week 4', productivity: 85, mood: 85, energy: 82 }
  ];

const monthColors = ['#A8D1E7', '#D2D0F5', '#FFBCFA', '#B8E6B8'];
const yearColors = [
    '#FFF9C4', // Jan - pastel yellow
    '#F8BBD0', // Feb - pastel pink
    '#C8E6C9', // Mar - pastel green
    '#FFE0B2', // Apr - pastel orange
    '#BBDEFB', // May - pastel blue
    '#E1BEE7', // Jun - pastel purple
    '#FFCDD2', // Jul - pastel red
    '#D1C4E9', // Aug - pastel lavender
    '#B2DFDB', // Sep - pastel teal
    '#FFECB3', // Oct - light amber
    '#DCEDC8', // Nov - pastel lime
    '#B3E5FC'  // Dec - pastel sky
    ];  

// 👇 เปลี่ยนข้อมูลให้สอดคล้องกับ timeRange
const completionData =
  timeRange === 'week'
    ? [
        { name: 'Mon', completed: 85 },
        { name: 'Tue', completed: 92 },
        { name: 'Wed', completed: 78 },
        { name: 'Thu', completed: 88 },
        { name: 'Fri', completed: 95 },
        { name: 'Sat', completed: 70 },
        { name: 'Sun', completed: 82 }
      ]
    : timeRange === 'month'
    ? [
        { name: 'Week 1', completed: 80 },
        { name: 'Week 2', completed: 85 },
        { name: 'Week 3', completed: 78 },
        { name: 'Week 4', completed: 90 }
      ]
    : [
        { name: 'Jan', completed: 75 },
        { name: 'Feb', completed: 78 },
        { name: 'Mar', completed: 80 },
        { name: 'Apr', completed: 85 },
        { name: 'May', completed: 90 },
        { name: 'Jun', completed: 88 },
        { name: 'Jul', completed: 86 },
        { name: 'Aug', completed: 84 },
        { name: 'Sep', completed: 82 },
        { name: 'Oct', completed: 85 },
        { name: 'Nov', completed: 87 },
        { name: 'Dec', completed: 89 }
      ];

      const dayColorMap: Record<string, string> = {
          Mon: '#FFF9C4',
          Tue: '#F8BBD0',
          Wed: '#C8E6C9',
          Thu: '#FFE0B2',
          Fri: '#BBDEFB',
          Sat: '#E1BEE7',
          Sun: '#FFCDD2'
        };


  const heatmapData = Array.from({ length: 7 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => ({
      week,
      day,
      value: Math.floor(Math.random() * 100)
    }))
  ).flat();

  return (
    <div className="space-y-8">
      <Card blurred>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-primary-500" size={32} />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Productivity Insights
            </h1>
          </div>
          
          <div className="flex space-x-2">
  {(['week', 'month', 'year'] as const).map((range) => {
    const isActive = timeRange === range;

    const bgColor = isActive
      ? range === 'week'
        ? '#A8D1E7'
        : range === 'month'
        ? '#D2D0F5'
        : '#FFBCFA'
      : 'transparent';

    const textColor = isActive
      ? range === 'week'
        ? '#1E3A8A' // navy-ish
        : range === 'month'
        ? '#4B0082' // indigo
        : '#8B005D' // deep pink
      : '#374151'; // neutral-700

    return (
      <Button
        key={range}
        size="sm"
        onClick={() => setTimeRange(range)}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: isActive ? 'none' : '1px solid #D1D5DB', // border-neutral-300
          padding: '0.25rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {range.charAt(0).toUpperCase() + range.slice(1)}
      </Button>
    );
  })}
  </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">85%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Avg Completion</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+5% from last week</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-secondary-500 mb-2">6.2h</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Focus Time</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+30min from last week</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">12</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Habit Streaks</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+2 new streaks</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">4.2</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-300">Avg Mood</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+0.3 from last week</div>
          </Card>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Completion Percentage */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
      {timeRange === 'week'
      ? 'Daily Completion Rate'
      : timeRange === 'month'
      ? 'Weekly Completion Rate'
      : 'Monthly Completion Rate'}
  </h2>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={completionData}>
          <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="name" />
           <YAxis />
          <Tooltip />
        <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
          {completionData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                timeRange === 'week'
                  ? dayColorMap[entry.name] || '#A8D1E7' // fallback
                  : timeRange === 'month'
                  ? monthColors[index % monthColors.length]
                  : yearColors[index % yearColors.length]
              }
            />
          ))}
        </Bar>
      </BarChart>
  </ResponsiveContainer>
</Card>

        {/* Focus vs Distraction */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Focus vs Distraction Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="focus" stroke="#A8D1E7" strokeWidth={3} />
              <Line type="monotone" dataKey="distraction" stroke="#FFBCFA" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Time Usage Pie Chart */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Time Usage Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeUsageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {timeUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Trend Analysis */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Monthly Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="productivity" stroke="#A8D1E7" strokeWidth={3} />
              <Line type="monotone" dataKey="mood" stroke="#D2D0F5" strokeWidth={3} />
              <Line type="monotone" dataKey="energy" stroke="#FFBCFA" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Activity Heatmap - Last 7 Weeks
        </h2>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.map((item, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-sm"
              style={{
                backgroundColor: `rgba(168, 209, 231, ${item.value / 100})`,
              }}
              title={`Week ${item.week + 1}, Day ${item.day + 1}: ${item.value}%`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
              <div
                key={opacity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `rgba(168, 209, 231, ${opacity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>

      {/* Insights and Recommendations */}
      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          AI Insights & Recommendations
        </h2>
        <div className="space-y-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="text-primary-500 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-primary-700 dark:text-primary-300 mb-1">
                  Peak Performance Window
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Your focus peaks between 9-11 AM and 3-5 PM. Schedule your most important tasks during these windows.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Calendar className="text-secondary-500 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
                  Consistent Improvement
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  You've improved productivity by 20% over the last month. Keep up the excellent work!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="text-accent-500 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-accent-700 dark:text-accent-300 mb-1">
                  Break Optimization
                </h3>
                <p className="text-sm text-accent-600 dark:text-accent-400">
                  Consider shorter, more frequent breaks. Your energy dips significantly after 90 minutes of work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsPage;