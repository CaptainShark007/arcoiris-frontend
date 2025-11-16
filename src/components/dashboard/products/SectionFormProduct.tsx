import { Box, Typography, Paper } from "@mui/material";

interface SectionFormProductProps {
  title: string;
  children: React.ReactNode;
}

export const SectionFormProduct = ({
  title,
  children,
}: SectionFormProductProps) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box>{children}</Box>
    </Paper>
  );
};
