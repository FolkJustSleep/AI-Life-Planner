import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, PieChart, Target, Calculator } from 'lucide-react';
import { Card } from '../Card';
import { FinancialData } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function FinanceSection() {
  const [financialData, setFinancialData] = useLocalStorage<FinancialData[]>('financialData', []);
  const [showForm, setShowForm] = useState(false);
  const [income, setIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentData = financialData.find(data => data.month === currentMonth);

  const sampleExpenses = [
    { category: 'Rent', amount: 15000, type: 'fixed' as const },
    { category: 'Food', amount: 8000, type: 'flexible' as const },
    { category: 'Transportation', amount: 3000, type: 'fixed' as const },
    { category: 'Entertainment', amount: 2000, type: 'flexible' as const },
    { category: 'Utilities', amount: 2500, type: 'fixed' as const },
  ];

  const totalExpenses = sampleExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyIncome = currentData?.income || 45000;
  const savings = monthlyIncome - totalExpenses;
  const savingsRate = ((savings / monthlyIncome) * 100).toFixed(1);

  const addFinancialData = () => {
    if (!income) return;

    const newData: FinancialData = {
      id: Date.now().toString(),
      month: currentMonth,
      income: parseFloat(income),
      expenses: sampleExpenses,
      savings: parseFloat(income) - totalExpenses,
      goals: savingsGoal ? [{
        name: 'Monthly Savings Target',
        target: parseFloat(savingsGoal),
        current: parseFloat(income) - totalExpenses,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months from now
      }] : []
    };

    setFinancialData(prev => {
      const existing = prev.findIndex(data => data.month === currentMonth);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newData;
        return updated;
      }
      return [...prev, newData];
    });

    setIncome('');
    setSavingsGoal('');
    setShowForm(false);
  };

  const aiFinancialTips = [
    {
      title: "Reduce Food Spending",
      description: "Try meal planning and cooking at home 4 days/week to save ฿2,000/month",
      potential: "฿2,000",
      category: "flexible"
    },
    {
      title: "Energy Optimization", 
      description: "Use energy-efficient appliances and practices to reduce utility costs",
      potential: "฿500",
      category: "fixed"
    },
    {
      title: "Entertainment Budget",
      description: "Find free/low-cost activities to reduce entertainment expenses by 30%",
      potential: "฿600",
      category: "flexible"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Planning</h2>
          <p className="text-gray-600 dark:text-gray-400">Track expenses and achieve your financial goals</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Update Budget</span>
        </button>
      </div>

      {showForm && (
        <Card className="border-2 border-dashed border-[#D2D0F5]">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Income (฿)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="45000"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#D2D0F5] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Savings Goal (฿)
                </label>
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  placeholder="10000"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#D2D0F5] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addFinancialData}
                className="flex-1 py-2 bg-gradient-to-r from-[#D2D0F5] to-[#FFBCFA] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Update Budget
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Financial Overview */}
{/* Financial Overview - Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5] w-fit mx-auto mb-4">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="text-[clamp(1rem,3vw,2rem)] font-bold text-center text-gray-900 dark:text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap w-full">
            ฿{monthlyIncome.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly Income</div>
        </Card>

        <Card className="text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#D2D0F5] w-fit mx-auto mb-4">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words overflow-hidden">
            ฿{savings.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Monthly Savings ({savingsRate}%)</div>
        </Card>

        <Card className="text-center sm:col-span-2 lg:col-span-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#FFBCFA] w-fit mx-auto mb-4">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-words overflow-hidden">
            ฿{totalExpenses.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#D2D0F5] to-[#FFBCFA]">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fixed vs Flexible costs</p>
            </div>
          </div>

          <div className="space-y-4">
            {sampleExpenses.map((expense, index) => {
              const percentage = ((expense.amount / totalExpenses) * 100).toFixed(1);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{expense.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        expense.type === 'fixed' 
                          ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-[#FFBCFA]/30 text-pink-700 dark:text-pink-400'
                      }`}>
                        {expense.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">฿{expense.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        expense.type === 'fixed'
                          ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5]'
                          : 'bg-gradient-to-r from-[#FFBCFA] to-[#D2D0F5]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Financial Tips */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#A8D1E7] to-[#FFBCFA]">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Savings Tips</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personalized cost-cutting recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            {aiFinancialTips.map((tip, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{tip.title}</h4>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Save {tip.potential}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tip.category === 'fixed'
                      ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-[#FFBCFA]/30 text-pink-700 dark:text-pink-400'
                  }`}>
                    {tip.category} cost
                  </span>
                  <button className="text-xs text-[#A8D1E7] hover:text-[#D2D0F5] font-medium">
                    Apply tip →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-[#A8D1E7]/20 to-[#D2D0F5]/20 rounded-xl">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 AI Insight</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By applying these tips, you could potentially save ฿3,100/month, bringing your savings rate to {((savings + 3100) / monthlyIncome * 100).toFixed(1)}%!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}