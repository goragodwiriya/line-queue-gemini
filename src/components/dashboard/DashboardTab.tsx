import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Bot
} from "lucide-react";

const mockStats = {
  totalQueues: 156,
  activeQueues: 12,
  completedToday: 89,
  cancelled: 3,
  averageWaitTime: "15 นาที",
  satisfactionRate: "94%"
};

const recentActivities = [
  { id: 1, text: "คิว Q045 เสร็จสิ้นการให้บริการ", time: "2 นาทีที่แล้ว", type: "success" },
  { id: 2, text: "ลูกค้าจองคิวใหม่ผ่าน LINE", time: "5 นาทีที่แล้ว", type: "info" },
  { id: 3, text: "คิว Q044 ถูกเรียกให้บริการ", time: "8 นาทีที่แล้ว", type: "primary" },
  { id: 4, text: "ลูกค้าส่งข้อความใน LINE", time: "12 นาทีที่แล้ว", type: "info" },
];

export const DashboardTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">แดชบอร์ด</h2>
          <p className="text-muted-foreground">ภาพรวมระบบจองคิววันนี้</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          เปลี่ยนวันที่
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="คิวทั้งหมดวันนี้"
          value={mockStats.totalQueues}
          description="เพิ่มขึ้น 12% จากเมื่อวาน"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="คิวที่รออยู่"
          value={mockStats.activeQueues}
          description="กำลังรอให้บริการ"
          icon={Clock}
          className="border-l-4 border-l-warning"
        />
        <StatCard
          title="เสร็จสิ้นแล้ว"
          value={mockStats.completedToday}
          description="เสร็จสิ้นแล้ววันนี้"
          icon={CheckCircle}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="ยกเลิก"
          value={mockStats.cancelled}
          description="คิวที่ถูกยกเลิก"
          icon={XCircle}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เวลารอเฉลี่ย</p>
                <p className="text-xl font-bold text-foreground">{mockStats.averageWaitTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ความพึงพอใจ</p>
                <p className="text-xl font-bold text-foreground">{mockStats.satisfactionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-line-green/10 rounded-full">
                <MessageSquare className="w-6 h-6 text-line-green" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LINE Messages</p>
                <p className="text-xl font-bold text-foreground">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              กิจกรรมล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'primary' ? 'bg-primary' : 'bg-secondary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-line-green" />
              สถานะ LINE Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">เชื่อมต่อแล้ว</span>
              </div>
              <span className="text-xs text-muted-foreground">ออนไลน์</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Webhook URL:</span>
                <span className="text-success">✓ Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gemini API:</span>
                <span className="text-success">✓ Connected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database:</span>
                <span className="text-success">✓ Connected</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              ทดสอบการเชื่อมต่อ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};