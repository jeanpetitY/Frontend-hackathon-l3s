import type { SVGProps } from "react";

export type IconName =
  | "arrow-right"
  | "check"
  | "chevron-right"
  | "document"
  | "lock"
  | "refresh"
  | "sparkles"
  | "upload";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

const paths: Record<IconName, React.ReactNode> = {
  "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  lock: <><rect width="14" height="10" x="5" y="11" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  refresh: <><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" /></>,
  sparkles: <><path d="m12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6Z" /><path d="m5 16-.7 1.8L2.5 18.5l1.8.7L5 21l.7-1.8 1.8-.7-1.8-.7Z" /><path d="m19 15-.7 1.8-1.8.7 1.8.7L19 21l.7-1.8 1.8-.7-1.8-.7Z" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M20 16v4H4v-4" /></>,
};

export function Icon({ name, className = "size-5", ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
