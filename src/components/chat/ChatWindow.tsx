
'use client';

import { useState, useRef, useEffect } from 'react';
import type { Conversation, Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatAssistant } from '@/ai/flows/chat-assistant';
import { useChatStore } from './use-chat-store';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const { user: buyer } = useAuth();
  const { messages, addMessage } = useChatStore((state) => ({
    messages: state.conversations.find((c) => c.id === conversation.id)?.messages || [],
    addMessage: state.addMessage,
  }));
  const { t, locale } = useTranslation();
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
       if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !buyer) return;

    const buyerMessage: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      sender: 'buyer',
      timestamp: new Date().toLocaleTimeString(),
    };

    addMessage(conversation.id, buyerMessage);
    setNewMessage('');
    setIsSending(true);

    try {
        const messageHistory = [...messages, buyerMessage]
            .map(m => `${m.sender === 'buyer' ? (buyer.user_metadata.full_name || 'Buyer') : conversation.user.name}: ${m.text}`)
            .join('\n');

        const result = await chatAssistant({
            buyerName: buyer.user_metadata.full_name || t('chat.potentialBuyer'),
            sellerName: conversation.user.name,
            propertyName: t(conversation.property.title),
            messageHistory: messageHistory,
            locale: locale,
        });

        const sellerResponse: Message = {
            id: crypto.randomUUID(),
            text: result.response,
            sender: 'seller',
            timestamp: new Date().toLocaleTimeString(),
        };

        addMessage(conversation.id, sellerResponse);
    } catch (error) {
        console.error("Failed to get AI response:", error);
        const errorResponse: Message = {
            id: crypto.randomUUID(),
            text: t('chat.error'),
            sender: 'seller',
            timestamp: new Date().toLocaleTimeString(),
        };
        addMessage(conversation.id, errorResponse);
    } finally {
        setIsSending(false);
    }
  };

  const getAvatar = (sender: 'buyer' | 'seller') => {
    return sender === 'buyer' ? buyer?.user_metadata.avatar_url : conversation.user.avatar;
  };

  const getInitial = (sender: 'buyer' | 'seller') => {
    const name = sender === 'buyer' ? buyer?.user_metadata.full_name : conversation.user.name;
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  if (!buyer) {
      return (
        <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
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
                  <AvatarImage src={getAvatar('seller')} />
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
                  <AvatarImage src={getAvatar('seller')} />
                  <AvatarFallback>{getInitial('seller')}</AvatarFallback>
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
