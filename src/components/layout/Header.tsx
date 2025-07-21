"use client";

import Link from "next/link";
import { UserNav } from "./UserNav";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo layout="horizontal" />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
          <Link
            href="/"
            className="transition-colors hover:text-accent"
          >
            {t('header.properties')}
          </Link>
          <Link
            href="/favorites"
            className="text-foreground/60 transition-colors hover:text-accent"
          >
            {t('header.favorites')}
          </Link>
          <Link
            href="/properties/new"
            className="text-foreground/60 transition-colors hover:text-accent"
          >
            {t('header.addProperty')}
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
