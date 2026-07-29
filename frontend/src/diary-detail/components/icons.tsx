import { SVGProps } from "react";

export function BackIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} {...props}>
   <path d="M15 6L9 12L15 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
 );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
   <circle cx="12" cy="8" r="4.2" />
   <path d="M4.5 20C4.5 16.6863 7.18629 14 10.5 14H13.5C16.8137 14 19.5 16.6863 19.5 20V20H4.5Z" />
  </svg>
 );
}

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
   <path d="M4 6H20" strokeLinecap="round" />
   <path d="M4 12H20" strokeLinecap="round" />
   <path d="M4 18H20" strokeLinecap="round" />
   <circle cx="9" cy="6" r="2.3" fill="#fff" stroke="currentColor" />
   <circle cx="15" cy="12" r="2.3" fill="#fff" stroke="currentColor" />
   <circle cx="11" cy="18" r="2.3" fill="#fff" stroke="currentColor" />
  </svg>
 );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
   <circle cx="10.5" cy="10.5" r="5.8" />
   <path d="M15 15L20 20" strokeLinecap="round" />
  </svg>
 );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
   <path d="M6.2 8.8L12 14.6L17.8 8.8" />
  </svg>
 );
}

export function SpeakerBadgeIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
   <circle cx="12" cy="8" r="3.7" />
   <path d="M5 19.5C5 16.7 7.2 14.5 10 14.5H14C16.8 14.5 19 16.7 19 19.5V20H5V19.5Z" />
  </svg>
 );
}

export function PlayTriangleIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
   <path d="M8 5.6C8 4.7 9 4.2 9.8 4.7L18.5 10.1C19.2 10.6 19.2 11.6 18.5 12.1L9.8 17.5C9 18 8 17.5 8 16.6V5.6Z" />
  </svg>
 );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
   <rect x="6.5" y="5.5" width="4" height="13" rx="1.3" />
   <rect x="13.5" y="5.5" width="4" height="13" rx="1.3" />
  </svg>
 );
}

export function HashIcon(props: SVGProps<SVGSVGElement>) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
   <line x1="4" y1="9" x2="20" y2="9" />
   <line x1="4" y1="15" x2="20" y2="15" />
   <line x1="10" y1="3" x2="8" y2="21" />
   <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
 );
}
