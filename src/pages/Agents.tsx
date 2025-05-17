
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AgentsList } from '@/features/admin';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Agents = () => {
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
              <AgentsList />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Agents;
