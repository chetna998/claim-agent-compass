
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
      subscribeToSharedClaims();
    }
    
    return () => {
      supabase.removeChannel('shared-claims');
    };
  }, [currentUser]);

  const fetchSharedClaims = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_claims')
        .select(`
          id, claim_id, shared_by, shared_with, created_at,
          claim:claims(*),
          shared_by_profile:profiles!shared_claims_shared_by_fkey(name)
        `)
        .eq('shared_with', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSharedClaims(data || []);
    } catch (error) {
      console.error('Error fetching shared claims:', error);
      toast.error('Failed to load shared claims');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToSharedClaims = () => {
    if (!currentUser) return;
    
    // Enable realtime for shared_claims table
    const channel = supabase
      .channel('shared-claims')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shared_claims',
          filter: `shared_with=eq.${currentUser.id}`
        },
        (payload) => {
          // When a new claim is shared with current user
          toast.success('A new claim has been shared with you!');
          fetchSharedClaims();
        }
      )
      .subscribe();
  };

  return {
    sharedClaims,
    loading,
    refetch: fetchSharedClaims
  };
};
