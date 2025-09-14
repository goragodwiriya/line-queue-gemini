import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import { QueueTab } from "@/components/dashboard/QueueTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "queue":
        return <QueueTab />;
      case "current":
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">หน้าแสดงคิวปัจจุบัน</h3>
            <p className="text-muted-foreground">แสดงคิวที่กำลังให้บริการและคิวถัดไป</p>
          </div>
        );
      case "schedule":
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">ตารางเวลาการให้บริการ</h3>
            <p className="text-muted-foreground">จัดการเวลาให้บริการและช่วงเวลาพิเศษ</p>
          </div>
        );
      case "chat":
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">จัดการแชทบอท LINE</h3>
            <p className="text-muted-foreground">ตั้งค่าข้อความอัตโนมัติและ Gemini AI</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">ตั้งค่าระบบ</h3>
            <p className="text-muted-foreground">กำหนดค่าการเชื่อมต่อ API และการแจ้งเตือน</p>
          </div>
        );
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
