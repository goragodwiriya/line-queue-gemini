import { useState } from "react";
import { Search, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QueueCard } from "@/components/ui/queue-card";
import { useQueues, QueueItem } from "@/hooks/useQueues";
import { AddQueueDialog } from "./AddQueueDialog";

const QueueTab = () => {
  const { queues, loading, updateQueueStatus } = useQueues();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (queue.phone && queue.phone.includes(searchTerm)) ||
                         queue.number.toString().includes(searchTerm);
    const matchesFilter = filterStatus === "all" || queue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCallQueue = (id: string) => {
    updateQueueStatus(id, 'called');
  };

  const handleCompleteQueue = (id: string) => {
    updateQueueStatus(id, 'completed');
  };

  const handleCancelQueue = (id: string) => {
    updateQueueStatus(id, 'cancelled');
  };

  const waitingCount = queues.filter(q => q.status === "waiting").length;
  const calledCount = queues.filter(q => q.status === "called").length;
  const completedCount = queues.filter(q => q.status === "completed").length;
  const cancelledCount = queues.filter(q => q.status === "cancelled").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอคิว</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
            <Badge variant="secondary" className="mt-1">
              คิว
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังเรียก</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calledCount}</div>
            <Badge variant="outline" className="mt-1">
              คิว
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <Badge variant="default" className="mt-1">
              คิว
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยกเลิก</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledCount}</div>
            <Badge variant="destructive" className="mt-1">
              คิว
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาด้วยชื่อ หรือเบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="กรองตามสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="waiting">รอคิว</SelectItem>
                <SelectItem value="called">กำลังเรียก</SelectItem>
                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                <SelectItem value="cancelled">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
            <AddQueueDialog />
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      <div className="grid gap-4">
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
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่พบคิวที่ตรงกับการค้นหา</h3>
            <p className="text-muted-foreground">ลองค้นหาด้วยคำค้นอื่น หรือเปลี่ยนตัวกรอง</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QueueTab;