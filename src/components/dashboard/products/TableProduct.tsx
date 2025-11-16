import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CellTableProduct } from "./CellTableProduct";
import { useState, useEffect } from "react";

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

interface TableProductProps {
  products: Product[];
  onDelete: (productId: string) => void;
}

export const TableProduct = ({ products, onDelete }: TableProductProps) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    products.forEach((product) => {
      initial[product.id] = product.variants[0]?.id || "";
    });
    setSelectedVariants(initial);
  }, [products]);

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imagen</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Variante</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <CellTableProduct
              key={product.id}
              product={product}
              selectedVariant={selectedVariants[product.id]}
              onVariantChange={(variantId) => handleVariantChange(product.id, variantId)}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
