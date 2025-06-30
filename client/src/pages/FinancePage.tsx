import React, { useState } from 'react';
import { DollarSign, TrendingUp, PieChart, Download, Calculator } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { mockFinancialData } from '../utils/mockData';

const FinancePage: React.FC = () => {
  const [income, setIncome] = useState(mockFinancialData.income.toString());
  const [fixedExpenses, setFixedExpenses] = useState(mockFinancialData.fixedExpenses.toString());
  const [variableExpenses, setVariableExpenses] = useState(mockFinancialData.variableExpenses.toString());
  const [savingsGoal, setSavingsGoal] = useState('10000');
  const [timeframe, setTimeframe] = useState('3');

  const data = mockFinancialData;
  const totalExpenses = data.fixedExpenses + data.variableExpenses;
  const availableForSavings = data.income - totalExpenses;
  const savingsRate = ((availableForSavings / data.income) * 100).toFixed(1);

  const monthlyData = [
    { month: 'Jan', income: 50000, expenses: 40000, savings: 10000 },
    { month: 'Feb', income: 52000, expenses: 38000, savings: 14000 },
    { month: 'Mar', income: 48000, expenses: 42000, savings: 6000 },
    { month: 'Apr', income: 55000, expenses: 35000, savings: 20000 },
    { month: 'May', income: 51000, expenses: 39000, savings: 12000 },
    { month: 'Jun', income: 53000, expenses: 37000, savings: 16000 }
  ];

  const handleAIAnalysis = () => {
    // Simulate AI analysis
    const suggestions = [
      "Reduce dining out by 30% to save ฿2,400/month",
      "Switch to a cheaper phone plan to save ฿600/month",
      "Use public transport 3 days/week to save ฿1,200/month",
      "Cook at home more often to save ฿3,000/month",
      "Cancel unused subscriptions to save ฿800/month"
    ];
    
    alert(`AI Savings Suggestions:\n\n${suggestions.join('\n')}\n\nTotal potential savings: ฿8,000/month`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="text-primary-500" size={32} />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Financial Planning
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <Button > {/*onClick={handleAIAnalysis}>*/}
            <Calculator size={20} className="mr-2" />
            Get AI Analysis (Not avalible yet)
          </Button>
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export PDF (Not avalible yet)
          </Button>
        </div>
      </div>

      {/* Budget Input Section */}
      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Budget Input
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Input
            label="Monthly Income (฿)"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="50000"
          />
          <Input
            label="Fixed Expenses (฿)"
            type="number"
            value={fixedExpenses}
            onChange={(e) => setFixedExpenses(e.target.value)}
            placeholder="25000"
          />
          <Input
            label="Variable Expenses (฿)"
            type="number"
            value={variableExpenses}
            onChange={(e) => setVariableExpenses(e.target.value)}
            placeholder="15000"
          />
        </div>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card blurred className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            ฿{availableForSavings.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Available for Savings</div>
        </Card>
        <Card blurred className="text-center">
          <div className="text-2xl font-bold text-primary-500 mb-2">
            {savingsRate}%
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Savings Rate</div>
        </Card>
        <Card blurred className="text-center">
          <div className="text-2xl font-bold text-secondary-500 mb-2">
            ฿{totalExpenses.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Total Expenses</div>
        </Card>
        <Card blurred className="text-center">
          <div className="text-2xl font-bold text-accent-500 mb-2">
            ฿{data.income.toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-300">Monthly Income</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Spending Breakdown */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Monthly Spending Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data.categories}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Trends */}
        <Card blurred>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            6-Month Financial Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `฿${value.toLocaleString()}`} />
              <Bar dataKey="income" fill="#A8D1E7" name="Income" />
              <Bar dataKey="expenses" fill="#FFBCFA" name="Expenses" />
              <Bar dataKey="savings" fill="#B8E6B8" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Savings Goal Calculator */}
      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Savings Goal Calculator
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Input
              label="Savings Goal (฿)"
              type="number"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              placeholder="10000"
            />
            <Input
              label="Timeframe (months)"
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="3"
            />
            <Button className="w-full">
              Calculate Savings Plan
            </Button>
          </div>
          
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              To save ฿{parseInt(savingsGoal).toLocaleString()} in {timeframe} months:
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">Required monthly savings:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  ฿{Math.ceil(parseInt(savingsGoal) / parseInt(timeframe)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">Current capacity:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ฿{availableForSavings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-300">Gap:</span>
                <span className={`font-bold ${
                  availableForSavings >= Math.ceil(parseInt(savingsGoal) / parseInt(timeframe))
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ฿{Math.abs(availableForSavings - Math.ceil(parseInt(savingsGoal) / parseInt(timeframe))).toLocaleString()}
                  {availableForSavings >= Math.ceil(parseInt(savingsGoal) / parseInt(timeframe)) ? ' surplus' : ' deficit'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Suggestions */}
      <Card blurred>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          AI Financial Suggestions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              💡 How to save ฿10,000 in 3 months:
            </h3>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>Reduce dining out by 50% → Save ฿2,000/month</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                <span>Use public transport → Save ฿1,500/month</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                <span>Cancel unused subscriptions → Save ฿800/month</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Cook at home more → Save ฿2,500/month</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              📈 Investment Recommendations:
            </h3>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Emergency fund: 6 months expenses (฿240,000)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Low-risk bonds: 30% of savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Index funds: 50% of savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>High-growth stocks: 20% of savings</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancePage;