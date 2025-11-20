import { TableCell } from '@mui/material';

interface Props {
  content: string;
}

export const CellTableProduct = ({ content }: Props) => {
  return (
    <TableCell sx={{ fontWeight: 500, letterSpacing: '-0.025em' }}>
      {content}
    </TableCell>
  );
};