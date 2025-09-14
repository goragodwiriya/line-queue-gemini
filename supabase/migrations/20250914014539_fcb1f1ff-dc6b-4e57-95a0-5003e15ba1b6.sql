-- Create enum for queue status
CREATE TYPE public.queue_status AS ENUM ('waiting', 'called', 'completed', 'cancelled');

-- Create enum for service types
CREATE TYPE public.service_type AS ENUM ('general', 'consultation', 'treatment', 'emergency');

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type service_type NOT NULL DEFAULT 'general',
  estimated_duration INTEGER DEFAULT 30, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  line_user_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create queues table
CREATE TABLE public.queues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status queue_status NOT NULL DEFAULT 'waiting',
  estimated_time TIMESTAMP WITH TIME ZONE,
  called_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table for system configuration
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for services
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can manage services" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for customers
CREATE POLICY "Customers are viewable by authenticated users" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated users can manage customers" ON public.customers FOR ALL TO authenticated USING (true);

-- Create policies for queues
CREATE POLICY "Queues are viewable by authenticated users" ON public.queues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated users can manage queues" ON public.queues FOR ALL TO authenticated USING (true);

-- Create policies for settings
CREATE POLICY "Settings are viewable by authenticated users" ON public.settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only authenticated users can manage settings" ON public.settings FOR ALL TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON public.queues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate queue numbers
CREATE OR REPLACE FUNCTION public.generate_queue_number()
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(number), 0) + 1 INTO next_number
  FROM public.queues
  WHERE DATE(created_at) = CURRENT_DATE;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create indexes for better performance
CREATE INDEX idx_queues_status ON public.queues(status);
CREATE INDEX idx_queues_created_at ON public.queues(created_at);
CREATE INDEX idx_queues_customer_id ON public.queues(customer_id);
CREATE INDEX idx_customers_line_user_id ON public.customers(line_user_id);

-- Insert sample services
INSERT INTO public.services (name, type, estimated_duration) VALUES
('ทั่วไป', 'general', 15),
('ปรึกษา', 'consultation', 30),
('รักษา', 'treatment', 45),
('ฉุกเฉิน', 'emergency', 10);

-- Insert sample settings
INSERT INTO public.settings (key, value, description) VALUES
('line_channel_access_token', '""', 'LINE Channel Access Token'),
('line_channel_secret', '""', 'LINE Channel Secret'),
('gemini_api_key', '""', 'Google Gemini API Key'),
('queue_auto_advance', 'true', 'Auto advance queue when completed'),
('notification_enabled', 'true', 'Enable LINE notifications');

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.queues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;