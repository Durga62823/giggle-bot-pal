
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import Auth from '@/components/Auth';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import ChatInput from '@/components/ChatInput';
import WelcomeMessage from '@/components/WelcomeMessage';

const Index = () => {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    deleteSession,
  } = useChatSessions(user?.id);
  
  const { messages, isTyping, sendMessage } = useChatMessages(
    currentSessionId || undefined,
    user?.id
  );

  const [showAuth, setShowAuth] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleNewChat = async () => {
    await createSession();
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAuth(false);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Show auth if not logged in or explicitly requested
  if (!user || showAuth) {
    return <Auth onSuccess={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
        onDeleteSession={deleteSession}
        onSignOut={handleSignOut}
        userEmail={user.email}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader 
          onNewChat={handleNewChat} 
          messageCount={messages.length}
        />
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {!currentSessionId || messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-1">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.content}
                    isUser={msg.is_user}
                    timestamp={new Date(msg.created_at)}
                  />
                ))}
                
                {isTyping && <TypingIndicator />}
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <ChatInput
          onSendMessage={async (message) => {
            if (!currentSessionId) {
              const newSession = await createSession();
              if (newSession) {
                await sendMessage(message);
              }
            } else {
              await sendMessage(message);
            }
          }}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};

export default Index;
