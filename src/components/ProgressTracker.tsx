import { Check, Clock, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "rejected";
  date?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressTracker({ steps, className }: ProgressTrackerProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                step.status === "completed" && "bg-success border-success text-success-foreground",
                step.status === "current" && "bg-primary border-primary text-primary-foreground animate-pulse-soft",
                step.status === "pending" && "bg-muted border-muted-foreground/30 text-muted-foreground",
                step.status === "rejected" && "bg-destructive border-destructive text-destructive-foreground"
              )}
            >
              {step.status === "completed" && <Check className="w-5 h-5" />}
              {step.status === "current" && <Loader2 className="w-5 h-5 animate-spin" />}
              {step.status === "pending" && <Clock className="w-5 h-5" />}
              {step.status === "rejected" && <XCircle className="w-5 h-5" />}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-full min-h-[40px] mt-2",
                  step.status === "completed" ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className="font-semibold text-foreground">{step.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            {step.date && (
              <p className="text-xs text-muted-foreground mt-2">{step.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
