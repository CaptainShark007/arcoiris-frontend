// src/features/pos/components/products/PosCategoryTabs.tsx
import { usePosCategories } from '@features/admin/hooks/pos/usePosCategories';
import { Box, Tab, Tabs, Skeleton } from '@mui/material';

interface PosCategoryTabsProps {
  selected: string | null;
  onChange: (categoryId: string | null) => void;
}

export const PosCategoryTabs = ({ selected, onChange }: PosCategoryTabsProps) => {
  const { categories, isLoading } = usePosCategories();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={80} height={32} sx={{ borderRadius: 4 }} />
        ))}
      </Box>
    );
  }

  return (
    <Tabs
      value={selected ?? 'all'}
      onChange={(_, val) => onChange(val === 'all' ? null : val)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 36,
        '& .MuiTabs-flexContainer': {
          gap: 1,
        },
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTab-root': {
          minHeight: 32,
          borderRadius: 1,
          px: 2,
          py: 0.5,
          fontSize: '0.78rem',
          fontWeight: 600,
          textTransform: 'none',
          color: 'text.secondary',
          transition: 'all 150ms ease',
          border: '1px solid',
          borderColor: 'grey.300',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            borderColor: 'primary.main',
            color: 'white',
          },
        },
      }}
    >
      <Tab label="Todos" value="all" />
      {categories.map((cat) => (
        <Tab key={cat.id} label={cat.name} value={cat.id} />
      ))}
    </Tabs>
  );
};