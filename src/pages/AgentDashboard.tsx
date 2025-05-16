
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClaimStatus } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface ClaimStats {
  pending: number;
  inReview: number;
  approved: number;
  denied: number;
  archived: number;
  total: number;
}

const AgentDashboard = () => {
  const { currentUser } = useAuth();
  const [claimStats, setClaimStats] = useState<ClaimStats>({
    pending: 0,
    inReview: 0,
    approved: 0,
    denied: 0,
    archived: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchClaimStats();
    }
  }, [currentUser]);

  const fetchClaimStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('status');

      if (error) throw error;

      if (data) {
        const stats = data.reduce((acc: ClaimStats, claim) => {
          const status = claim.status as ClaimStatus;
          acc[status] = (acc[status] || 0) + 1;
          acc.total++;
          return acc;
        }, {
          pending: 0,
          inReview: 0,
          approved: 0,
          denied: 0,
          archived: 0,
          total: 0
        });

        setClaimStats(stats);
      }
    } catch (error) {
      console.error('Error fetching claim stats:', error);
      toast.error('Failed to load claim statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Claims', value: claimStats.total, color: 'bg-blue-100 text-blue-800' },
    { title: 'Pending', value: claimStats.pending, color: 'bg-yellow-100 text-yellow-800' },
    { title: 'In Review', value: claimStats.inReview, color: 'bg-orange-100 text-orange-800' },
    { title: 'Approved', value: claimStats.approved, color: 'bg-green-100 text-green-800' },
    { title: 'Denied', value: claimStats.denied, color: 'bg-red-100 text-red-800' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 lg:py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
                <p className="text-muted-foreground">
                  View and manage claim requests
                </p>
              </div>
              <Button onClick={() => navigate('/claims')}>View All Claims</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-8">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <Card key={i} className="h-32 animate-pulse bg-muted">
                    <CardContent className="p-0"></CardContent>
                  </Card>
                ))
              ) : (
                statCards.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${stat.color} inline-block px-2 py-1 rounded-md`}>
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {loading ? 'Loading activity...' : 'No recent activity to display'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={() => navigate('/claims?tab=pending')}
                  >
                    Review Pending Claims
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/claims?tab=inReview')}
                  >
                    Continue In-Review Claims
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/search')}
                  >
                    Search Claims
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgentDashboard;
