
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ClaimStatus } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define proper SupabaseClaim type that matches the database schema
export interface SupabaseClaim {
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

export const useClaims = () => {
  const { currentUser } = useAuth();
  const [claims, setClaims] = useState<SupabaseClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  return {
    claims,
    filteredClaims,
    loading,
    selectedClaims,
    setSelectedClaims,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    handleClaimSelect,
    handleBulkAction,
    fetchClaims
  };
};
