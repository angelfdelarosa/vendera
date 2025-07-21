import Link from "next/link";
import { cn } from "@/lib/utils";

const CustomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 595.28 595.28"
    fill="currentColor"
    {...props}
  >
    <path d="M564.44,228.41l-113-113a15,15,0,0,0-21.22,0L315.8,230.15a15,15,0,0,0,0,21.22L403.3,339a15,15,0,0,0,21.21,0l139.93-139.93A15,15,0,0,0,564.44,228.41Z" />
    <path d="M293.57,252.37,185.8,144.6a15,15,0,0,0-21.22,0L30.65,278.53a15,15,0,0,0,0,21.22l87.5,87.5a15,15,0,0,0,21.21,0L293.57,273.58A15,15,0,0,0,293.57,252.37Z" />
    <path d="M371.7,337.88a45,45,0,1,0,0,63.64,45,45,0,0,0,0-63.64Z" />
    <path d="M31.49,438.86,209,261.35a15,15,0,0,1,21.21,0L384.4,415.53a15,15,0,0,1,0,21.22L213.23,607.92a30,30,0,0,1-42.43,0L31.49,460.07a15,15,0,0,1,0-21.21Z" />
  </svg>
);

interface LogoProps {
  layout?: 'horizontal' | 'vertical';
}

export function Logo({ layout = 'horizontal' }: LogoProps) {
  const isVertical = layout === 'vertical';

  return (
    <Link
      href="/"
      className={cn(
        'flex items-center',
        isVertical ? 'flex-col gap-4' : 'flex-row gap-2'
      )}
    >
      <CustomLogo
        className={cn(
          'text-primary',
          isVertical ? 'h-24 w-24' : 'h-8 w-8'
        )}
      />
      <span
        className={cn(
          'font-bold tracking-tighter text-primary font-headline',
          isVertical ? 'text-5xl' : 'text-xl'
        )}
      >
        VENDRA
      </span>
    </Link>
  );
}
