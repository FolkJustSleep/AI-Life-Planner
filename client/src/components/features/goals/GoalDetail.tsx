import React, { useState } from 'react';
import { Clock, CheckSquare, Zap, Calendar, Play } from 'lucide-react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Goal } from '../../../types';

interface GoalDetailProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

const GoalDetail: React.FC<GoalDetailProps> = ({ goal, isOpen, onClose }) => {
  const [planType, setPlanType] = useState<'speed' | 'sustainable'>('speed');

  if (!goal || !goal.plan) return null;

  const { timeBlocks, subtasks, habits } = goal.plan;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal.title}
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-neutral-700 dark:text-neutral-300">{goal.description}</p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={planType === 'speed' ? 'primary' : 'outline'}
            onClick={() => setPlanType('speed')}
            size="sm"
          >
            <Zap size={16} className="mr-1" />
            Speed-focused
          </Button>
          <Button
            variant={planType === 'sustainable' ? 'primary' : 'outline'}
            onClick={() => setPlanType('sustainable')}
            size="sm"
          >
            <Calendar size={16} className="mr-1" />
            Sustainable
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <Clock size={20} className="text-primary-500" />
              <span>Time Blocks</span>
            </h3>
            <div className="space-y-3">
              {timeBlocks.map((block) => (
                <div key={block.id} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      {block.title}
                    </h4>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {block.duration}min
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {block.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              <CheckSquare size={20} className="text-secondary-500" />
              <span>Action Steps</span>
            </h3>
            <div className="space-y-3">
              {subtasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 rounded mt-0.5"></div>
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      {task.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            <Zap size={20} className="text-accent-500" />
            <span>Suggested Habits</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <div key={habit.id} className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  {habit.title}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                  {habit.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                    {habit.frequency}
                  </span>
                  <Button size="sm" variant="outline">
                    <Play size={14} className="mr-1" />
                    Try for 5min
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default GoalDetail;