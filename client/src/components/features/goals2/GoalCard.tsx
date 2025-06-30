import React, { useState } from 'react';
import { GoalCardData } from '../../../models/lifegoal_model';

interface GoalCardProps {
  goal: GoalCardData;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const [showAiPlan, setShowAiPlan] = useState(false);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 min-w-[260px] max-w-xs flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">🎯</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{goal.date}</span>
      </div>
      
      <div className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
        {goal.title}
      </div>
      
      <div className="text-gray-700 dark:text-gray-300 text-sm mb-2">
        {goal.description}
      </div>

      {/* AI Plan Section */}
      <div className="mb-3">
        <button
          onClick={() => setShowAiPlan(!showAiPlan)}
          className="text-xs text-[#00BFFF] hover:underline font-medium mb-1"
        >
          {showAiPlan ? '▲ Hide AI Plan' : '▼ Show AI Plan'}
        </button>
        
        {showAiPlan && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
              🤖 AI Recommendation
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              {goal.ai_plan}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
        <div>
          Time Blocks<br />
          <span className="font-bold text-neutral-900 dark:text-white">{goal.timeBlocks}</span>
        </div>
        <div>
          Tasks<br />
          <span className="font-bold text-neutral-900 dark:text-white">{goal.tasks}</span>
        </div>
        <div>
          Habits<br />
          <span className="font-bold text-neutral-900 dark:text-white">{goal.habits}</span>
        </div>
      </div>
      
      <span className="inline-block bg-[#00BFFF] text-white text-xs px-3 py-1 rounded-full">
        {goal.category}
      </span>
    </div>
  );
};

export default GoalCard;