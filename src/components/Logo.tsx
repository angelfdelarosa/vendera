import Link from "next/link";

const CustomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22h20" />
    <path d="M13.29 17.7a2.5 2.5 0 0 1-3.58 0" />
    <path d="M12 22V8" />
    <path d="M4 12v-2a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v2" />
    <path d="m20 12-8-8-8 8" />
  </svg>
);

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <CustomLogo className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold tracking-tighter text-primary font-headline">
        VENDRA
      </span>
    </Link>
  );
}
