import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  withText?: boolean;
};

export function Logo({ className, withText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 64 64" className="size-8 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="14" className="fill-foreground" />
        <path
          d="M14 48V26l14-8 14 8v22"
          fill="none"
          className="stroke-background"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M22 48V36h12v12"
          fill="none"
          className="stroke-background"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="47" cy="45" r="9" fill="#22c55e" />
        <path
          d="M43 45l3 3 5-6"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="text-base font-semibold tracking-tight">
          Объекты и задачи
        </span>
      )}
    </div>
  );
}
