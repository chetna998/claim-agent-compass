
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
      // Use type assertion to work with the new table structure
      const { data, error } = await (supabase
        .from('shared_claims' as any)
        .select(`
          id,
          claim_id,
          shared_by,
          shared_with,
          created_at,
          claims:claim_id (*),
          profiles:shared_by (name)
        `)
        .eq('shared_with', currentUser.id)
        .order('created_at', { ascending: false }) as any);
      
      if (error) throw error;
      
      // Transform the data to match the expected structure
      const formattedData = data?.map((item: any) => ({
        id: item.id,
        claim_id: item.claim_id,
        shared_by: item.shared_by,
        shared_with: item.shared_with,
        created_at: item.created_at,
        claim: item.claims,
        shared_by_profile: {
          name: item.profiles?.name || 'Unknown'
        }
      })) || [];

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
