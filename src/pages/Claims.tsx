import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import ClaimCard from '@/components/ClaimCard';
import ShareClaimDialog from '@/components/ShareClaimDialog';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Claim, ClaimStatus } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

// Define proper SupabaseClaim type that matches the database schema
interface SupabaseClaim {
  id: string;
  claimant_name: string;
  claimant_email: string | null;
  claimant_phone: string | null;
  policy_number: string;
  amount: number | null;
  description: string | null;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
  incident_date: string | null;
}

const Claims = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [claimToShare, setClaimToShare] = useState<Claim | null>(null);
  const [claims, setClaims] = useState<SupabaseClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    if (currentUser) {
      fetchClaims();
    }
  }, [currentUser]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      // Ensure the status is cast to ClaimStatus type
      const typedClaims = data?.map(claim => ({
        ...claim,
        status: claim.status as ClaimStatus
      })) || [];
      
      setClaims(typedClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims
    .filter(claim => activeTab === 'all' || claim.status === activeTab)
    .filter(claim => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        claim.claimant_name?.toLowerCase().includes(searchLower) ||
        claim.policy_number?.toLowerCase().includes(searchLower) ||
        claim.description?.toLowerCase().includes(searchLower)
      );
    });

  const handleClaimSelect = (id: string) => {
    setSelectedClaims(prev => 
      prev.includes(id) 
        ? prev.filter(claimId => claimId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkAction = async (newStatus: ClaimStatus) => {
    if (selectedClaims.length === 0) {
      toast.error('Please select at least one claim');
      return;
    }

    try {
      // Update claims in batches
      for (const claimId of selectedClaims) {
        const { error } = await supabase
          .from('claims')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', claimId);
        
        if (error) throw error;
      }

      toast.success(`Updated ${selectedClaims.length} claims to ${newStatus}`);
      setSelectedClaims([]);
      fetchClaims(); // Refresh claims data
    } catch (error) {
      console.error('Error updating claims:', error);
      toast.error('Failed to update claims');
    }
  };

  const handleShare = (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
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
              <div className="flex flex-wrap gap-2">
                {selectedClaims.length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleBulkAction('approved')}
                    >
                      Approve Selected
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleBulkAction('denied')}
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
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/new-claim')}
                  >
                    New Claim
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 max-w-md mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    className="pl-9"
                    placeholder="Search claims by name, policy, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </Button>
                )}
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
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 bg-muted rounded-md animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredClaims.map(claim => (
                        <ClaimCard 
                          key={claim.id}
                          claim={{
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
                          }}
                          isSelected={selectedClaims.includes(claim.id)}
                          onSelect={handleClaimSelect}
                          onShare={handleShare}
                        />
                      ))}
                    </div>
                  )}
                  {!loading && filteredClaims.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        {searchTerm ? 'No claims match your search' : 'No claims found'}
                      </p>
                      {searchTerm ? (
                        <Button 
                          variant="outline"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={() => setActiveTab('all')}
                        >
                          View All Claims
                        </Button>
                      )}
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
