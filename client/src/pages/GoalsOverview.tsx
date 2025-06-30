// Install marked.js if you haven't already: npm install marked
import React, { useState, useEffect } from 'react';
import LifeGoalService from '../services/lifegoal_service';
import { LifeGoalsData, GoalCardData } from '../models/lifegoal_model';
import { marked } from 'marked'; // Import the marked library
import { DeleteService } from '../services/delete_service';

// Notification Component
const Notification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg flex items-center gap-3 ${bgColor[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold">×</button>
    </div>
  );
};

// Data Cleanup Dialog Component
const DataCleanupDialog: React.FC<{
  onConfirm: () => void;
}> = ({ onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md">
      <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Incomplete Data Detected
      </div>
      <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm">
        We found some incomplete goal data that may be causing issues. This might happen because you have not created any goals yet or the AI plan generation failed. Please clean up data and add your goals again.
      </div>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={onConfirm}
        >
          Clean Up Data
        </button>
      </div>
    </div>
  </div>
);

// Goal Already Exists Dialog Component
const GoalExistsDialog: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md">
      <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Goal Already Exists
      </div>
      <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm">
        You can only have one goal at a time for now. Please delete your current goal to add another goal.
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Understood
        </button>
      </div>
    </div>
  </div>
);

// Goal Card Skeleton Component
const GoalCardSkeleton: React.FC = () => (
  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 w-full animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
    <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
);

// Retry Button Component
const RetryButton: React.FC<{ onRetry: () => void; label?: string }> = ({ onRetry, label = "Try Again" }) => (
  <button
    onClick={onRetry}
    className="text-[#00BFFF] hover:underline font-medium"
  >
    {label}
  </button>
);

