import { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  expand: <path d="M8 3H3v5m0-5 6 6m7-6h5v5m0-5-6 6M3 16v5h5m-5 0 6-6m12 1v5h-5m5 0-6-6" />,
  duplicate: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
  selection: <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  undo: (
    <>
      <path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14" />
    </>
  ),
  redo: <path d="m16 4 5 5-5 5M21 9H11a7 7 0 0 0 0 14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  fit: (
    <>
      <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9a3 3 0 1 1 4 3v2M12 17h.01" />
    </>
  ),
  grip: (
    <>
      <path
        d="M8 5h.01M16 5h.01M8 12h.01M16 12h.01M8 19h.01M16 19h.01"
        strokeWidth="3"
      />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
    </>
  ),
  arrow: <path d="m9 5 7 7-7 7" />,
  hand: (
    <path d="M8 13V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v11c0 4-2 6-6 6h-2c-2 0-3-1-4-3l-4-5a2 2 0 0 1 3-3l1 2Z" />
  ),
  cursor: <path d="m5 3 14 10-7 1-3 7Z" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
};
export function Icon({ name }: { name: string }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
