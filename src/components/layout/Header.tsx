"use client";

import Link from "next/link";
import { UserNav } from "./UserNav";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
        <div className="flex flex-1 items-center justify-center space-x-4 px-8">
           <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
