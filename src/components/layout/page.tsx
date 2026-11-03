import { cn } from "@/lib/utils";

export function Page({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-6", className)}>
      {children}
    </div>
  );
}
