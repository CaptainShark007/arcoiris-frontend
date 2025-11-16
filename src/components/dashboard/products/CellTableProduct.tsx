import {
  TableCell,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Menu,
  MenuItem as MenuOption,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Variant {
  id: string;
  price: number;
  stock: number;
  colorName: string;
  storage: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  createdAt: string;
  variants: Variant[];
}

interface CellTableProductProps {
  product: Product;
  selectedVariant: string;
  onVariantChange: (variantId: string) => void;
  onDelete: (productId: string) => void;
}

export const CellTableProduct = ({
  product,
  selectedVariant,
  onVariantChange,
  onDelete,
}: CellTableProductProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const variant =
    product.variants.find((v) => v.id === selectedVariant) || product.variants[0];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/dashboard/productos/editar/${product.slug}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(product.id);
    handleMenuClose();
  };

  return (
    <TableRow hover>
      <TableCell>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: 60, height: 60, objectFit: "cover" }}
        />
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <Select
          value={selectedVariant}
          onChange={(e) => onVariantChange(e.target.value)}
          size="small"
        >
          {product.variants.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.colorName} - {v.storage}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell>${variant?.price.toFixed(2)}</TableCell>
      <TableCell>{variant?.stock}</TableCell>
      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuOption onClick={handleEdit}>Editar</MenuOption>
          <MenuOption onClick={handleDelete}>Eliminar</MenuOption>
        </Menu>
      </TableCell>
    </TableRow>
  );
};
