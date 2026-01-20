import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon, 
  SparklesIcon,
  XMarkIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const AIAssistant = ({ onApplyFilters, isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI job search assistant. I can help you find jobs, track applications, and answer questions about the app. Try asking me things like 'Show me remote React jobs' or 'Where do I see my applications?'",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.chatWithAI(inputText);
      
      const aiMessage = {
        id: messages.length + 2,
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        filters: response.filters,
        type: response.type
      };

      setMessages(prev => [...prev, aiMessage]);

      // If AI suggests filters, apply them
      if (response.filters && Object.keys(response.filters).length > 0) {
        onApplyFilters && onApplyFilters(response.filters);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble processing your request. Please try again or use the filters manually.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const quickQuestions = [
    "Show me remote React jobs",
    "Give me UX jobs requiring Figma",
    "Which jobs have highest match scores?",
    "Find senior roles posted this week",
    "Where do I see my applications?",
    "How do I upload my resume?",
    "How does matching work?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col border-l">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Ask me anything about jobs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 bg-white text-sm text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  
                  {message.filters && (
                    <div className="mt-3 pt-3 border-t border-opacity-20">
                      <p className="text-xs opacity-80 mb-2">I'll apply these filters:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(message.filters).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-white bg-opacity-20 text-xs rounded"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className={`${message.sender === 'user' ? 'order-1 ml-3' : 'order-2 mr-3'}`}>
                {message.sender === 'user' ? (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                ) : (
                  <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                    <CommandLineIcon className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none bg-gray-100 px-4 py-3">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about jobs, applications, or help..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {quickQuestions.slice(3).map((question, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;