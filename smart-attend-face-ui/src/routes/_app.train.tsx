import { createFileRoute } from "@tanstack/react-router";
import { Brain, Cpu, Database, Zap, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/train")({
  head: () => ({ meta: [{ title: "Train AI Model · SmartAttend AI" }] }),
  component: TrainPage,
});

function TrainPage() {
  const stats = [
    { icon: Database, label: "Training Samples", value: "2,438", tone: "bg-primary/10 text-primary" },
    { icon: Cpu, label: "Model Version", value: "v3.1.4", tone: "bg-[oklch(0.6_0.18_300)]/10 text-[oklch(0.55_0.2_300)]" },
    { icon: Zap, label: "Accuracy", value: "99.24%", tone: "bg-success/10 text-success" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sora, Inter, sans-serif" }}>
          Train Face Recognition Model
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate facial encodings from student photos to update the AI model.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 border shadow-soft">
            <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "Sora, Inter, sans-serif" }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border shadow-soft">
        <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl gradient-primary text-primary-foreground shadow-elevated">
            <Brain className="h-10 w-10" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold">Neural Network Ready</h2>
              <Badge className="bg-success/15 text-success border-0">Idle</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last trained 2 days ago · 120 students indexed
            </p>
            <Button className="mt-4 gradient-primary text-primary-foreground">
              <Play className="h-4 w-4 mr-2" /> Start Training
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border shadow-soft">
        <h3 className="font-semibold mb-4">Training Pipeline</h3>
        <div className="space-y-5">
          {[
            { label: "Loading student images", pct: 100 },
            { label: "Detecting faces", pct: 100 },
            { label: "Extracting facial encodings", pct: 78 },
            { label: "Building recognition index", pct: 34 },
            { label: "Validating model accuracy", pct: 0 },
          ].map((step) => (
            <div key={step.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{step.label}</span>
                <span className="text-muted-foreground">{step.pct}%</span>
              </div>
              <Progress value={step.pct} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
