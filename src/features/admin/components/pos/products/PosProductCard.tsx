import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { PosProduct, PosVariant } from '@/actions/pos';
import { useState } from 'react';

interface PosProductCardProps {
  product: PosProduct;
  onSelect: (product: PosProduct, variant?: PosVariant) => void;
}

export const PosProductCard = ({ product, onSelect }: PosProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = imageError || !product.image
    ? 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png'
    : product.image;

  const handleClick = () => {
    if (product.hasVariants) {
      onSelect(product);
    } else {
      onSelect(product, product.variants[0]);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'grey.400',
        borderRadius: 1,
        transition: 'all 200ms ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          image={imageSrc}
          alt={product.name}
          onError={() => setImageError(true)}
          sx={{
            height: 100,
            objectFit: 'contain',
            p: 1,
            backgroundColor: '#fafafa',
          }}
        />
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography
            variant="body2"
            fontWeight={800}
            fontSize="0.8rem"
            lineHeight={1.3}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'grey.900',
              height: `calc(2 * 1.3em)`,
            }}
          >
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};