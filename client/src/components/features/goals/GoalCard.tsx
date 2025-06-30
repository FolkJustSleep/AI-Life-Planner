import React from 'react';
import { Target, Clock, Zap, Users, DollarSign, User } from 'lucide-react';
import Card from '../../ui/Card';
import { Goal } from '../../../types';
import { format } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const categoryIcons = {
    productivity: Target,
    health: Zap,
    career: Users,
    personal: User,
    finance: DollarSign
  };

  const categoryColors = {
    productivity: 'bg-primary-400',
    health: 'bg-green-400',
    career: 'bg-secondary-400',
    personal: 'bg-accent-400',
    finance: 'bg-yellow-400'
  };

  const Icon = categoryIcons[goal.category];

  return (
    <Card hover onClick={onClick} className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${categoryColors[goal.category]}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex items-center space-x-1 text-sm text-neutral-500 dark:text-neutral-400">
          <Clock size={14} />
          <span>{format(goal.createdAt, 'MMM d')}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
        {goal.title}
      </h3>

      <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 line-clamp-3">
        {goal.description}
      </p>

      {goal.plan && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Time Blocks</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {goal.plan.timeBlocks.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Tasks</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {goal.plan.subtasks.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Habits</span>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {goal.plan.habits.length}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[goal.category]} text-white`}>
          {goal.category}
        </span>
      </div>
    </Card>
  );
};

export default GoalCard;