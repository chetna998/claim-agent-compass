
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import IntroGuide from '@/components/IntroGuide';
import { SidebarProvider } from '@/components/ui/sidebar';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import ClaimStatsChart from '@/components/charts/ClaimStatsChart';
import { getClaimStatusCount, getRecentClaims } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const statusCount = getClaimStatusCount();
  const recentClaims = getRecentClaims(5);
  
  const totalClaims = Object.values(statusCount).reduce((sum, count) => sum + count, 0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 lg:py-8">
            <div id="dashboard-overview" className="flex flex-col md:flex-row justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {userProfile?.name || 'User'}!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => navigate('/claims')}>View All Claims</Button>
              </div>
            </div>

            <div id="claims-stats" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard 
                title="Total Claims"
                value={totalClaims}
                description="All claims in the system"
                icon={<FileText className="h-4 w-4" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard 
                title="Pending Claims"
                value={statusCount.pending}
                description="Claims awaiting initial review"
                icon={<FileText className="h-4 w-4" />}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard 
                title="In Review"
                value={statusCount.inReview}
                description="Claims currently being processed"
                icon={<FileText className="h-4 w-4" />}
                trend={{ value: 5, isPositive: false }}
              />
              <StatCard 
                title="Agents"
                value={4}
                description="Active agents in the system"
                icon={<Users className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <ClaimStatsChart />
              <Card>
                <CardHeader>
                  <CardTitle>Claims by Status</CardTitle>
                  <CardDescription>Distribution of all claims by their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FBC02D]" />
                        <StatusBadge status="pending" />
                      </dt>
                      <dd className="font-medium">{statusCount.pending}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#1E88E5]" />
                        <StatusBadge status="inReview" />
                      </dt>
                      <dd className="font-medium">{statusCount.inReview}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#43A047]" />
                        <StatusBadge status="approved" />
                      </dt>
                      <dd className="font-medium">{statusCount.approved}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#E53935]" />
                        <StatusBadge status="denied" />
                      </dt>
                      <dd className="font-medium">{statusCount.denied}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#757575]" />
                        <StatusBadge status="archived" />
                      </dt>
                      <dd className="font-medium">{statusCount.archived}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            <div id="recent-claims">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Claims</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Claim #</th>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Policy Holder</th>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Updated</th>
                      <th className="text-left py-3 px-4 bg-muted font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClaims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{claim.claimNumber}</td>
                        <td className="py-3 px-4">{claim.policyHolder}</td>
                        <td className="py-3 px-4">{formatCurrency(claim.amount)}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={claim.status} />
                        </td>
                        <td className="py-3 px-4">{formatDate(claim.dateUpdated)}</td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/claims/${claim.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <IntroGuide />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
