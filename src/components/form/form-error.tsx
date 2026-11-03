import { CircleAlert } from "lucide-react";

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" />
      {message}
    </div>
  );
}
