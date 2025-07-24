
"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useTranslation } from "@/hooks/useTranslation";
import { UserNav } from "./UserNav";
import { useAuth } from "@/context/AuthContext";
import { MessageNotifications } from "./MessageNotifications";
import { GlobalSearch } from "../search/GlobalSearch";

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const logoHref = user ? "/" : "/landing";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={logoHref}>
            <Logo layout="horizontal" />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
          <Link
            href="/"
            className="transition-colors hover:text-accent"
          >
            {t('header.properties')}
          </Link>
          {user && (
            <>
              <Link
                href="/favorites"
                className="text-foreground/60 transition-colors hover:text-accent"
              >
                {t('header.favorites')}
              </Link>
              <Link
                href="/messages"
                className="text-foreground/60 transition-colors hover:text-accent"
              >
                {t('messages.title')}
              </Link>
              <Link
                href="/properties/new"
                className="text-foreground/60 transition-colors hover:text-accent"
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
