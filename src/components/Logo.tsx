import Link from "next/link";
import { Landmark } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Landmark className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tighter text-primary font-headline">
        VENDRA
      </span>
    </Link>
  );
}
