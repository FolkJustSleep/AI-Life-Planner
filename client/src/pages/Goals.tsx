import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, Target, Heart, Loader2, CheckCircle } from 'lucide-react';
import { UserService } from '../services/user_service';
import { generateAIPlan } from '../services/aigen_service';
import { ClientProfileData } from '../models/user_model.ts';

type GoalsProps = {
  onNavigate?: (tab: string) => void;
};

type FlowState = 'form' | 'saving' | 'saved' | 'generating' | 'generated';

const Goals: React.FC<GoalsProps> = ({ onNavigate }) => {
  // Flow state management
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [showDialog, setShowDialog] = useState(false);

  // Financial Information
  const [currency, setCurrency] = useState('THB');
  const [monthlyIncome, setMonthlyIncome] = useState('0');
  const [monthlyExpenses, setMonthlyExpenses] = useState('0');
  const [monthlySavingGoal, setMonthlySavingGoal] = useState('0');
  const [riskTolerance, setRiskTolerance] = useState('None');

  // Schedule & Availability
  const [workHours, setWorkHours] = useState('None');
  const [availableTime, setAvailableTime] = useState('None');
  const [busiestDays, setBusiestDays] = useState('None');
  const [preferredTimes, setPreferredTimes] = useState('None');

  // Life Goals
  const [shortTermGoals, setShortTermGoals] = useState('None');
  const [longTermGoals, setLongTermGoals] = useState('None');
  const [lifePriorities, setLifePriorities] = useState('None');
  const [preferredTimeframe, setPreferredTimeframe] = useState('None');

  // Health Background
  const [medicalConditions, setMedicalConditions] = useState('None');
  const [currentMedications, setCurrentMedications] = useState('None');
  const [allergies, setAllergies] = useState('None');
  const [fitnessLevel, setFitnessLevel] = useState('None');
  const [sleepPattern, setSleepPattern] = useState('None');

  const isFormComplete = () => {
    return (
      medicalConditions &&
      currentMedications &&
      allergies &&
      fitnessLevel &&
      sleepPattern &&
      workHours &&
      availableTime &&
      busiestDays &&
      preferredTimes &&
      currency &&
      monthlyIncome &&
      monthlyExpenses &&
      monthlySavingGoal &&
      riskTolerance &&
      shortTermGoals &&
      longTermGoals &&
      lifePriorities &&
      preferredTimeframe
    );
  };

  const handleSaveProfile = async () => {
    if (!isFormComplete()) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const profileData: ClientProfileData = {
      personal: {
        full_name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
      },
      health: { medicalConditions, currentMedications, allergies, fitnessLevel, sleepPattern },
      schedule: { workHours, availableTime, busiestDays, preferredTimes },
      financial: { currency, monthlyIncome, monthlyExpenses, monthlySavingGoal, riskTolerance },
      lifeGoals: { shortTermGoals, longTermGoals, lifePriorities, preferredTimeframe },
    };

    setFlowState('saving');
    setShowDialog(true);

    try {
      const response = await UserService.saveUserProfile(profileData);
      console.log(`Profile saved successfully: ${response.message || ''}`);
      
      // Simulate some delay for better UX
      setTimeout(() => {
        setFlowState('saved');
        setTimeout(() => {
          setShowDialog(false);
        }, 1500); // Keep success message visible for 1.5 seconds
      }, 1000);
    } catch (error) {
      const err = error as Error;
      setFlowState('form');
      setShowDialog(false);
      alert(`Error saving profile: ${err.message}`);
    }
  };

  const handleGeneratePlan = async () => {
    const profileData: ClientProfileData = {
      personal: {
        full_name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
      },
      health: { medicalConditions, currentMedications, allergies, fitnessLevel, sleepPattern },
      schedule: { workHours, availableTime, busiestDays, preferredTimes },
      financial: { currency, monthlyIncome, monthlyExpenses, monthlySavingGoal, riskTolerance },
      lifeGoals: { shortTermGoals, longTermGoals, lifePriorities, preferredTimeframe },
    };

    setFlowState('generating');
    setShowDialog(true);

    try {
      const aiPlan = await generateAIPlan(profileData);
      console.log('Generated AI Plan:', aiPlan);
      
      setTimeout(() => {
        setFlowState('generated');
      }, 1000);
    } catch (error) {
      const err = error as Error;
      setFlowState('saved');
      setShowDialog(false);
      alert(`Error generating AI plan: ${err.message}`);
    }
  };

  const handleContinue = () => {
    setShowDialog(false);
    if (onNavigate) {
      onNavigate('goals-overview');
    }
  };

  // Render dialog based on current state
  const renderDialog = () => {
    if (!showDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          {flowState === 'saving' && (
            <>
              <Loader2 className="animate-spin text-[#A8D1E7] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Saving Your Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we save your information...
              </p>
            </>
          )}
          
          {flowState === 'saved' && (
            <>
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Profile Saved Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can now generate your personalized plan.
              </p>
            </>
          )}
          
          {flowState === 'generating' && (
            <>
              <Loader2 className="animate-spin text-[#4CAF50] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Generating Your Plan
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our AI is creating a personalized plan just for you...
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ Please don't close this window. Plan generation is in progress.
                </p>
              </div>
            </>
          )}
          
          {flowState === 'generated' && (
            <>
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Plan Generated Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your personalized plan is ready to view.
              </p>
              <button
                onClick={handleContinue}
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out"
              >
                Continue to View Plan
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dialog Overlay */}
      {renderDialog()}
      
      {/* Overlay to prevent interaction during critical states */}
      {(flowState === 'saving' || flowState === 'generating') && (
        <div className="fixed inset-0 bg-transparent z-40" />
      )}

      {/* Main header */}
      <div className="flex items-center space-x-2">
        <Target className="text-primary-500" size={32} />
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Profile & Planning
        </h1>
      </div>

      {/* Health Background */}
      <section className="space-y-4 pt-10 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Heart className="text-[#A8D1E7]" size={28} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Health Background</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medical Conditions</label>
            <input
              type="text"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="Any medical conditions"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Medications</label>
            <input
              type="text"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Current medications"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Any allergies"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fitness Level</label>
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="None">Not selected</option>
              <option value="Sedentary">Sedentary (little to no exercise)</option>
              <option value="Lightly">Lightly Active (light exercies 1-3days/week)</option>
              <option value="Moderately">Moderately Active (moderate exercies 3-5days/week)</option>
              <option value="Very">Very Active (hard exercies 6-7days/week)</option>
              <option value="Extremely">Extremely Active (very hard exercies, physical job)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sleep Pattern</label>
            <select
              value={sleepPattern}
              onChange={(e) => setSleepPattern(e.target.value)}
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="None">Not selected</option>
              <option value="9pm - 6am">Early Bird (sleep before 10 PM, wake before 6 AM)</option>
              <option value="10pm - 7am">Normal (sleep around 10-11 PM, wake around 7 AM)</option>
              <option value="12am - 8am">Night owl (sleep after 12 PM, wake after 8 AM)</option>
              <option value="Irregular">Irregular (varying sleep schedule)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Schedule & Availability */}
      <section className="space-y-4 pt-10 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Clock className="text-[#A8D1E7]" size={28} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Schedule &amp; Availability</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Hours</label>
            <input
              type="text"
              value={workHours}
              onChange={(e) => setWorkHours(e.target.value)}
              placeholder="e.g. 9am - 5pm"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Time for Activities</label>
            <input
              type="text"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="e.g. Evenings, Weekends"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Busiest Days</label>
            <input
              type="text"
              value={busiestDays}
              onChange={(e) => setBusiestDays(e.target.value)}
              placeholder="e.g. Monday, Friday"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Times for Activities</label>
            <input
              type="text"
              value={preferredTimes}
              onChange={(e) => setPreferredTimes(e.target.value)}
              placeholder="e.g. Mornings"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Financial Information */}
      <section className="space-y-4 pt-10 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <DollarSign className="text-[#A8D1E7]" size={28} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="THB">THB</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Income after tax ({currency})
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 50000"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Expenses ({currency})
            </label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder="e.g. 20000"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Saving Goal ({currency})
            </label>
            <input
              type="number"
              value={monthlySavingGoal}
              onChange={(e) => setMonthlySavingGoal(e.target.value)}
              placeholder="e.g. 10000"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Risk Tolerance for Investments</label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="None">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>

      {/* Life Goals */}
      <section className="space-y-4 pt-10 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Target className="text-[#A8D1E7]" size={28} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Life Goals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short-term Goals (Next 1-2 years)</label>
            <input
              type="text"
              value={shortTermGoals}
              onChange={(e) => setShortTermGoals(e.target.value)}
              placeholder="Your short-term goals"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Long-term Goals (5+ years)</label>
            <input
              type="text"
              value={longTermGoals}
              onChange={(e) => setLongTermGoals(e.target.value)}
              placeholder="Your long-term goals"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Life Priorities</label>
            <input
              type="text"
              value={lifePriorities}
              onChange={(e) => setLifePriorities(e.target.value)}
              placeholder="Your life priorities"
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Timeframe for Major Changes</label>
            <select
              value={preferredTimeframe}
              onChange={(e) => setPreferredTimeframe(e.target.value)}
              disabled={flowState !== 'form'}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="None">None</option>
              <option value="Aggressive">Aggressive (0-6 months)</option>
              <option value="Moderate">Moderate (6-12 months)</option>
              <option value="Gradual">Gradual (1-2 years)</option>
              <option value="long-term">Long-term (2+ years)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <button
          onClick={handleSaveProfile}
          disabled={!isFormComplete() || flowState !== 'form'}
          className="bg-[#A8D1E7] hover:bg-[#96C4DD] text-gray-900 font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Goal
        </button>
        <button
          onClick={handleGeneratePlan}
          disabled={flowState !== 'saved'}
          className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Plan
        </button>
      </div>
    </div>
  );
};

export default Goals;