// Goal Card Component
const GoalCard: React.FC<{
  goal: GoalCardData;
  onDelete: (goal: GoalCardData) => void;
  isDeleting: boolean;
}> = ({ goal, onDelete, isDeleting }) => {
  const [showAiPlan, setShowAiPlan] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStageColor = (category: string) => {
    switch (category) {
      case 'Aggressive': return '#F8BDE1';
      case 'Moderate': return '#CEC1EF';
      case 'Gradual': return '#A0D4FF';
      case 'long-term':
      case 'Long-term': return '#BDEEA5';
      case 'None':
      default: return '#808080';
    }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    onDelete(goal);
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 w-full relative">
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

      <div className="mb-3">
        <button
          onClick={() => setShowAiPlan(!showAiPlan)}
          className="text-xs text-[#00BFFF] hover:underline font-medium mb-1"
        >
          {showAiPlan ? '▲ Hide AI Plan' : '▼ Show AI Plan'}
        </button>

        {showAiPlan && goal.ai_plan && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: goal.ai_plan }}
            />
          </div>
        )}
      </div>

      <span
        className="inline-block text-white text-xs px-3 py-1 rounded-full"
        style={{ backgroundColor: getStageColor(goal.category) }}
      >
        {goal.category}
      </span>

      {/* Delete button with loading state */}
      <button
        className={`absolute bottom-4 right-4 text-white text-xs px-4 py-2 rounded-lg shadow transition ${isDeleting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600'
          }`}
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {/* Confirmation popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Delete this goal?
            </div>
            <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm">
              Are you sure you want to delete this goal? This action cannot be undone.
            </div>
            <div className="flex gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{ onAddGoal: () => void }> = ({ onAddGoal }) => (
  <div className="flex flex-col items-center justify-center w-full py-16">
    <span className="text-6xl mb-4 block">🎯</span>
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No goals yet</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
      Start by adding your first goal to get AI-powered planning and achieve your dreams
    </p>
    <button
      onClick={onAddGoal}
      className="bg-[#00BFFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
    >
      Create Your First Goal
    </button>
  </div>
);

interface GoalsOverviewProps {
  onAddGoal: () => void;
}

const GoalsOverview: React.FC<GoalsOverviewProps> = ({ onAddGoal }) => {
  const [lifeGoals, setLifeGoals] = useState<LifeGoalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    goals: null as string | null,
    aiPlan: null as string | null,
    deletion: null as string | null
  });
  const [aiPlanHtml, setAiPlanHtml] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [goal_id, setGoalId] = useState<string>('');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);
  const [showDataCleanupDialog, setShowDataCleanupDialog] = useState(false);
  const [pendingCleanupData, setPendingCleanupData] = useState<any>(null);
  const [showGoalExistsDialog, setShowGoalExistsDialog] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Check if goals exist (helper function)
  const hasExistingGoals = (): boolean => {
    return lifeGoals !== null && 
           (lifeGoals.long_term.length > 0 || lifeGoals.short_term.length > 0);
  };

  // Modified handleAddGoal function
  const handleAddGoal = () => {
    if (hasExistingGoals()) {
      setShowGoalExistsDialog(true);
      return;
    }
    onAddGoal();
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, goals: null }));
      const data = await LifeGoalService.getLifeGoalsByUserId();
      setLifeGoals(data);
      showNotification('Goals loaded successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load goals';
      setErrors(prev => ({ ...prev, goals: errorMessage }));
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiPlan = async () => {
    try {
      setErrors(prev => ({ ...prev, aiPlan: null }));
      const response = await LifeGoalService.getAiPlan();

      // Only show cleanup dialog if we have incomplete AI plan data that might be corrupted
      // Not when AI plan is simply empty/unavailable for existing goals
      if (response.id === null || response.generated_plan === null) {
        // Check if we have goals - if we do, this is normal (no AI plan generated yet)
        // If we don't have goals either, then it might be incomplete data
        if (!lifeGoals || (lifeGoals.long_term.length === 0 && lifeGoals.short_term.length === 0)) {
          // Goals exist but no AI plan - this is normal, just set empty state
          setAiPlanHtml(null);
          setGoalId('');
          return;

        } else {
          setPendingCleanupData(response);
          setShowDataCleanupDialog(true);
          return;
        }
      }

      setGoalId(response.id);
      const plan = response.generated_plan;
      const parsedPlanHtml = await marked.parse(plan ?? '');
      setAiPlanHtml(parsedPlanHtml);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI plan';
      setErrors(prev => ({ ...prev, aiPlan: errorMessage }));
      console.error('Error fetching AI plan:', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Fetch AI plan after goals are loaded to make the incomplete data check accurate
  useEffect(() => {
    if (lifeGoals?.id !== '') {
      fetchAiPlan();
    }
  }, [lifeGoals]);

  const handleDataCleanup = async () => {
    try {
      setShowDataCleanupDialog(false);
      await handleDeleteUserData();
      await fetchGoals();
      setAiPlanHtml(null);
      setGoalId('');
      showNotification('Data cleaned up successfully', 'success');
    } catch (error) {
      showNotification('Failed to clean up data', 'error');
    }
  };

  const handleDeleteUserData = async () => {
    try {
      const response = await DeleteService.deleteUserData();
      if (response.message === 'success') {
        console.log('User data deleted successfully');
      } else {
        throw new Error('Failed to delete user data');
      }
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  };

  const handleDeleteGoal = async (goalToDelete: GoalCardData) => {
    setDeleting(true);
    setErrors(prev => ({ ...prev, deletion: null }));

    try {
      console.log("Deleting goal with id:", goal_id);
      await DeleteService.deleteGoal(goal_id);

      // Refetch goals after delete
      const data = await LifeGoalService.getLifeGoalsByUserId();
      setLifeGoals(data);
      showNotification('Goal deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete goal';
      setErrors(prev => ({ ...prev, deletion: errorMessage }));
      showNotification('Failed to delete goal', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const transformToGoalCards = (): GoalCardData[] => {
    if (!lifeGoals) return [];
    const goals: GoalCardData[] = [];
    const date = new Date(lifeGoals.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const maxLength = Math.max(lifeGoals.long_term.length, lifeGoals.short_term.length);

    for (let i = 0; i < maxLength; i++) {
      const longTerm = lifeGoals.long_term[i] || 'Long-term Goal';
      const shortTerm = lifeGoals.short_term[i] || 'Short-term Goal';
      goals.push({
        id: `goal-${i}`,
        title: longTerm,
        description: shortTerm,
        date: date,
        timeBlocks: Math.floor(Math.random() * 5) + 1,
        tasks: Math.floor(Math.random() * 10) + 1,
        habits: Math.floor(Math.random() * 5) + 1,
        category: lifeGoals.timeframe,
        ai_plan: aiPlanHtml ?? '',
        type: i < lifeGoals.short_term.length ? 'short_term' : 'long_term'
      });
    }
    return goals;
  };

  const goals = transformToGoalCards();

  return (
    <>
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      {/* Data Cleanup Dialog */}
      {showDataCleanupDialog && (
        <DataCleanupDialog
          onConfirm={handleDataCleanup}
        />
      )}

      {/* Goal Already Exists Dialog */}
      {showGoalExistsDialog && (
        <GoalExistsDialog
          onClose={() => setShowGoalExistsDialog(false)}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Goals & AI Planning
          </h1>
          <button
            className={`font-semibold px-6 py-2 rounded-lg border-2 transition ${
              hasExistingGoals()
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                : 'bg-[#00BFFF] text-white border-[#00BFFF] hover:bg-white hover:text-[#00BFFF]'
            }`}
            onClick={handleAddGoal}
          >
            Add Goal
          </button>
        </div>

        {/* Goals Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Goals
          </h2>

          {/* Error States */}
          {errors.goals && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                Error Loading Goals
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-2">{errors.goals}</p>
              <RetryButton onRetry={fetchGoals} />
            </div>
          )}

          {errors.aiPlan && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                AI Plan Unavailable
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 mb-2">{errors.aiPlan}</p>
              <RetryButton onRetry={fetchAiPlan} label="Retry AI Plan" />
            </div>
          )}

          {errors.deletion && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
                Deletion Failed
              </h3>
              <p className="text-red-600 dark:text-red-400">{errors.deletion}</p>
            </div>
          )}

          {/* Goals Content */}
          <div className="space-y-6 min-h-[200px] flex flex-col items-center justify-center">
            {loading ? (
              // Skeleton Loading
              <>
                <GoalCardSkeleton />
                <GoalCardSkeleton />
                <GoalCardSkeleton />
              </>
            ) : goals.length === 0 ? (
              // Empty State
              <EmptyState onAddGoal={onAddGoal} />
            ) : (
              // Goal Cards
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={handleDeleteGoal}
                  isDeleting={deleting}
                />
              ))
            )}
          </div>
        </div>

        {/* Delete Loading Overlay */}
        {deleting && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFFF] mb-4"></div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Deleting goal...
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GoalsOverview;