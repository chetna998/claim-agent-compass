
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import ShareClaimDialog from '@/components/ShareClaimDialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Claim } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import ClaimSearch from '@/components/ClaimSearch';
import ClaimStatusTabs from '@/components/ClaimStatusTabs';
import ClaimList from '@/components/ClaimList';
import ClaimActions from '@/components/ClaimActions';
import { useClaims } from '@/hooks/useClaims';
import { useSharedClaims } from '@/hooks/useSharedClaims';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Claims = () => {
  const { currentUser, userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [claimToShare, setClaimToShare] = useState<Claim | null>(null);
  const [viewMode, setViewMode] = useState<'my-claims' | 'shared-claims'>('my-claims');
  
  const {
    filteredClaims,
    loading,
    selectedClaims,
    setSelectedClaims,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    handleClaimSelect,
    handleBulkAction
  } = useClaims();

  const { sharedClaims, loading: loadingShared } = useSharedClaims();

  const handleShare = (claimId: string) => {
    const claim = filteredClaims.find(c => c.id === claimId);
    if (claim) {
      // Convert Supabase claim to the format expected by ShareClaimDialog
      setClaimToShare({
        id: claim.id,
        claimNumber: claim.policy_number,
        policyHolder: claim.claimant_name,
        amount: claim.amount || 0,
        description: claim.description || '',
        status: claim.status,
        dateSubmitted: claim.created_at,
        dateUpdated: claim.updated_at,
        assignedTo: currentUser?.id || '',
        documents: []
      });
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
              
              {viewMode === 'my-claims' && (
                <ClaimActions 
                  selectedClaims={selectedClaims} 
                  handleBulkAction={handleBulkAction}
                  setSelectedClaims={setSelectedClaims}
                  isAdmin={isAdmin}
                />
              )}
            </div>

            {/* Toggle between my claims and shared claims */}
            {!isAdmin && (
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'my-claims' | 'shared-claims')} className="mb-6">
                <TabsList>
                  <TabsTrigger value="my-claims">My Claims</TabsTrigger>
                  <TabsTrigger value="shared-claims">Shared With Me ({sharedClaims.length})</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {viewMode === 'my-claims' && (
              <>
                <div className="mb-6">
                  <ClaimSearch 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>

                <ClaimStatusTabs 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  <p className="text-muted-foreground mb-2">
                    {filteredClaims.length} claims • {selectedClaims.length} selected
                  </p>
                  <div className="mt-0">
                    <ClaimList
                      loading={loading}
                      filteredClaims={filteredClaims}
                      selectedClaims={selectedClaims}
                      handleClaimSelect={handleClaimSelect}
                      handleShare={handleShare}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      setActiveTab={setActiveTab}
                      currentUser={currentUser}
                    />
                  </div>
                </ClaimStatusTabs>
              </>
            )}

            {viewMode === 'shared-claims' && (
              <Card>
                <CardHeader>
                  <CardTitle>Claims Shared With Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingShared ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 bg-muted rounded-md animate-pulse"></div>
                      ))}
                    </div>
                  ) : sharedClaims.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No claims have been shared with you yet
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sharedClaims.map((sharedClaim) => (
                        <ClaimCard 
                          key={sharedClaim.id}
                          claim={{
                            id: sharedClaim.claim.id,
                            claimNumber: sharedClaim.claim.policy_number,
                            policyHolder: sharedClaim.claim.claimant_name,
                            amount: sharedClaim.claim.amount || 0,
                            description: sharedClaim.claim.description || '',
                            status: sharedClaim.claim.status,
                            dateSubmitted: sharedClaim.claim.created_at,
                            dateUpdated: sharedClaim.claim.updated_at,
                            assignedTo: sharedClaim.claim.user_id,
                            documents: []
                          }}
                          sharedBy={sharedClaim.shared_by_profile?.name}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
