
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ClaimStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: ClaimStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ClaimStatus) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending', 
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        };
      case 'inReview':
        return { 
          label: 'In Review', 
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
        };
      case 'approved':
        return { 
          label: 'Approved', 
          className: 'bg-green-100 text-green-800 hover:bg-green-100'
        };
      case 'denied':
        return { 
          label: 'Denied', 
          className: 'bg-red-100 text-red-800 hover:bg-red-100'
        };
      case 'archived':
        return { 
          label: 'Archived', 
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
      default:
        return { 
          label: 'Unknown', 
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className} variant="outline">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
