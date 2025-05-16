
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimStatus } from '@/data/mockData';

interface ClaimStatusTabsProps {
  activeTab: ClaimStatus | 'all';
  setActiveTab: (tab: ClaimStatus | 'all') => void;
  children: React.ReactNode;
}

const ClaimStatusTabs: React.FC<ClaimStatusTabsProps> = ({ 
  activeTab, 
  setActiveTab,
  children 
}) => {
  return (
    <Tabs 
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
        {children}
      </div>
    </Tabs>
  );
};

export default ClaimStatusTabs;
