import React from "react";
import { Box, Typography, /* Card ,*/ CardActionArea } from "@mui/material";
import { Category } from "@shared/types";


interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Box // Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        //boxShadow: 2,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          //boxShadow: 4,
        },
      }}
    >
      <CardActionArea>
        <Box
          component="img"
          src={category.image ?? "https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png"}
          alt={category.name}
          sx={{
            width: "100%",
            height: 140,
            objectFit: "contain",
          }}
        />
        <Box
          sx={{
            p: 1.5,
            textAlign: "center",
            //bgcolor: "white",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {category.name}
          </Typography>
        </Box>
      </CardActionArea>
    </Box>
  );
};