import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useQueues } from '@/hooks/useQueues';

export const AddQueueDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  const { services } = useServices();
  const { createQueue } = useQueues();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !phone || !selectedServiceId) return;
    
    setLoading(true);
    try {
      await createQueue(customerName, phone, selectedServiceId);
      setOpen(false);
      setCustomerName('');
      setPhone('');
      setSelectedServiceId('');
    } catch (error) {
      console.error('Failed to create queue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มคิว
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มคิวใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลลูกค้าเพื่อสร้างคิวใหม่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อลูกค้า</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="กรอกชื่อลูกค้า"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081-234-5678"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">ประเภทบริการ</Label>
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId} required>
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทบริการ" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.estimatedDuration} นาที)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              สร้างคิว
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};