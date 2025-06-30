import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { MessageSquare, Send, Sparkles, Clock, CheckSquare, Calendar, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ChatService } from '../services/chat_services';
import { DeleteService } from '../services/delete_service';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'plan' | 'checklist' | 'timeline';
}

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm your AI productivity assistant. I can help you plan your goals, create schedules, suggest routines, and optimize your workflow. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Fetch all chat history from backend
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await ChatService.fetchAllChat();
        if (response.message === 'success' && Array.isArray(response.data)) {
          const chatMessages: Message[] = response.data.map((chat) => ({
            id: chat.id,
            content: chat.message,
            isUser: chat.sender === 'user',
            timestamp: new Date(chat.created_at),
            type: 'text',
          }));
          setMessages((prev) => [...prev, ...chatMessages]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  const quickPrompts = [
    'How to plan my thesis?',
    'Suggest a weekly routine to balance work + hobbies',
    'Help me break down a big project',
    'Create a morning routine for productivity',
    'How to manage time better?',
    'Suggest habits for better focus',
  ];

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const chatRequest = {
        message: userMessage.content,
        sender: 'user',
      };

      const response = await ChatService.sendChatMessage(chatRequest);

      if (response.message === 'success' && typeof response.data === 'string') {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "Sorry, I couldn't get a response from the AI.",
            isUser: false,
            timestamp: new Date(),
            type: 'text',
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'There was an error sending your message. Please try again.',
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  // Mock delete function - replace with actual API call later
  const handleDeleteChat = async () => {
    try {
      // TODO: Replace with actual API call
      const reponse = await DeleteService.deleteChat();
      if (reponse.message !== 'success') {
        throw new Error('Failed to delete chat');
      }
      // fetch message again
      setMessages(() => [
        {
          id: '1',
          content:
            "Hello! I'm your AI productivity assistant. I can help you plan your goals, create schedules, suggest routines, and optimize your workflow. What would you like to work on today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        },
      ]);
      // await ChatService.deleteAllChat();
      // Mock implementation - reset to initial state
      setShowDeleteConfirm(false);
      console.log('Chat deleted successfully (mock)');
    } catch (error) {
      console.error('Error deleting chat:', error);
      // You can add error handling here later
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.isUser;

    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${isUser
            ? 'bg-primary-400 text-white'
            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'
            } rounded-lg p-3 sm:p-4`}
        >
          {!isUser && (
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles size={16} className="text-primary-500 flex-shrink-0" />
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">AI Assistant</span>
            </div>
          )}

          <div className={`${isUser ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {message.type === 'text' ? (
              isUser ? (
                <div className="whitespace-pre-line text-sm break-words">{message.content}</div>
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none [&>*]:break-words"
                  dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                />
              )
            ) : (
              <>
                {message.type === 'plan' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar size={18} className="text-secondary-500 flex-shrink-0" />
                      <span className="font-semibold">Strategic Plan</span>
                    </div>
                    <div className="whitespace-pre-line text-sm break-words">{message.content}</div>
                  </div>
                )}

                {message.type === 'checklist' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckSquare size={18} className="text-accent-500 flex-shrink-0" />
                      <span className="font-semibold">Action Checklist</span>
                    </div>
                    <div className="whitespace-pre-line text-sm break-words">{message.content}</div>
                  </div>
                )}

                {message.type === 'timeline' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock size={18} className="text-primary-500 flex-shrink-0" />
                      <span className="font-semibold">Routine Timeline</span>
                    </div>
                    <div className="whitespace-pre-line text-sm break-words">{message.content}</div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-neutral-500 dark:text-neutral-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-primary-500 flex-shrink-0" size={24} />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
            AI Productivity Assistant
          </h1>
        </div>

        {/* Delete Chat Button */}
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="outline"
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete Chat</span>
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Delete Chat History
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Are you sure you want to delete all chat messages? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteChat}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {/* Chat area - takes full width on mobile, 3/4 on desktop */}
        <div className="flex-1 lg:w-3/4 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 h-full">
            {/* Scrollable chat messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 min-h-[300px] max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-200px)]">
              {messages.map(renderMessage)}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-primary-500 animate-spin flex-shrink-0" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area - fixed at bottom */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me about productivity, planning, or goals..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading}
                  className="flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Send size={16} className="sm:mr-2" />
                  <span className="sm:hidden">Send</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - stacked on mobile, side panel on desktop */}
        <div className="w-full lg:w-1/4 space-y-4 lg:space-y-6 flex-shrink-0">
          {/* Quick Prompts */}
          <Card className="order-2 lg:order-1">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
              Quick Prompts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left p-2 sm:p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 break-words"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          {/* AI Capabilities */}
          <Card className="order-1 lg:order-2">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
              AI Capabilities
            </h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>Create detailed project plans and timelines</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-secondary-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>Design daily and weekly routines</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-accent-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>Break down complex goals into actionable steps</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>Suggest productivity habits and techniques</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>Optimize time management strategies</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;