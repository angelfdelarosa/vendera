
'use client';

import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare } from 'lucide-react';
import { mockConversations } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

export function MessageNotifications() {
  const unreadCount = mockConversations.filter((c) => c.unread).length;

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
          {mockConversations.length > 0 ? (
            mockConversations.map((convo) => (
              <Link
                key={convo.id}
                href={`/profile/${convo.user.id}?chat=true`}
                className="block"
              >
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <Avatar>
                    <AvatarImage src={convo.user.avatar} />
                    <AvatarFallback>
                      {convo.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm">{convo.user.name}</p>
                        <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.lastMessage}
                    </p>
                  </div>
                  {convo.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
                  )}
                </div>
              </Link>
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
