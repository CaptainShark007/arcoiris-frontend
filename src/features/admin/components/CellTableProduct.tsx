import { TableCell } from '@mui/material';

interface Props {
  content: string;
  sx?: any;
}

export const CellTableProduct = ({ content, sx }: Props) => {
  return (
    <TableCell sx={{ fontWeight: 400, letterSpacing: '-0.025em', ...sx }}>
      {content}
    </TableCell>
  );
};