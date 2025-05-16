
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClaimStatus } from '@/data/mockData';
import { toast } from 'sonner';

const NewClaim = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: '',
    claimantName: '',
    claimantEmail: '',
    claimantPhone: '',
    incidentDate: '',
    description: '',
    amount: '',
    status: 'pending' as ClaimStatus
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('claims').insert({
        user_id: currentUser.id,
        policy_number: formData.policyNumber,
        claimant_name: formData.claimantName,
        claimant_email: formData.claimantEmail,
        claimant_phone: formData.claimantPhone,
        incident_date: formData.incidentDate ? new Date(formData.incidentDate).toISOString() : null,
        description: formData.description,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        status: formData.status
      });

      if (error) {
        throw error;
      }

      toast.success('Claim created successfully');
      navigate('/claims');
    } catch (error: any) {
      toast.error('Failed to create claim: ' + (error.message || 'Unknown error'));
      console.error('Error creating claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-background">
          <div className="container py-6 lg:py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Claim</h1>
                <p className="text-muted-foreground">
                  Create a new insurance claim
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/claims')}
              >
                Cancel
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      name="policyNumber"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claimantName">Claimant Name</Label>
                    <Input
                      id="claimantName"
                      name="claimantName"
                      value={formData.claimantName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claimantEmail">Claimant Email</Label>
                    <Input
                      id="claimantEmail"
                      name="claimantEmail"
                      type="email"
                      value={formData.claimantEmail}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claimantPhone">Claimant Phone</Label>
                    <Input
                      id="claimantPhone"
                      name="claimantPhone"
                      value={formData.claimantPhone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">Incident Date</Label>
                    <Input
                      id="incidentDate"
                      name="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Claim Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={handleSelectChange('status')}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inReview">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Claim...' : 'Create Claim'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NewClaim;
