
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClaimStatus } from '@/data/mockData';

interface ClaimActionsProps {
  selectedClaims: string[];
  handleBulkAction: (status: ClaimStatus) => void;
  setSelectedClaims: React.Dispatch<React.SetStateAction<string[]>>;
  isAdmin: boolean;
}

const ClaimActions: React.FC<ClaimActionsProps> = ({ 
  selectedClaims, 
  handleBulkAction, 
  setSelectedClaims,
  isAdmin
}) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default ClaimActions;
