import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { AppCard, AppLayout } from '../ui';
import { GroupCard } from '../components/GroupCard';
import { GroupFilters } from '../components/GroupFilters';
import { GroupList } from '../components/GroupList';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/Button';
import { fetchGroups } from '../utils/groupApi';
import type { PublicGroup } from '../utils/groupApi';
import type { FilterState, SortOption } from '../components/GroupFilters';
import { ROUTES, buildRoute } from '../routing/constants';
import './BrowseGroupsPage.css';

const DEFAULT_FILTERS: FilterState = {
  status: 'all',
  minAmount: '',
  maxAmount: '',
  minMembers: '',
  maxMembers: '',
  sort: 'date-desc',
};

function applySortOption(groups: PublicGroup[], sort: SortOption): PublicGroup[] {
  const sorted = [...groups];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'name-asc':  return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'amount-asc':  return a.contributionAmount - b.contributionAmount;
      case 'amount-desc': return b.contributionAmount - a.contributionAmount;
      case 'members-asc':  return a.memberCount - b.memberCount;
      case 'members-desc': return b.memberCount - a.memberCount;
      case 'date-asc':  return a.createdAt.getTime() - b.createdAt.getTime();
      case 'date-desc': return b.createdAt.getTime() - a.createdAt.getTime();
      default: return 0;
    }
  });
  return sorted;
}

export default function BrowseGroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<PublicGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to load groups. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGroups();
  }, []);

  // Task 5: filteredGroups via useMemo
  const filteredGroups = useMemo(() => {
    let result = groups;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(g => g.status === filters.status);
    }

    if (filters.minAmount) {
      result = result.filter(g => g.contributionAmount >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(g => g.contributionAmount <= Number(filters.maxAmount));
    }
    if (filters.minMembers) {
      result = result.filter(g => g.memberCount >= Number(filters.minMembers));
    }
    if (filters.maxMembers) {
      result = result.filter(g => g.memberCount <= Number(filters.maxMembers));
    }

    return applySortOption(result, filters.sort);
  }, [groups, searchQuery, filters]);

  // Task 5: hasActiveFilters
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filters.status !== 'all' ||
    filters.minAmount !== '' ||
    filters.maxAmount !== '' ||
    filters.minMembers !== '' ||
    filters.maxMembers !== '';

  // Task 7: handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  const handleCreateGroup = () => navigate(ROUTES.GROUP_CREATE);

  return (
    <AppLayout
      title="Browse Groups"
      subtitle="Discover and join public savings groups"
      footerText="Stellar Save - Built for transparent, on-chain savings"
    >
      <AppCard>
        <Stack spacing={2}>
          {/* aria-live region for error/status announcements */}
          <div aria-live="polite" aria-atomic="true">
            {error && (
              <div className="browse-groups-error" role="alert">
                <p>{error}</p>
                <Button onClick={() => void loadGroups()}>Retry</Button>
              </div>
            )}
          </div>

          {!error && (
            <section aria-labelledby="browse-groups-heading">
              <Typography id="browse-groups-heading" variant="h2" sx={{ mb: 2 }}>
                Public Groups
              </Typography>

              {/* Task 6: SearchBar + GroupFilters */}
              <div className="browse-groups-controls">
                <SearchBar
                  placeholder="Search groups by name or keyword..."
                  onSearch={setSearchQuery}
                  debounceMs={300}
                  loading={loading}
                  aria-label="Search groups"
                />
                <GroupFilters
                  onFilterChange={setFilters}
                  initialFilters={DEFAULT_FILTERS}
                />
              </div>

              {/* Task 7: GroupList with GroupCard renderGroupItem */}
              <div aria-busy={loading}>
                <GroupList
                  groups={filteredGroups as any}
                  loading={loading}
                  showSearch={false}
                  showSort={false}
                  pageSize={12}
                  pageSizeOptions={[12, 24, 48]}
                  showPagination={filteredGroups.length > 12}
                  emptyTitle={hasActiveFilters ? 'No groups found' : 'No groups available'}
                  emptyDescription={
                    hasActiveFilters
                      ? 'Try adjusting your search or filters to find groups.'
                      : 'There are no public groups yet. Be the first to create one!'
                  }
                  emptyActionLabel={hasActiveFilters ? 'Clear Filters' : 'Create Group'}
                  onEmptyAction={hasActiveFilters ? handleClearFilters : handleCreateGroup}
                  renderGroupItem={(group) => (
                    <GroupCard
                      key={group.id}
                      groupId={group.id}
                      groupName={group.name}
                      memberCount={group.memberCount ?? 0}
                      contributionAmount={(group as any).contributionAmount ?? 0}
                      currency={(group as any).currency ?? 'XLM'}
                      status={(group as any).status ?? 'active'}
                      onViewDetails={() => navigate(buildRoute.groupDetail(group.id))}
                      onJoin={
                        (group as any).status === 'active' || (group as any).status === 'pending'
                          ? () => navigate(buildRoute.groupDetail(group.id))
                          : undefined
                      }
                    />
                  )}
                />
              </div>
            </section>
          )}
        </Stack>
      </AppCard>
    </AppLayout>
  );
}
