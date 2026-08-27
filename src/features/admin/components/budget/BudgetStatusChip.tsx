import { Chip } from '@mui/material';
import { BudgetStatus, BUDGET_STATUS_LABELS } from '@shared/types';

const STATUS_COLORS: Record<
  BudgetStatus,
  { bg: string; color: string; border: string }
> = {
  draft: {
    bg: 'rgba(100,116,139,0.12)',
    color: '#475569',
    border: 'rgba(100,116,139,0.3)',
  },
  sent: {
    bg: 'rgba(37,99,235,0.12)',
    color: '#1d4ed8',
    border: 'rgba(37,99,235,0.3)',
  },
  accepted: {
    bg: 'rgba(22,163,74,0.12)',
    color: '#15803d',
    border: 'rgba(22,163,74,0.3)',
  },
  rejected: {
    bg: 'rgba(220,38,38,0.12)',
    color: '#b91c1c',
    border: 'rgba(220,38,38,0.3)',
  },
  expired: {
    bg: 'rgba(202,138,4,0.12)',
    color: '#a16207',
    border: 'rgba(202,138,4,0.3)',
  },
  converted: {
    bg: 'rgba(124,58,237,0.12)',
    color: '#6d28d9',
    border: 'rgba(124,58,237,0.3)',
  },
};

interface BudgetStatusChipProps {
  status: BudgetStatus;
  size?: 'small' | 'medium';
}

export const BudgetStatusChip = ({ status, size = 'small' }: BudgetStatusChipProps) => {
  const palette = STATUS_COLORS[status];

  return (
    <Chip
      label={BUDGET_STATUS_LABELS[status]}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        backgroundColor: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    />
  );
};
