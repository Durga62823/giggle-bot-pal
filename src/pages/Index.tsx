
import React from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import ChatInput from '../components/ChatInput';
import WelcomeMessage from '../components/WelcomeMessage';
import { useChat } from '../hooks/useChat';

const Index = () => {
  const { messages, isTyping, sendMessage, clearChat, chatEndRef } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <ChatHeader onNewChat={clearChat} messageCount={messages.length} />
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-1">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
    </div>
  );
};

export default Index;
