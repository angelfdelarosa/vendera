'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mockConversations } from '@/lib/mock-data';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Loader2, MessageCircle, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile, Property } from '@/types';

interface Conversation {
    id: string;
    user: UserProfile;
    property: Property;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
   useEffect(() => {
    // Select the first conversation by default
    if (conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);


  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center container mx-auto mt-8">
        <MessagesSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-primary">
          No Conversations Yet
        </h2>
        <p className="text-muted-foreground">
          When you contact a seller, your conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">
          Your Conversations
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your messages with sellers.
        </p>
      </div>
      <Card className="h-[calc(100vh-18rem)] flex overflow-hidden">
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 font-semibold border-b">
            All Messages ({conversations.length})
          </div>
          <nav className="p-2 space-y-1">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                className={cn(
                  "w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors",
                  selectedConversation?.id === convo.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={convo.user.avatar} />
                  <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                   <div className="flex justify-between items-center">
                     <p className="font-semibold text-sm truncate">{convo.user.name}</p>
                     <p className="text-xs text-muted-foreground flex-shrink-0">{convo.timestamp}</p>
                   </div>
                    <p className="text-xs text-muted-foreground truncate">
                        Re: {convo.property.title}
                    </p>
                   <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                 {convo.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>}
              </button>
            ))}
          </nav>
        </div>
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <ChatWindow
              buyer={user}
              seller={selectedConversation.user}
              property={selectedConversation.property}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold">Select a conversation</h2>
                <p>Choose a conversation from the list to see the messages.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
