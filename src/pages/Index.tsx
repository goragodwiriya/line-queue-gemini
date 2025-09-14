import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { DashboardTab } from "@/components/dashboard/DashboardTab";
import QueueTab from "@/components/dashboard/QueueTab";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              ยินดีต้อนรับ, {user?.email}
            </h1>
            <Button variant="outline" onClick={signOut}>
              ออกจากระบบ
            </Button>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
