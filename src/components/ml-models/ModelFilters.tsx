import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  X, 
  SortAsc, 
  SortDesc,
  Calendar,
  BarChart3
} from 'lucide-react';
import { ModelType, ModelStatus } from '@/types/mlModels';

interface ModelFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypes: ModelType[];
  onTypesChange: (types: ModelType[]) => void;
  selectedStatuses: ModelStatus[];
  onStatusesChange: (statuses: ModelStatus[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

const modelTypes: ModelType[] = [
  'Regression',
  'Classification', 
  'Time Series',
  'Unsupervised',
  'Deep Learning',
  'NLP',
  'Computer Vision'
];

const modelStatuses: ModelStatus[] = [
  'Active',
  'Training',
  'Paused',
  'Failed',
  'Deployed',
  'Retired'
];

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'accuracy', label: 'Accuracy' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'lastTrained', label: 'Last Trained' },
  { value: 'trainingDataSize', label: 'Data Size' },
];

export const ModelFilters = ({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  selectedStatuses,
  onStatusesChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
}: ModelFiltersProps) => {
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const handleTypeToggle = (type: ModelType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleStatusToggle = (status: ModelStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const hasActiveFilters = 
    searchQuery.length > 0 || 
    selectedTypes.length > 0 || 
    selectedStatuses.length > 0;

  const getTypeColor = (type: ModelType) => {
    switch (type) {
      case 'Regression': return 'bg-primary/20 text-primary border-primary/30';
      case 'Classification': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Time Series': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      case 'Unsupervised': return 'bg-chart-4/20 text-chart-4 border-chart-4/30';
      case 'Deep Learning': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'NLP': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Computer Vision': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusColor = (status: ModelStatus) => {
    switch (status) {
      case 'Active': return 'bg-success/20 text-success border-success/30';
      case 'Training': return 'bg-warning/20 text-warning border-warning/30';
      case 'Paused': return 'bg-muted/20 text-muted-foreground border-muted/30';
      case 'Deployed': return 'bg-primary/20 text-primary border-primary/30';
      case 'Failed': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Retired': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Main Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Popover open={isTypeFilterOpen} onOpenChange={setIsTypeFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Types
                {selectedTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <h4 className="font-medium">Filter by Type</h4>
                <div className="space-y-2">
                  {modelTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Badge variant="outline" className={getTypeColor(type)}>
                          {type}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isStatusFilterOpen} onOpenChange={setIsStatusFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Status
                {selectedStatuses.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedStatuses.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <h4 className="font-medium">Filter by Status</h4>
                <div className="space-y-2">
                  {modelStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => handleStatusToggle(status)}
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Badge variant="outline" className={getStatusColor(status)}>
                          {status}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20"
              onClick={() => handleTypeToggle(type)}
            >
              {type}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20"
              onClick={() => handleStatusToggle(status)}
            >
              {status}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
