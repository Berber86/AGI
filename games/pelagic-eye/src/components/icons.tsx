import type { SVGProps } from "react";
import type { SpeciesId } from "../lib/species";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ShellMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" {...props}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" opacity=".4" fill="none" />
      <path d="M20 9c5.2 0 9.2 4.4 9.2 9.4 0 3.7-2 6.7-4.8 8l-2.9 4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 10.2c-4.4 1.2-7.4 5.3-7.4 9.7 0 4.3 2.7 8 6.5 9.6 1.6.7 3.4.7 5 0 1.6-.7 2.7-2.2 2.7-3.9 0-1.7-1.2-3.2-2.9-3.6-1.4-.3-2.8.2-3.7 1.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" {...base} />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M20 12H5M11 18l-6-6 6-6" {...base} />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M7 17 17 7M8 7h9v9" {...base} />
    </svg>
  );
}

export function DiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3 17.5c1.8-1.4 3.5-1.4 5.3 0 1.8 1.4 3.5 1.4 5.4 0 1.8-1.4 3.5-1.4 5.3 0M3 12.8c1.8-1.4 3.5-1.4 5.3 0 1.8 1.4 3.5 1.4 5.4 0 1.8-1.4 3.5-1.4 5.3 0M12 3v7M9 7l3 3 3-3" {...base} />
    </svg>
  );
}

export function WaveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" {...base} />
    </svg>
  );
}

export function SoundOn(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" {...base} />
      <path d="M15 9.2c1.4 1.6 1.4 4 0 5.6M17.8 6.7c2.7 3 2.7 7.6 0 10.6" {...base} />
    </svg>
  );
}

export function SoundOff(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" {...base} />
      <path d="m16 9.5 5 5M21 9.5l-5 5" {...base} />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="m6 6 12 12M18 6 6 18" {...base} />
    </svg>
  );
}

export function VrIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3 8.5h18v7.3c0 .9-.7 1.6-1.6 1.6h-4.1c-.7 0-1.2-.4-1.7-.9l-1.6-1.7-1.6 1.7c-.5.5-1 .9-1.7.9H4.6c-.9 0-1.6-.7-1.6-1.6z" {...base} />
      <path d="M6.2 11.6c.5-.5 1.4-.5 1.9 0M15.9 11.6c.5-.5 1.4-.5 1.9 0" {...base} />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2.4" {...base} />
      <path d="m8.5 7 1.2-2.3h4.6L15.5 7" {...base} />
      <circle cx="12" cy="13.3" r="3.2" {...base} />
    </svg>
  );
}

export function GyroIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <ellipse cx="12" cy="12" rx="9" ry="4" {...base} />
      <ellipse cx="12" cy="12" rx="4" ry="9" {...base} />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" {...base} />
    </svg>
  );
}

export function CursorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="m5 4 5.2 16 2.5-6.4 6.3-2.4z" {...base} />
    </svg>
  );
}

export function MarkerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="6.5" width="7.5" height="5.5" rx=".8" {...base} />
      <rect x="13.5" y="6.5" width="7.5" height="5.5" rx=".8" {...base} />
      <path d="M3 16.5h18M6 20h12" {...base} />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 19.5h16" {...base} />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" {...base} />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" {...base} />
      <circle cx="12" cy="12" r="3" {...base} />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" {...base} />
      <path d="m15.5 8.5-2.2 5.1-5 2.1 2.2-5.1z" {...base} />
    </svg>
  );
}

export function JournalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 4.5c3.2-1 5.8-.5 8 1.4 2.2-1.9 4.8-2.4 8-1.4v14.3c-3.2-1-5.8-.5-8 1.4-2.2-1.9-4.8-2.4-8-1.4z" {...base} />
      <path d="M12 5.9v14.3" {...base} />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M8.5 6v12M15.5 6v12" {...base} />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" {...base} />
    </svg>
  );
}

export function RotateIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="7" y="4" width="10" height="16" rx="2" {...base} />
      <path d="M3.5 9a6 6 0 0 0 1.9 9M20.5 15a6 6 0 0 0-1.9-9M4 17.5V13M20 6.5V11" {...base} />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" {...base} />
      <path d="M12 10.5V17M12 7.2v.2" {...base} />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 3c.5 4.3 3.7 7.5 8 8-4.3.5-7.5 3.7-8 8-.5-4.3-3.7-7.5-8-8 4.3-.5 7.5-3.7 8-8Z" {...base} />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="4" {...base} />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" {...base} />
    </svg>
  );
}

