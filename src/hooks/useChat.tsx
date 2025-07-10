
import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock API function - replace with your actual Gemini API call
const mockGeminiAPI = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock responses based on user input
  const responses = [
    "That's a great question! 🤔 I'd love to help you explore that topic further.",
    "Interesting! Let me think about that... ✨ Here's what I can tell you:",
    "I appreciate you asking! 😊 From my perspective, I'd say:",
    "That's something I enjoy discussing! 💭 Let me share some thoughts:",
    "Great point! 🌟 Here's how I see it:",
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add some contextual responses
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello there! 👋 It's wonderful to meet you! How are you doing today?";
  }
  
  if (message.toLowerCase().includes('help')) {
    return "I'm here to help! 💪 Whether you need advice, want to brainstorm, or just chat, I'm all ears. What can I assist you with?";
  }
  
  if (message.toLowerCase().includes('weather')) {
    return "I don't have access to real-time weather data right now, but I'd recommend checking your local weather app! 🌤️ Is there anything else I can help with?";
  }
  
  return `${randomResponse} ${message.length > 50 ? "That's quite a detailed message!" : "Thanks for sharing that with me!"} Is there anything specific you'd like to know more about? 🚀`;
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Replace this with your actual Gemini API call
      const aiResponse = await mockGeminiAPI(messageText);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 😔",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    chatEndRef,
  };
};
