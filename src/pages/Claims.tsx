
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import ClaimCard from '@/components/ClaimCard';
import ShareClaimDialog from '@/components/ShareClaimDialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { claims, Claim, ClaimStatus, getClaimById } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Claims = () => {
  const navigate = useNavigate();
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [claimToShare, setClaimToShare] = useState<Claim | null>(null);

  const filteredClaims = activeTab === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === activeTab);

  const handleClaimSelect = (id: string) => {
    setSelectedClaims(prev => 
      prev.includes(id) 
        ? prev.filter(claimId => claimId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedClaims.length === 0) {
      toast.error('Please select at least one claim');
      return;
    }

    // In a real app, this would call an API
    toast.success(`${action} ${selectedClaims.length} claims`);
    setSelectedClaims([]);
  };

  const handleShare = (claimId: string) => {
    const claim = getClaimById(claimId);
    if (claim) {
      setClaimToShare(claim);
      setShareDialogOpen(true);
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
                <h1 className="text-3xl font-bold tracking-tight">Claims</h1>
                <p className="text-muted-foreground">
                  Manage and process insurance claims
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedClaims.length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleBulkAction('Approved')}
                    >
                      Approve Selected
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleBulkAction('Rejected')}
                    >
                      Reject Selected
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedClaims([])}
                    >
                      Clear Selection
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => navigate('/new-claim')}
                >
                  New Claim
                </Button>
              </div>
            </div>

            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ClaimStatus | 'all')}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="all">All Claims</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inReview">In Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="denied">Denied</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <p className="text-muted-foreground mb-2">
                  {filteredClaims.length} claims • {selectedClaims.length} selected
                </p>
                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClaims.map(claim => (
                      <ClaimCard 
                        key={claim.id}
                        claim={claim}
                        isSelected={selectedClaims.includes(claim.id)}
                        onSelect={handleClaimSelect}
                      />
                    ))}
                  </div>
                  {filteredClaims.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No claims found</p>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab('all')}
                      >
                        View All Claims
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
        <ShareClaimDialog 
          claim={claimToShare}
          isOpen={shareDialogOpen}
          onClose={() => {
            setShareDialogOpen(false);
            setClaimToShare(null);
          }}
        />
      </div>
    </SidebarProvider>
  );
};

export default Claims;
