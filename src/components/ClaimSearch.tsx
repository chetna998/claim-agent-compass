
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ClaimSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClaimSearch: React.FC<ClaimSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center gap-2 max-w-md mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-9"
          placeholder="Search claims by name, policy, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSearchTerm('')}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default ClaimSearch;
