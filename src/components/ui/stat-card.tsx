import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: StatCardProps) => {
  return (
    <Card className={cn("bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-success/10 text-success" 
                    : "bg-destructive/10 text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};