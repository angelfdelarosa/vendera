
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function GlobalSearch() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${category}`);
    }
  };

  return (
    <div className="relative flex w-full max-w-lg items-center">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[120px] rounded-r-none border-r-0 focus:ring-0">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo</SelectItem>
          <SelectItem value="properties">Propiedades</SelectItem>
          <SelectItem value="users">Vendedores</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search.placeholder.properties')}
          className="pl-10 rounded-l-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  );
}
