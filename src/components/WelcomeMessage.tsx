
import React from 'react';
import { Bot, Heart, Sparkles, MessageSquare } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-scale-in">
        <Bot size={32} className="text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
        Welcome to Lovable AI 
        <Heart className="text-red-500" size={28} />
      </h1>
      
      <p className="text-gray-600 text-lg mb-6 max-w-md leading-relaxed">
        Hi there! I'm your friendly AI assistant, powered by OpenAI. 
        I'm here to help, chat, and make your day a little brighter! ✨
      </p>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-sm">
        <div className="flex items-center gap-2 text-purple-600 mb-3">
          <MessageSquare size={16} />
          <span className="font-medium">Start a conversation:</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            "Tell me a fun fact"
          </li>
          <li className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            "Help me brainstorm ideas"
          </li>
          <li className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            "Write me a poem"
          </li>
          <li className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            "What's trending in tech?"
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeMessage;
