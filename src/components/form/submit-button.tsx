import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "type" | "disabled">;

export function SubmitButton({
  loading,
  loadingText,
  children,
  ...button
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={loading} {...button}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
