
import React from 'react';
import { Plus, MessageSquare, Trash2, LogOut } from 'lucide-react';
import { ChatSession } from '@/hooks/useChatSessions';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const ChatSidebar = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  onSignOut,
  userEmail,
}: ChatSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
        >
          <Plus size={20} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                currentSessionId === session.id
                  ? 'bg-purple-50 border border-purple-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition-all duration-200"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">
              {userEmail}
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
