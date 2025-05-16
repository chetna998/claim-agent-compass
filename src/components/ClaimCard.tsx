
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Claim } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

interface ClaimCardProps {
  claim: Claim;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onShare?: (id: string) => void;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ 
  claim, 
  isSelected = false, 
  onSelect,
  onShare
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-primary border-2' : 'hover:border-gray-300'
      }`}
      onClick={() => onSelect && onSelect(claim.id)}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium">{claim.claimNumber}</div>
          <StatusBadge status={claim.status} />
        </div>
        <div className="text-sm text-muted-foreground mb-1">
          Policy Holder: {claim.policyHolder}
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          Amount: {formatCurrency(claim.amount)}
        </div>
        <div className="text-sm line-clamp-2 mb-2 h-10">
          {claim.description}
        </div>
        <div className="text-xs text-muted-foreground flex justify-between items-center">
          <span>Incident Date: {new Date(claim.dateSubmitted).toLocaleDateString()}</span>
          <span>Updated: {new Date(claim.dateUpdated).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-3 pb-3">
        <Button 
          size="sm" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/claims/${claim.id}`);
          }}
        >
          View Details
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={(e) => {
            e.stopPropagation();
            if (onShare) {
              onShare(claim.id);
            } else {
              navigate(`/claims/${claim.id}`);
            }
          }}
        >
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClaimCard;
