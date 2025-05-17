
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import ShareClaimDialog from '@/components/ShareClaimDialog';
import StatusBadge from '@/components/StatusBadge';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClaimStatus, getAgentById } from '@/data/mockData';
import { ArrowLeft, Share2, FileText, Calendar, User, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const ClaimDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const isAgent = userProfile?.role === 'agent';
  
  useEffect(() => {
    if (id) {
      fetchClaimDetails(id);
    }
  }, [id]);

  const fetchClaimDetails = async (claimId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (error) throw error;
      setClaim(data);
    } catch (error) {
      console.error('Error fetching claim details:', error);
      toast.error('Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned agent details
  const [assignedAgent, setAssignedAgent] = useState<any>(null);
  
  useEffect(() => {
    if (claim?.user_id) {
      fetchAgentDetails(claim.user_id);
    }
  }, [claim?.user_id]);

  const fetchAgentDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setAssignedAgent(data);
    } catch (error) {
      console.error('Error fetching agent details:', error);
    }
  };

  const handleStatusChange = async (newStatus: ClaimStatus) => {
    if (!claim) return;
    
    try {
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', claim.id);
      
      if (error) throw error;
      
      // Update local state
      setClaim({
        ...claim,
        status: newStatus,
        updated_at: new Date().toISOString()
      });
      
      toast.success(`Claim status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast.error('Failed to update claim status');
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main className="flex-1 bg-background">
            <div className="container py-6 lg:py-8">
              <div className="h-screen flex items-center justify-center">
                <p>Loading claim details...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!claim) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Claim Not Found</h2>
          <p className="text-muted-foreground mb-4">The claim you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/claims')}>Back to Claims</Button>
        </div>
      </div>
    );
  }

  // Transform Supabase claim data to the format expected by the UI
  const formattedClaim = {
    id: claim.id,
    claimNumber: claim.policy_number,
    policyHolder: claim.claimant_name,
    amount: claim.amount || 0,
    description: claim.description || '',
    status: claim.status as ClaimStatus,
    dateSubmitted: claim.created_at,
    dateUpdated: claim.updated_at,
    assignedTo: claim.user_id,
    documents: []
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 lg:py-8">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" size="icon" onClick={() => navigate('/claims')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Claim Details</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{formattedClaim.claimNumber}</CardTitle>
                      <CardDescription>Submitted on {formatDate(formattedClaim.dateSubmitted)}</CardDescription>
                    </div>
                    <StatusBadge status={formattedClaim.status} />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Policy Holder</p>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{formattedClaim.policyHolder}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Claim Amount</p>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{formatCurrency(formattedClaim.amount)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Assigned To</p>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{assignedAgent?.name || 'Loading...'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="font-medium">{formatDate(formattedClaim.dateUpdated)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{formattedClaim.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {isAgent && (
                      <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Claim
                      </Button>
                    )}
                    <Button>Update Claim</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Claim Actions</CardTitle>
                    <CardDescription>Update the status of this claim</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={formattedClaim.status === 'approved' ? 'default' : 'outline'} 
                          onClick={() => handleStatusChange('approved')}
                          className="w-full"
                        >
                          Approve Claim
                        </Button>
                        <Button 
                          variant={formattedClaim.status === 'denied' ? 'default' : 'outline'} 
                          onClick={() => handleStatusChange('denied')}
                          className="w-full"
                        >
                          Deny Claim
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={formattedClaim.status === 'inReview' ? 'default' : 'outline'} 
                          onClick={() => handleStatusChange('inReview')}
                          className="w-full"
                        >
                          Mark as In Review
                        </Button>
                        <Button 
                          variant={formattedClaim.status === 'archived' ? 'default' : 'outline'} 
                          onClick={() => handleStatusChange('archived')}
                          className="w-full"
                        >
                          Archive Claim
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-80">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Files related to this claim</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-6">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No documents attached</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Upload Document
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <ShareClaimDialog 
          claim={formattedClaim}
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default ClaimDetails;
