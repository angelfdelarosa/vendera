
'use client';

import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useChatStore } from '../chat/use-chat-store';
import { useRouter } from 'next/navigation';

export function MessageNotifications() {
  const router = useRouter();
  const { conversations, selectConversation } = useChatStore();
  const unreadCount = conversations.filter((c) => c.unread).length;

  const handleNotificationClick = (conversationId: string) => {
    selectConversation(conversationId);
    router.push('/messages');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Open messages</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 font-medium border-b">
          <h3>Inbox</h3>
        </div>
        <div className="space-y-1 p-2 max-h-[400px] overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <div
                key={convo.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleNotificationClick(convo.id)}
              >
                <Link
                  href={`/profile/${convo.user.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={convo.user.avatar} />
                    <AvatarFallback>
                      {convo.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/profile/${convo.user.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="font-semibold text-sm hover:underline">
                        {convo.user.name}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {convo.timestamp}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {convo.messages[convo.messages.length - 1]?.text}
                  </p>
                </div>
                {convo.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <MessageSquare className="mx-auto h-8 w-8 mb-2" />
              <p>No new messages.</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="link" asChild>
            <Link href="/messages">View all messages</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
