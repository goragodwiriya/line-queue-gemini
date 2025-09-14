import { useState } from "react";
import { QueueCard } from "@/components/ui/queue-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Users,
  Clock,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const mockQueues: QueueItem[] = [
  {
    id: "1",
    number: 45,
    name: "สมชาย ใจดี",
    phone: "081-234-5678",
    service: "ตรวจสุขภาพทั่วไป",
    status: "waiting",
    createdAt: "2024-01-15T09:30:00Z",
    estimatedTime: "20 นาที"
  },
  {
    id: "2",
    number: 46,
    name: "สมหญิง สุขใจ",
    phone: "082-345-6789",
    service: "ปรึกษาแพทย์",
    status: "called",
    createdAt: "2024-01-15T09:45:00Z",
    estimatedTime: "15 นาที"
  },
  {
    id: "3",
    number: 47,
    name: "วิชัย เก่งดี",
    phone: "083-456-7890",
    service: "ฉีดวัคซีน",
    status: "waiting",
    createdAt: "2024-01-15T10:00:00Z",
    estimatedTime: "25 นาที"
  },
  {
    id: "4",
    number: 44,
    name: "มาลี ใจงาม",
    phone: "084-567-8901",
    service: "ตรวจสุขภาพทั่วไป",
    status: "completed",
    createdAt: "2024-01-15T09:00:00Z"
  }
];

export const QueueTab = () => {
  const [queues, setQueues] = useState(mockQueues);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.phone.includes(searchTerm) ||
                         queue.number.toString().includes(searchTerm);
    const matchesFilter = filterStatus === "all" || queue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCallQueue = (id: string) => {
    setQueues(prev => prev.map(queue => 
      queue.id === id ? { ...queue, status: "called" } : queue
    ));
    toast({
      title: "เรียกคิวแล้ว",
      description: "ส่งการแจ้งเตือนให้ลูกค้าผ่าน LINE แล้ว",
    });
  };

  const handleCompleteQueue = (id: string) => {
    setQueues(prev => prev.map(queue => 
      queue.id === id ? { ...queue, status: "completed", estimatedTime: undefined } : queue
    ));
    toast({
      title: "เสร็จสิ้นการให้บริการ",
      description: "บันทึกข้อมูลสำเร็จ",
    });
  };

  const handleCancelQueue = (id: string) => {
    setQueues(prev => prev.map(queue => 
      queue.id === id ? { ...queue, status: "cancelled", estimatedTime: undefined } : queue
    ));
    toast({
      title: "ยกเลิกคิวแล้ว",
      description: "ส่งการแจ้งเตือนให้ลูกค้าผ่าน LINE แล้ว",
      variant: "destructive",
    });
  };

  const statusCounts = {
    waiting: queues.filter(q => q.status === "waiting").length,
    called: queues.filter(q => q.status === "called").length,
    serving: queues.filter(q => q.status === "serving").length,
    completed: queues.filter(q => q.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">จัดการคิว</h2>
          <p className="text-muted-foreground">จัดการและติดตามสถานะคิวของลูกค้า</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            รีเฟรช
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มคิวใหม่
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{statusCounts.waiting}</div>
            <div className="text-sm text-muted-foreground">รอคิว</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{statusCounts.called}</div>
            <div className="text-sm text-muted-foreground">เรียกแล้ว</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{statusCounts.serving}</div>
            <div className="text-sm text-muted-foreground">กำลังให้บริการ</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">เสร็จสิ้น</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยชื่อ, เบอร์โทร หรือหมายเลขคิว..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                ทั้งหมด
              </Button>
              <Button
                variant={filterStatus === "waiting" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("waiting")}
              >
                รอคิว
              </Button>
              <Button
                variant={filterStatus === "called" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("called")}
              >
                เรียกแล้ว
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQueues.map((queue) => (
          <QueueCard
            key={queue.id}
            queue={queue}
            onCallQueue={handleCallQueue}
            onCompleteQueue={handleCompleteQueue}
            onCancelQueue={handleCancelQueue}
          />
        ))}
      </div>

      {filteredQueues.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">ไม่พบคิวที่ตรงกับการค้นหา</h3>
            <p className="text-muted-foreground">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};