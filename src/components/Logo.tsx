import Link from "next/link";

const CustomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path
      fill="currentColor"
      d="M256 56C149.9 56 64 142 64 248v20.4c0 43.1 35.5 78.4 78.7 78.4h226.6c43.2 0 78.7-35.3 78.7-78.4V248c0-106-85.9-192-192-192zm-90.5 244.5c-11.8 11.8-30.8 11.8-42.5 0l-6-6c-11.8-11.8-11.8-30.8 0-42.5l96.5-96.5c11.8-11.8 30.8-11.8 42.5 0l6 6c11.8 11.8 11.8 30.8 0 42.5l-96.5 96.5z"
    />
    <path
      fill="currentColor"
      d="M320 256a64 64 0 1 0 0-128 64 64 0 0 0 0 128zm0-32a32 32 0 1 1 0-64 32 32 0 0 1 0 64z"
    />
  </svg>
);

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <CustomLogo className="h-8 w-auto text-primary" />
      <span className="text-xl font-bold tracking-tighter text-primary font-headline">
        VENDRA
      </span>
    </Link>
  );
}
