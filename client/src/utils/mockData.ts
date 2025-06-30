import { ProductivityPlan, Goal, MoodEntry, FinancialData, Project } from '../types';

export const generateMockPlan = (_goalTitle: string, category: Goal['category']): ProductivityPlan => {
  const plans = {
    productivity: {
      timeBlocks: [
        {
          id: '1',
          title: 'Deep Work Session',
          type: 'deep-work' as const,
          duration: 90,
          description: 'Focus on high-priority tasks without interruptions',
        },
        {
          id: '2',
          title: 'Pomodoro Technique',
          type: 'pomodoro' as const,
          duration: 25,
          description: '25-minute focused work sessions with 5-minute breaks',
        },
        {
          id: '3',
          title: 'Planning Session',
          type: 'planning' as const,
          duration: 30,
          description: 'Review progress and plan upcoming tasks',
        },
      ],
      subtasks: [
        {
          id: '1',
          title: 'Break down large tasks',
          description: 'Divide complex projects into manageable subtasks',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: '2',
          title: 'Set up distraction-free workspace',
          description: 'Remove phones, notifications, and clutter',
          completed: false,
          priority: 'medium' as const,
        },
        {
          id: '3',
          title: 'Use time-blocking technique',
          description: 'Allocate specific time slots for different activities',
          completed: false,
          priority: 'high' as const,
        },
      ],
      habits: [
        {
          id: '1',
          title: 'Morning planning ritual',
          description: 'Spend 10 minutes each morning planning your day',
          frequency: 'daily' as const,
          streak: 0,
          category: 'productivity' as const,
        },
        {
          id: '2',
          title: 'Evening reflection',
          description: 'Review accomplishments and plan for tomorrow',
          frequency: 'daily' as const,
          streak: 0,
          category: 'productivity' as const,
        },
      ],
    },
    health: {
      timeBlocks: [
        {
          id: '1',
          title: 'Morning Exercise',
          type: 'deep-work' as const,
          duration: 45,
          description: 'Start your day with energizing physical activity',
        },
        {
          id: '2',
          title: 'Meal Prep Time',
          type: 'planning' as const,
          duration: 60,
          description: 'Prepare healthy meals for the week',
        },
      ],
      subtasks: [
        {
          id: '1',
          title: 'Set up workout schedule',
          description: 'Plan consistent exercise routine',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: '2',
          title: 'Track water intake',
          description: 'Monitor daily hydration goals',
          completed: false,
          priority: 'medium' as const,
        },
      ],
      habits: [
        {
          id: '1',
          title: '8 glasses of water daily',
          description: 'Stay hydrated throughout the day',
          frequency: 'daily' as const,
          streak: 0,
          category: 'health' as const,
        },
      ],
    },
    career: {
      timeBlocks: [
        {
          id: '1',
          title: 'Skill Development',
          type: 'deep-work' as const,
          duration: 120,
          description: 'Focused learning and skill building',
        },
        {
          id: '2',
          title: 'Networking',
          type: 'planning' as const,
          duration: 30,
          description: 'Connect with industry professionals',
        },
      ],
      subtasks: [
        {
          id: '1',
          title: 'Update resume and portfolio',
          description: 'Refresh professional materials',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: '2',
          title: 'Research industry trends',
          description: 'Stay current with field developments',
          completed: false,
          priority: 'medium' as const,
        },
      ],
      habits: [
        {
          id: '1',
          title: 'Daily learning',
          description: 'Spend 30 minutes learning something new',
          frequency: 'daily' as const,
          streak: 0,
          category: 'learning' as const,
        },
      ],
    },
    personal: {
      timeBlocks: [
        {
          id: '1',
          title: 'Self-reflection',
          type: 'planning' as const,
          duration: 30,
          description: 'Journal and reflect on personal growth',
        },
        {
          id: '2',
          title: 'Hobby time',
          type: 'break' as const,
          duration: 60,
          description: 'Engage in activities you enjoy',
        },
      ],
      subtasks: [
        {
          id: '1',
          title: 'Set personal values',
          description: 'Define what matters most to you',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: '2',
          title: 'Create daily routines',
          description: 'Establish consistent habits',
          completed: false,
          priority: 'medium' as const,
        },
      ],
      habits: [
        {
          id: '1',
          title: 'Gratitude journaling',
          description: 'Write down 3 things you\'re grateful for',
          frequency: 'daily' as const,
          streak: 0,
          category: 'mindfulness' as const,
        },
      ],
    },
    finance: {
      timeBlocks: [
        {
          id: '1',
          title: 'Budget Review',
          type: 'planning' as const,
          duration: 45,
          description: 'Analyze spending and adjust budget',
        },
        {
          id: '2',
          title: 'Investment Research',
          type: 'deep-work' as const,
          duration: 60,
          description: 'Research investment opportunities',
        },
      ],
      subtasks: [
        {
          id: '1',
          title: 'Track all expenses',
          description: 'Monitor spending patterns',
          completed: false,
          priority: 'high' as const,
        },
        {
          id: '2',
          title: 'Set savings goals',
          description: 'Define financial targets',
          completed: false,
          priority: 'high' as const,
        },
      ],
      habits: [
        {
          id: '1',
          title: 'Daily expense tracking',
          description: 'Record all purchases and expenses',
          frequency: 'daily' as const,
          streak: 0,
          category: 'productivity' as const,
        },
      ],
    },
  };

  return plans[category] || plans.productivity;
};

export const mockMoodEntries: MoodEntry[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    mood: 4,
    note: 'Great day at work, finished important project',
    tags: ['work', 'productive'],
  },
  {
    id: '2',
    date: new Date('2024-01-14'),
    mood: 3,
    note: 'Average day, some challenges but managed well',
    tags: ['neutral', 'challenges'],
  },
  {
    id: '3',
    date: new Date('2024-01-13'),
    mood: 5,
    note: 'Amazing day! Went hiking and felt energized',
    tags: ['outdoor', 'exercise', 'happy'],
  },
];

export const mockFinancialData: FinancialData = {
  income: 50000,
  fixedExpenses: 25000,
  variableExpenses: 15000,
  savings: 10000,
  categories: [
    { name: 'Housing', amount: 15000, color: '#A8D1E7' },
    { name: 'Food', amount: 8000, color: '#D2D0F5' },
    { name: 'Transportation', amount: 5000, color: '#FFBCFA' },
    { name: 'Entertainment', amount: 4000, color: '#B8E6B8' },
    { name: 'Healthcare', amount: 3000, color: '#FFE4B5' },
  ],
};

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    priority: 'high',
    deadline: new Date('2024-02-28'),
    progress: 65,
    tasks: [
      {
        id: '1',
        title: 'Create wireframes',
        description: 'Design basic layout structure',
        completed: true,
        priority: 'high',
      },
      {
        id: '2',
        title: 'Develop homepage',
        description: 'Code the main landing page',
        completed: false,
        priority: 'high',
      },
    ],
  },
  {
    id: '2',
    name: 'Learn React',
    description: 'Master React framework for frontend development',
    priority: 'medium',
    progress: 30,
    tasks: [
      {
        id: '3',
        title: 'Complete React tutorial',
        description: 'Go through official React documentation',
        completed: false,
        priority: 'medium',
      },
    ],
  },
];