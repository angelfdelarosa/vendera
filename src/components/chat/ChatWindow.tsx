
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatAssistant } from '@/ai/flows/chat-assistant';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  conversationId: string;
  recipient: UserProfile;
}

export function ChatWindow({ conversationId, recipient }: ChatWindowProps) {
  const { user: authUser, supabase } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const { t, locale } = useTranslation();
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
       if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  }, []);
  
  useEffect(() => {
    const fetchMessages = async () => {
        if (!conversationId || !supabase) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
            setMessages([]);
        } else {
            const formattedMessages: Message[] = data.map(m => ({
                id: m.id.toString(),
                text: m.content,
                sender: m.sender_id === authUser?.id ? 'buyer' : 'seller', // Simplified assumption
                timestamp: format(new Date(m.created_at), 'p')
            }));
            setMessages(formattedMessages);
        }
        setIsLoading(false);
    }
    fetchMessages();
  }, [conversationId, supabase, authUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  useEffect(() => {
      if (!supabase || !conversationId) return;

      const channel = supabase.channel(`chat:${conversationId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, 
        (payload) => {
            const newMessage = payload.new as any;
            const formattedMessage: Message = {
                id: newMessage.id.toString(),
                text: newMessage.content,
                sender: newMessage.sender_id === authUser?.id ? 'buyer' : 'seller',
                timestamp: format(new Date(newMessage.created_at), 'p')
            }
            setMessages(currentMessages => [...currentMessages, formattedMessage]);
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      }

  }, [supabase, conversationId, authUser?.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authUser || !supabase) return;

    setIsSending(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: authUser.id,
        content: newMessage,
      });

    if (error) {
        console.error("Error sending message:", error);
        toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } else {
        setNewMessage('');
    }
    
    setIsSending(false);
  };
  
  const getAvatar = (sender: 'buyer' | 'seller') => {
    return sender === 'buyer' ? authUser?.user_metadata.avatar_url : recipient.avatar_url;
  };

  const getInitial = (sender: 'buyer' | 'seller') => {
    const name = sender === 'buyer' ? authUser?.user_metadata.full_name : recipient.full_name;
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4 pr-2" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.sender === 'buyer' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'seller' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getAvatar('seller') || undefined} />
                  <AvatarFallback>{getInitial('seller')}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-3 text-sm',
                  message.sender === 'buyer'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp}</p>
              </div>
              {message.sender === 'buyer' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getAvatar('buyer') || undefined} />
                  <AvatarFallback>{getInitial('buyer')}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isSending && (
             <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getAvatar('buyer') || undefined} />
                  <AvatarFallback>{getInitial('buyer')}</AvatarFallback>
                </Avatar>
                 <div className="bg-muted rounded-lg p-3 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                 </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t p-4"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('chat.placeholder')}
          autoComplete="off"
          disabled={isSending}
        />
        <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

// Dummy toast for now
const toast = (props: any) => console.log('Toast:', props.title);
