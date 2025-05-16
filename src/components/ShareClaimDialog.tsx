
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Claim, agents } from '@/data/mockData';
import { toast } from 'sonner';

interface ShareClaimDialogProps {
  claim: Claim | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShareClaimDialog: React.FC<ShareClaimDialogProps> = ({ claim, isOpen, onClose }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');

  const handleShare = () => {
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent);
    
    // In a real app, this would call an API
    toast.success(`Claim ${claim?.claimNumber} shared with ${agent?.name}`);
    onClose();
    setSelectedAgent('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Claim</DialogTitle>
          <DialogDescription>
            Share this claim with another agent for collaboration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="font-medium">Claim Details</div>
            <div className="text-sm">{claim?.claimNumber} - {claim?.policyHolder}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent">Select Agent</Label>
            <Select
              value={selectedAgent}
              onValueChange={setSelectedAgent}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents
                  .filter(agent => agent.id !== claim?.assignedTo)
                  .map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleShare}>Share Claim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareClaimDialog;
