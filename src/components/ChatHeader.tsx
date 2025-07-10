
import React from 'react';
import { MessageSquare, RotateCcw } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
  messageCount: number;
}

const ChatHeader = ({ onNewChat, messageCount }: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <MessageSquare className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Lovable AI Chat</h1>
            <p className="text-sm text-gray-500">
              {messageCount > 0 ? `${messageCount} messages` : 'Ready to chat'}
            </p>
          </div>
        </div>
        
        {messageCount > 0 && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
