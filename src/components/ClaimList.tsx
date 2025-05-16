
import React from 'react';
import ClaimCard from '@/components/ClaimCard';
import { Claim, ClaimStatus } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';

interface ClaimListProps {
  loading: boolean;
  filteredClaims: any[];
  selectedClaims: string[];
  handleClaimSelect: (id: string) => void;
  handleShare: (claimId: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setActiveTab: Dispatch<SetStateAction<ClaimStatus | 'all'>>;
  currentUser: any;
}

const ClaimList: React.FC<ClaimListProps> = ({
  loading,
  filteredClaims,
  selectedClaims,
  handleClaimSelect,
  handleShare,
  searchTerm,
  setSearchTerm,
  setActiveTab,
  currentUser
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (filteredClaims.length === 0) {
    return (
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
    );
  }

  return (
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
  );
};

export default ClaimList;
