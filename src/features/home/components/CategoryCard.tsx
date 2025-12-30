import React from 'react';
import { Box, Typography, CardActionArea } from '@mui/material';
import { Category } from '@shared/types';
import { useNavigate } from 'react-router';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/tienda?categoryId=${category.id}`);
  };

  return (
    <Box
      onClick={handleCategoryClick}
      sx={{
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.08)',
          transition: 'transform 0.2s ease-in-out',
        },
        p: 0.5,
      }}
    >
      <CardActionArea
        sx={{
          '&:hover': { backgroundColor: 'transparent' },
          '&.MuiCardActionArea-root:hover .MuiCardActionArea-focusHighlight': {
            opacity: 0,
          },
        }}
      >
        <Box
          component='img'
          src={
            category.image ??
            'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
          }
          alt={category.name}
          sx={{
            width: '100%',
            height: 140,
            objectFit: 'contain',
          }}
        />
        <Box
          sx={{
            p: 1.5,
            textAlign: 'center',
          }}
        >
          <Typography variant='subtitle1' fontWeight={600}>
            {category.name}
          </Typography>
        </Box>
      </CardActionArea>
    </Box>
  );
};
