
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { useTranslation } from "@/hooks/useTranslation";
import { UserNav } from "./UserNav";
import { useAuth } from "@/context/AuthContext";
import { MessageNotifications } from "./MessageNotifications";
import { GlobalSearch } from "../search/GlobalSearch";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/components/chat/use-chat-store";

export function Header() {
  const { t } = useTranslation();
  const { user, supabase } = useAuth();
  const { fetchConversations } = useChatStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Fetch conversations when user logs in
  useEffect(() => {
    if (user && supabase) {
        fetchConversations(user.id, supabase);
    }
  }, [user, supabase, fetchConversations]);

  const logoHref = user ? "/" : "/landing";
  const isLanding = pathname === '/landing';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Only add scroll listener if on the landing page for guests
    if (isLanding && !user) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
        // If not on landing or user is logged in, ensure header is not transparent.
        setScrolled(true);
    }
  }, [isLanding, user]);
  
  const showTransparentNav = isLanding && !scrolled && !user && isMounted;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300", 
      showTransparentNav ? "bg-transparent" : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}>
      <div className="container flex h-16 items-center">
        <Link href={logoHref}>
            <Logo layout="horizontal" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
          <Link
            href="/"
            className="transition-colors hover:text-accent text-foreground/60"
          >
            {t('header.properties')}
          </Link>
          {user && (
            <>
              <Link
                href="/favorites"
                className="transition-colors hover:text-accent text-foreground/60"
              >
                {t('header.favorites')}
              </Link>
              <Link
                href="/properties/new"
                className="transition-colors hover:text-accent text-foreground/60"
              >
                {t('header.addProperty')}
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-center space-x-4 px-8">
           { user && <GlobalSearch /> }
        </div>
        <div className="flex items-center justify-end space-x-2">
          {user && <MessageNotifications />}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
