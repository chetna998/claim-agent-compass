
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export interface SharedClaim {
  id: string;
  claim_id: string;
  shared_by: string;
  shared_with: string;
  created_at: string;
  claim: any;
  shared_by_profile: {
    name: string;
  };
}

export const useSharedClaims = () => {
  const { currentUser } = useAuth();
  const [sharedClaims, setSharedClaims] = useState<SharedClaim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchSharedClaims();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('shared-claims')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'shared_claims',
          filter: `shared_with=eq.${currentUser.id}`
        }, (payload) => {
          // When a new claim is shared with current user
          toast.success('A new claim has been shared with you!');
          fetchSharedClaims();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser]);

  const fetchSharedClaims = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // First, get the shared claims
      const { data: sharedClaimsData, error: sharedClaimsError } = await (supabase
        .from('shared_claims' as any)
        .select('*')
        .eq('shared_with', currentUser.id)
        .order('created_at', { ascending: false }) as any);
      
      if (sharedClaimsError) throw sharedClaimsError;
      
      // Now get the claims data for each shared claim
      const formattedData: SharedClaim[] = [];
      
      for (const sharedClaim of sharedClaimsData || []) {
        // Get the claim details
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*')
          .eq('id', sharedClaim.claim_id)
          .single();
        
        if (claimError) {
          console.error('Error fetching claim:', claimError);
          continue;
        }
        
        // Get the user profile for shared_by
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', sharedClaim.shared_by)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        formattedData.push({
          id: sharedClaim.id,
          claim_id: sharedClaim.claim_id,
          shared_by: sharedClaim.shared_by,
          shared_with: sharedClaim.shared_with,
          created_at: sharedClaim.created_at,
          claim: claimData,
          shared_by_profile: {
            name: profileData?.name || 'Unknown'
          }
        });
      }

      setSharedClaims(formattedData);
    } catch (error) {
      console.error('Error fetching shared claims:', error);
      toast.error('Failed to load shared claims');
      setSharedClaims([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    sharedClaims,
    loading,
    refetch: fetchSharedClaims
  };
};
