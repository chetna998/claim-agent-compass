
export type Agent = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'agent';
}

export type ClaimStatus = 'pending' | 'inReview' | 'approved' | 'denied' | 'archived';

export type Claim = {
  id: string;
  claimNumber: string;
  policyHolder: string;
  amount: number;
  status: ClaimStatus;
  dateSubmitted: string;
  dateUpdated: string;
  description: string;
  assignedTo: string;
  notes?: string;
  documents?: string[];
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'agent',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'agent',
  },
  {
    id: '4',
    name: 'Jessica Williams',
    email: 'jessica@example.com',
    role: 'agent',
  }
];

export const claims: Claim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2023-001',
    policyHolder: 'Robert Davis',
    amount: 1250.00,
    status: 'pending',
    dateSubmitted: '2023-10-15',
    dateUpdated: '2023-10-15',
    description: 'Water damage from roof leak',
    assignedTo: '1',
    notes: 'Waiting for assessment report',
  },
  {
    id: '2',
    claimNumber: 'CLM-2023-002',
    policyHolder: 'Emma Wilson',
    amount: 3500.00,
    status: 'inReview',
    dateSubmitted: '2023-10-10',
    dateUpdated: '2023-10-17',
    description: 'Car accident - front bumper damage',
    assignedTo: '2',
    notes: 'Repair estimate received, reviewing coverage',
  },
  {
    id: '3',
    claimNumber: 'CLM-2023-003',
    policyHolder: 'James Miller',
    amount: 750.00,
    status: 'approved',
    dateSubmitted: '2023-09-28',
    dateUpdated: '2023-10-14',
    description: 'Stolen laptop - business property',
    assignedTo: '1',
    notes: 'Proof of purchase verified, payment processed',
  },
  {
    id: '4',
    claimNumber: 'CLM-2023-004',
    policyHolder: 'Olivia Taylor',
    amount: 5000.00,
    status: 'denied',
    dateSubmitted: '2023-09-20',
    dateUpdated: '2023-10-12',
    description: 'Medical expense claim',
    assignedTo: '3',
    notes: 'Claim outside of policy coverage period',
  },
  {
    id: '5',
    claimNumber: 'CLM-2023-005',
    policyHolder: 'Noah Johnson',
    amount: 2200.00,
    status: 'archived',
    dateSubmitted: '2023-08-05',
    dateUpdated: '2023-09-10',
    description: 'Home theft - jewelry items',
    assignedTo: '2',
    notes: 'Claim paid - closed',
  },
  {
    id: '6',
    claimNumber: 'CLM-2023-006',
    policyHolder: 'Sophia Martinez',
    amount: 1800.00,
    status: 'pending',
    dateSubmitted: '2023-10-18',
    dateUpdated: '2023-10-18',
    description: 'Fence damage from storm',
    assignedTo: '4',
    notes: 'Initial assessment scheduled',
  },
  {
    id: '7',
    claimNumber: 'CLM-2023-007',
    policyHolder: 'Benjamin Anderson',
    amount: 3200.00,
    status: 'inReview',
    dateSubmitted: '2023-10-12',
    dateUpdated: '2023-10-16',
    description: 'Vehicle vandalism claim',
    assignedTo: '1',
    notes: 'Police report received, photos being reviewed',
  },
  {
    id: '8',
    claimNumber: 'CLM-2023-008',
    policyHolder: 'Isabella Thomas',
    amount: 950.00,
    status: 'approved',
    dateSubmitted: '2023-10-05',
    dateUpdated: '2023-10-17',
    description: 'Cracked smartphone screen',
    assignedTo: '3',
    notes: 'Repair authorized, receipt pending',
  }
];

export const getClaimStatusCount = () => {
  const statusCount = {
    pending: 0,
    inReview: 0,
    approved: 0,
    denied: 0,
    archived: 0
  };
  
  claims.forEach(claim => {
    statusCount[claim.status]++;
  });
  
  return statusCount;
};

export const getClaimsByAgent = (agentId: string) => {
  return claims.filter(claim => claim.assignedTo === agentId);
};

export const getRecentClaims = (limit: number = 5) => {
  return [...claims]
    .sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())
    .slice(0, limit);
};

export const getClaimById = (id: string) => {
  return claims.find(claim => claim.id === id);
};

export const getAgentById = (id: string) => {
  return agents.find(agent => agent.id === id);
};

export const getAgentByEmail = (email: string) => {
  return agents.find(agent => agent.email === email);
};

export const getMonthlyClaimsTrend = () => {
  // Sample data for a 6-month trend
  return [
    { name: 'May', pending: 12, inReview: 8, approved: 15, denied: 5 },
    { name: 'Jun', pending: 15, inReview: 10, approved: 12, denied: 6 },
    { name: 'Jul', pending: 18, inReview: 12, approved: 18, denied: 4 },
    { name: 'Aug', pending: 14, inReview: 15, approved: 21, denied: 7 },
    { name: 'Sep', pending: 16, inReview: 13, approved: 19, denied: 8 },
    { name: 'Oct', pending: 18, inReview: 11, approved: 17, denied: 6 },
  ];
};
