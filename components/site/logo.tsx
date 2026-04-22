import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: number;
};

export function Logo({ className, showWordmark = true, size = 32 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="font-display text-[17px] font-semibold tracking-tight">
          Accident<span className="text-accent">Maxxing</span>
        </span>
      )}
    </div>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AccidentMaxxing"
      role="img"
    >
      <defs>
        <linearGradient id="amx-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="hsl(210 100% 60%)" />
          <stop offset="1" stopColor="hsl(152 76% 48%)" />
        </linearGradient>
        <linearGradient id="amx-grad-soft" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="hsl(210 100% 60%)" stopOpacity="0.18" />
          <stop offset="1" stopColor="hsl(152 76% 48%)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#amx-grad-soft)" stroke="url(#amx-grad)" strokeWidth="1.5" />
      {/* Ascending bars forming an "A" silhouette */}
      <rect x="9" y="24" width="4" height="8" rx="1.2" fill="url(#amx-grad)" />
      <rect x="15" y="18" width="4" height="14" rx="1.2" fill="url(#amx-grad)" />
      <rect x="21" y="12" width="4" height="20" rx="1.2" fill="url(#amx-grad)" />
      <rect x="27" y="20" width="4" height="12" rx="1.2" fill="url(#amx-grad)" opacity="0.55" />
    </svg>
  );
}