const glyph = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SpeciesGlyph({ id, ...props }: IconProps & { id: SpeciesId }) {
  const paths: Record<SpeciesId, React.ReactNode> = {
    clownfish: (
      <>
        <path d="M43 20c-5 8-14 11-24 9-3-.6-5-3-4-6 2-6 9-9 17-9 5 0 9 2 11 6Z" {...glyph} />
        <path d="M43 20 56 9v22L43 20Z" {...glyph} />
        <path d="M23 15v10M31 14v12M39 16v9" {...glyph} />
        <circle cx="45" cy="18" r=".9" fill="currentColor" />
      </>
    ),
    "blue-tang": (
      <>
        <path d="M41 21c-4 7-12 10-21 9-5-.5-6-4-4-8 3-6 10-9 17-8 4 .5 7 3 8 7Z" {...glyph} />
        <path d="M41 21 56 13v16L41 21Z" {...glyph} />
        <path d="M25 12c2-5 6-7 10-6" {...glyph} />
        <circle cx="43" cy="19" r=".8" fill="currentColor" />
      </>
    ),
    angelfish: (
      <>
        <path d="M41 20c-3 7-8 11-14 13-3-6-4-14-1-20 2-5 7-9 11-7 6 2 8 10 4 14Z" {...glyph} />
        <path d="M42 20 53 11l-2 14-9-5Z" {...glyph} />
        <path d="M26 5c5 0 9 2 12 6M25 36c5 0 10-2 14-6M29 12v16M35 10v20" {...glyph} />
      </>
    ),
    butterflyfish: (
      <>
        <path d="M40 20c-3 6-8 9-14 9-5 0-7-4-5-9 2-6 8-10 13-9 4 .5 7 4 6 9Z" {...glyph} />
        <path d="M15 21l-6 2M40 20 52 10l-2 14-10-4Z" {...glyph} />
        <circle cx="38" cy="18" r=".8" fill="currentColor" />
        <circle cx="46" cy="24" r="1.3" fill="currentColor" />
      </>
    ),
    turtle: (
      <>
        <ellipse cx="30" cy="20" rx="15" ry="10" {...glyph} />
        <path d="M45 20c4-1 7 0 9 2l-3 4c-2 1-4 0-6-2M18 20c-3-6-7-8-11-7M18 22c-3 6-7 8-11 7M24 10l-3-6M36 10l3-6" {...glyph} />
        <path d="M24 15c4-2 9-2 13 0M22 25c4 2 10 2 15 0" {...glyph} />
      </>
    ),
    manta: (
      <>
        <path d="M32 14c6 0 14 3 20 7-6 6-13 9-20 9s-14-3-20-9c6-4 14-7 20-7Z" {...glyph} />
        <path d="M32 30v11M27 14l-2-5M37 14l2-5" {...glyph} />
        <path d="M22 20h20" {...glyph} opacity=".5" />
      </>
    ),
    eel: (
      <>
        <path d="M18 35c0-9 5-10 10-8 5 2 4 7 9 7 4 0 6-4 5-9" {...glyph} />
        <circle cx="19" cy="35" r="2" {...glyph} />
        <path d="M21 33h.1" {...glyph} />
        <path d="M31 36c-1-5-6-5-8-2" {...glyph} opacity=".45" />
      </>
    ),
    whale: (
      <>
        <path d="M8 22c2-6 9-9 20-9 9 0 17 3 23 8l5 2-6 4c-7 4-15 6-24 5-10-1-18-5-18-10Z" {...glyph} />
        <path d="M13 28c3 4 8 6 14 7M9 21c-3 1-5 4-4 7M56 21l3-5M18 26c4 2 9 3 14 3M8 18c-2-2-4-2-5 0" {...glyph} />
        <circle cx="48" cy="24" r=".9" fill="currentColor" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 64 44" {...props}>
      {paths[id]}
    </svg>
  );
}
