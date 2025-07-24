import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  layout?: 'horizontal' | 'vertical';
}

export function Logo({ layout = 'horizontal' }: LogoProps) {
  const isVertical = layout === 'vertical';

  return (
    <div
      className={cn(
        'flex items-center',
        isVertical ? 'flex-col gap-4' : 'flex-row gap-2'
      )}
    >
      {/* 
        Asegúrate de subir tu logo (p. ej., 'logo.png') a la carpeta /public.
        Si tu archivo tiene un nombre diferente, actualiza la propiedad 'src' a continuación.
      */}
      <img
        src="/logo12.svg" // Apunta al logo en la carpeta /public
        alt="VENDRA Logo"
        className={cn(isVertical ? 'h-24 w-24' : 'h-8 w-8', 'object-contain')}
      />
      <span
        className={cn(
          'font-bold tracking-tighter text-primary font-headline',
          isVertical ? 'text-5xl' : 'text-xl'
        )}
      >
        VENDRA
      </span>
    </div>
  );
}
