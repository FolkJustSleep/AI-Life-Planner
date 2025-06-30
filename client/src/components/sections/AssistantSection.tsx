import React, { useState } from 'react';
import { MessageSquare, Send, Lightbulb, Clock, Target, BookOpen } from 'lucide-react';
import { Card } from '../Card';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AssistantSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI productivity assistant. Ask me anything about planning, time management, or achieving your goals. Try questions like 'How do I balance work and study?' or 'Help me plan my thesis.'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const promptSuggestions = [
    { icon: Target, text: "How to plan my thesis?", category: "Academic" },
    { icon: Clock, text: "How to balance study and side projects?", category: "Time Management" },
    { icon: BookOpen, text: "Create a learning schedule for programming", category: "Learning" },
    { icon: Lightbulb, text: "Help me be more consistent with habits", category: "Productivity" },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: generateAIResponse(input.trim()),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInput('');
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = {
      thesis: `Here's a thesis planning approach:

📋 **Break it into phases:**
1. Research & literature review (4-6 weeks)
2. Outline creation (1 week)
3. First draft writing (6-8 weeks) 
4. Revision cycles (3-4 weeks)
5. Final editing (1-2 weeks)

⏰ **Daily structure:**
- Morning: 2-3 hours deep writing
- Afternoon: Research and note-taking
- Evening: Light editing/organization

🎯 **Weekly goals:**
- Set specific word count targets
- Schedule advisor meetings
- Track progress visually`,

      balance: `Here's how to balance study and side projects:

🕒 **Time blocking strategy:**
- Mornings: Core study time (highest energy)
- Afternoons: Side project work
- Evenings: Review and planning

📊 **80/20 rule:**
- 80% time on studies (priority)
- 20% time on side projects (growth)

🔄 **Weekly rhythm:**
- Mon-Thu: Focus heavily on studies
- Fri-Sat: More time for projects
- Sun: Planning and preparation

✅ **Integration tips:**
- Use project breaks as study rewards
- Apply study concepts in projects
- Set clear boundaries and deadlines`,

      programming: `Learning programming schedule:

📅 **Daily structure (2-3 hours):**
- 30 min: Theory/concepts
- 60-90 min: Hands-on coding
- 30 min: Practice problems

📚 **Weekly progression:**
- Mon: New concept introduction
- Tue-Wed: Deep practice
- Thu: Problem-solving
- Fri: Build small project
- Weekend: Review and consolidate

🎯 **Learning path:**
1. Fundamentals (variables, loops, functions)
2. Data structures and algorithms
3. Build projects (start small!)
4. Learn frameworks/tools
5. Contribute to open source

💡 **Tips:**
- Code every day, even 15 minutes
- Explain concepts to others
- Join coding communities`,

      habits: `Building consistency with habits:

🌱 **Start tiny:**
- Begin with 2-minute versions
- Focus on showing up, not performance
- Example: "Read 1 page" not "Read 30 minutes"

📍 **Habit stacking:**
- Attach new habits to existing routines
- "After I brush my teeth, I'll meditate for 2 minutes"

🎯 **Environment design:**
- Make it obvious (visual cues)
- Make it attractive (pair with enjoyable activity)
- Make it easy (remove barriers)
- Make it satisfying (track and celebrate)

📊 **Tracking system:**
- Use a simple calendar/app
- Focus on consistency over perfection
- Aim for 80% success rate

🔄 **Recovery strategy:**
- Never miss twice in a row
- Get back on track immediately
- Be kind to yourself about setbacks`
    };

    if (userInput.toLowerCase().includes('thesis')) return responses.thesis;
    if (userInput.toLowerCase().includes('balance') || userInput.toLowerCase().includes('study')) return responses.balance;
    if (userInput.toLowerCase().includes('programming') || userInput.toLowerCase().includes('coding')) return responses.programming;
    if (userInput.toLowerCase().includes('habit') || userInput.toLowerCase().includes('consistent')) return responses.habits;

    return `I'd be happy to help you with that! Here are some general productivity tips:

🎯 **Planning approach:**
- Break large goals into smaller, actionable steps
- Use time-blocking to schedule focused work
- Set specific, measurable outcomes

⏰ **Time management:**
- Apply the Pomodoro technique (25 min work, 5 min break)
- Batch similar tasks together
- Prioritize based on impact and urgency

🔄 **Building systems:**
- Create consistent daily routines
- Track your progress visually
- Adjust strategies based on what works

Could you be more specific about what you'd like help with? I can provide more targeted advice!`;
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
        <p className="text-gray-600 dark:text-gray-400">Get personalized productivity advice and planning help</p>
      </div>

      {/* Quick Prompts */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Prompts</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {promptSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => useSuggestion(suggestion.text)}
                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#A8D1E7] dark:hover:border-[#D2D0F5] hover:bg-gradient-to-r hover:from-[#A8D1E7]/10 hover:to-[#D2D0F5]/10 transition-all duration-200 text-left"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#A8D1E7] to-[#D2D0F5]">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{suggestion.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#FFBCFA] to-[#A8D1E7]">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ask anything about productivity and planning</p>
          </div>
        </div>

        {/* Make only the chat area scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px] pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white ml-4'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mr-4'
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about planning, productivity, or achieving your goals..."
            className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-4 bg-gradient-to-r from-[#A8D1E7] to-[#D2D0F5] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}