
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  is_user: boolean;
  created_at: string;
  chat_session_id: string;
}

export const useChatMessages = (sessionId?: string, userId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!sessionId || !userId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, userId, toast]);

  const sendMessage = async (content: string) => {
    if (!sessionId || !userId || !content.trim()) return;

    try {
      // Add user message
      const userMessage = {
        chat_session_id: sessionId,
        user_id: userId,
        content: content.trim(),
        is_user: true,
      };

      const { data: userMessageData, error: userError } = await supabase
        .from('chat_messages')
        .insert([userMessage])
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [...prev, userMessageData]);
      setIsTyping(true);

      // Call OpenAI API via edge function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('chat-openai', {
        body: { message: content },
      });

      if (aiError) throw aiError;

      // Add AI response
      const aiMessage = {
        chat_session_id: sessionId,
        user_id: userId,
        content: aiResponse.message || "I'm sorry, I couldn't generate a response.",
        is_user: false,
      };

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert([aiMessage])
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      setMessages(prev => [...prev, aiMessageData]);

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    isTyping,
    sendMessage,
    refreshMessages: fetchMessages,
  };
};
