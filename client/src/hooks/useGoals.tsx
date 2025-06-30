import { useState, useCallback } from 'react';
import { Goal } from '../types';
import { generateMockPlan } from '../utils/mockData';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  // Add a new goal
  const addGoal = useCallback(async (title: string, description: string, category: Goal['category']) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      category,
      priority: 'medium',
      createdAt: new Date(),
      plan: generateMockPlan(title, category)
    };
    setGoals(prev => [...prev, newGoal]);
    setLoading(false);
    return newGoal;
  }, []);

  // Update an existing goal
  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => goal.id === id ? { ...goal, ...updates } : goal));
  }, []);

  // Delete a goal
  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  }, []);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal
  };
};