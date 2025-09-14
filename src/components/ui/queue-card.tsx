import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueItem {
  id: string;
  number: number;
  name: string;
  phone: string;
  service: string;
  status: "waiting" | "called" | "serving" | "completed" | "cancelled";
  createdAt: string;
  estimatedTime?: string;
}

interface QueueCardProps {
  queue: QueueItem;
  onCallQueue?: (id: string) => void;
  onCompleteQueue?: (id: string) => void;
  onCancelQueue?: (id: string) => void;
}

const statusConfig = {
  waiting: { label: "รอคิว", className: "bg-warning/10 text-warning border-warning/20" },
  called: { label: "เรียกแล้ว", className: "bg-secondary/10 text-secondary border-secondary/20" },
  serving: { label: "กำลังให้บริการ", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "เสร็จสิ้น", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "ยกเลิก", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const QueueCard = ({ queue, onCallQueue, onCompleteQueue, onCancelQueue }: QueueCardProps) => {
  const statusStyle = statusConfig[queue.status];
  
  return (
    <Card className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">Q{queue.number}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{queue.name}</h3>
              <p className="text-sm text-muted-foreground">{queue.service}</p>
            </div>
          </div>
          <Badge className={cn("border", statusStyle.className)}>
            {statusStyle.label}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{queue.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>เวลาจอง: {new Date(queue.createdAt).toLocaleTimeString('th-TH')}</span>
          </div>
          {queue.estimatedTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>เวลาโดยประมาณ: {queue.estimatedTime}</span>
            </div>
          )}
        </div>
        
        {queue.status === "waiting" && (
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => onCallQueue?.(queue.id)}
            >
              เรียกคิว
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCancelQueue?.(queue.id)}
            >
              ยกเลิก
            </Button>
          </div>
        )}
        
        {queue.status === "called" && (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={() => onCompleteQueue?.(queue.id)}
          >
            เสร็จสิ้น
          </Button>
        )}
      </CardContent>
    </Card>
  );
};