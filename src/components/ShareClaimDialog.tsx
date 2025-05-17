
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Claim } from '@/data/mockData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareClaimDialogProps {
  claim: Claim | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShareClaimDialog: React.FC<ShareClaimDialogProps> = ({ claim, isOpen, onClose }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available agents
  useEffect(() => {
    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('role', 'agent');
      
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedAgent || !claim) {
      toast.error('Please select an agent');
      return;
    }

    try {
      // Instead of using RPC, directly insert into shared_claims table
      const { error } = await supabase
        .from('shared_claims')
        .insert({
          claim_id: claim.id,
          shared_by: claim.assignedTo,
          shared_with: selectedAgent
        });
      
      if (error) {
        console.error('Error sharing claim:', error);
        
        if (error.message?.includes('duplicate key value violates unique constraint')) {
          toast.error('This claim has already been shared with this agent');
        } else {
          toast.error('Failed to share claim');
        }
        return;
      }
      
      // Find agent info
      const agent = agents.find(a => a.id === selectedAgent);
      
      toast.success(`Claim ${claim.claimNumber} shared with ${agent?.name}`);
      onClose();
      setSelectedAgent('');
    } catch (error: any) {
      console.error('Error sharing claim:', error);
      
      if (error.message?.includes('duplicate key value violates unique constraint')) {
        toast.error('This claim has already been shared with this agent');
      } else {
        toast.error('Failed to share claim');
      }
    }
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
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading agents..." : "Select an agent"} />
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
          <Button onClick={handleShare} disabled={loading || !selectedAgent}>Share Claim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareClaimDialog;
