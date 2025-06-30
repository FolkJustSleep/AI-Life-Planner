import React, { useState } from 'react';
import { Target, Sparkles } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
import { Goal } from '../../../types';

interface GoalInputProps {
  onGoalSubmit: (title: string, description: string, category: Goal['category']) => void;
  loading?: boolean;
}

const GoalInput: React.FC<GoalInputProps> = ({ onGoalSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Goal['category']>('productivity');

  const categories = [
    { value: 'productivity', label: 'Productivity', color: 'bg-primary-400' },
    { value: 'health', label: 'Health', color: 'bg-green-400' },
    { value: 'career', label: 'Career', color: 'bg-secondary-400' },
    { value: 'personal', label: 'Personal', color: 'bg-accent-400' },
    { value: 'finance', label: 'Finance', color: 'bg-yellow-400' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onGoalSubmit(title.trim(), description.trim(), category);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Card className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="text-primary-500" size={24} />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Set Your Goal
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., I want to finish projects earlier"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value as Goal['category'])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat.value
                    ? `${cat.color} text-white shadow-md`
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal in detail. What do you want to achieve? Why is this important to you?"
            rows={4}
            className="block w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!title.trim() || !description.trim()}
          className="w-full"
        >
          <Sparkles size={20} className="mr-2" />
          {loading ? 'Generating AI Plan...' : 'Generate AI Plan'}
        </Button>
      </form>
    </Card>
  );
};

export default GoalInput;