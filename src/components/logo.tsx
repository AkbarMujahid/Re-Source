import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Re-Source Logo</title>
      <path d="M12 2a10 10 0 0 0-7.5 16.5" />
      <path d="M12 22a10 10 0 0 0 7.5-16.5" />
      <path d="M7.5 5.5 12 11l4.5-5.5" />
      <path d="m16.5 18.5-4.5-5.5-4.5 5.5" />
      <path d="M12 11h8.5" />
      <path d="M12 11V2" />
    </svg>
  );
}
