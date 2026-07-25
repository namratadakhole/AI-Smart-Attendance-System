import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Tone = "blue" | "green" | "red" | "purple";

const toneStyles: Record<Tone, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/20" },
  green: { bg: "bg-success/10", text: "text-success", ring: "ring-success/20" },
  red: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    ring: "ring-destructive/20",
  },
  purple: { bg: "bg-[oklch(0.6_0.18_300)]/10", text: "text-[oklch(0.55_0.2_300)]", ring: "ring-[oklch(0.6_0.18_300)]/20" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: Tone;
  trend?: string;
}) {
  const s = toneStyles[tone];
  return (
    <Card className="p-5 border shadow-soft hover:shadow-elevated transition-shadow bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {label}
          </p>
          <p
            className="mt-2 text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "Sora, Inter, sans-serif" }}
          >
            {value}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1",
            s.bg,
            s.text,
            s.ring,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
