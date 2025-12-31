import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
}

export const SectionHeader = ({ title, linkTo = "/tienda" }: SectionHeaderProps) => {
  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      mb={3}
      sx={{ marginLeft: { xs: 2, md: 5 }, marginRight: { xs: 2, md: 5 } }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }} // Empieza invisible y a la izquierda
        whileInView={{ opacity: 1, x: 0 }} // Al hacer scroll: visible y en su lugar
        viewport={{ once: true, margin: "-100px" }} // Se anima una sola vez
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {title}
        </Typography>
      </motion.div>

      <Button
        component={RouterLink}
        to={linkTo}
        endIcon={<ArrowForwardIcon />}
        variant="text"
        color="primary"
        sx={{ fontWeight: 'bold' }}
      >
        Ver todos
      </Button>
    </Box>
  );
};