import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QueueItem {
  id: string;
  number: number;
  name: string;
  phone?: string;
  service: string;
  status: 'waiting' | 'called' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedTime?: string;
}

export const useQueues = () => {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQueues = async () => {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select(`
          id,
          number,
          status,
          estimated_time,
          created_at,
          customers (
            name,
            phone
          ),
          services (
            name
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedQueues: QueueItem[] = data?.map((queue: any) => ({
        id: queue.id,
        number: queue.number,
        name: queue.customers?.name || 'ไม่ระบุ',
        phone: queue.customers?.phone,
        service: queue.services?.name || 'ทั่วไป',
        status: queue.status,
        createdAt: queue.created_at,
        estimatedTime: queue.estimated_time,
      })) || [];

      setQueues(formattedQueues);
    } catch (error) {
      console.error('Error fetching queues:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลคิวได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (id: string, status: 'called' | 'completed' | 'cancelled') => {
    try {
      const updateData: any = { status };
      
      if (status === 'called') {
        updateData.called_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('queues')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchQueues();

      const statusText = {
        called: 'เรียกคิว',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      };

      toast({
        title: "อัปเดตสำเร็จ",
        description: `${statusText[status]}แล้ว`,
      });
    } catch (error) {
      console.error('Error updating queue:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะคิวได้",
        variant: "destructive",
      });
    }
  };

  const createQueue = async (customerName: string, phone: string, serviceId: string) => {
    try {
      // First create or find customer
      let customerId: string;
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ name: customerName, phone })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Generate queue number
      const { data: queueNumber, error: numberError } = await supabase
        .rpc('generate_queue_number');

      if (numberError) throw numberError;

      // Create queue
      const { error: queueError } = await supabase
        .from('queues')
        .insert({
          number: queueNumber,
          customer_id: customerId,
          service_id: serviceId,
          status: 'waiting'
        });

      if (queueError) throw queueError;

      await fetchQueues();

      toast({
        title: "สร้างคิวสำเร็จ",
        description: `คิวหมายเลข ${queueNumber}`,
      });

      return queueNumber;
    } catch (error) {
      console.error('Error creating queue:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างคิวได้",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchQueues();

    // Set up real-time subscription
    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues'
        },
        () => {
          fetchQueues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    queues,
    loading,
    updateQueueStatus,
    createQueue,
    refetch: fetchQueues
  };
};