
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AgentsList } from '@/features/admin';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'agent');

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 lg:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                <p className="text-muted-foreground">
                  Manage insurance claim agents
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Agent
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <AgentsList agents={agents} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Agents;
