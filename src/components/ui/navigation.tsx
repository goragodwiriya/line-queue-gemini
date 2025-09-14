import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings,
  Clock,
  Calendar
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "แดชบอร์ด", icon: BarChart3 },
  { id: "queue", label: "จัดการคิว", icon: Users },
  { id: "current", label: "คิวปัจจุบัน", icon: Clock },
  { id: "schedule", label: "ตารางเวลา", icon: Calendar },
  { id: "chat", label: "แชทบอท", icon: MessageSquare },
  { id: "settings", label: "ตั้งค่า", icon: Settings },
];

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="bg-card border-r border-border h-screen w-64 p-4 shadow-medium">
      <div className="mb-8">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          ระบบจองคิว LINE
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Queue Management System
        </p>
      </div>
      
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 text-left font-medium",
                isActive && "shadow-soft"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-card p-4 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            LINE Bot เชื่อมต่อแล้ว
          </div>
        </div>
      </div>
    </nav>
  );
};