import { TableCell, useMediaQuery, useTheme } from '@mui/material';

interface Props {
  content: string;
  sx?: any;
}

export const CellTableProduct = ({ content, sx }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TableCell 
      sx={{ 
        fontWeight: 400, 
        letterSpacing: '-0.025em', 
        fontSize: isMobile ? '0.8rem' : '0.875rem',
        py: isMobile ? 1 : 2,
        ...sx 
      }}
    >
      {content}
    </TableCell>
  );
};