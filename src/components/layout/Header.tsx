
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

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoHref = user ? "/" : "/landing";
  const isLanding = pathname === '/landing';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    if (isLanding) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isLanding]);
  
  const showTransparentNav = isLanding && !scrolled && isMounted;

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
            className={cn("transition-colors hover:text-accent", showTransparentNav ? 'text-white/80 hover:text-white' : 'text-foreground/60')}
          >
            {t('header.properties')}
          </Link>
          {user && (
            <>
              <Link
                href="/favorites"
                className={cn("transition-colors hover:text-accent", showTransparentNav ? 'text-white/80 hover:text-white' : 'text-foreground/60')}
              >
                {t('header.favorites')}
              </Link>
              <Link
                href="/properties/new"
                className={cn("transition-colors hover:text-accent", showTransparentNav ? 'text-white/80 hover:text-white' : 'text-foreground/60')}
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
