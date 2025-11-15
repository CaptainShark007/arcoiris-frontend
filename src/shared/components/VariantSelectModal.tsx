import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useCartStore } from "@/storage/useCartStore";
import { Product, VariantProduct } from "@shared/types";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/helpers";

interface VariantModalProps {
  open: boolean;
  onClose: () => void;
  variants: VariantProduct[];
  product: Product;
  loading?: boolean;
}

interface SelectedOptions {
  color: string;
  storage: string;
  finish: string | null;
}

export const VariantSelectModal = ({
  open,
  onClose,
  variants,
  product,
  loading = false,
}: VariantModalProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    color: "",
    storage: "",
    finish: null,
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Obtener TODAS las opciones únicas - SOLO cuando el modal está abierto
  const { colorOptions, storageOptions, finishOptions } = useMemo(() => {
    if (!open) {
      return {
        colorOptions: [],
        storageOptions: [],
        finishOptions: [],
      };
    }

    const colors = new Map<string, { name: string; hex: string }>();
    const storages = new Set<string>();
    const finishes = new Set<string>();

    variants.forEach(variant => {
      if (variant.color_name && variant.color) {
        colors.set(variant.color_name, { 
          name: variant.color_name, 
          hex: variant.color 
        });
      }
      // Trimear espacios en storage para evitar duplicados como "256Gb " y "256Gb"
      if (variant.storage) storages.add(variant.storage.trim());
      if (variant.finish) finishes.add(variant.finish);
    });

    return {
      colorOptions: Array.from(colors.values()),
      storageOptions: Array.from(storages),
      finishOptions: Array.from(finishes),
    };
  }, [open, variants]);

  // Inicializar con la primera variante disponible - SOLO cuando se abre el modal
  useEffect(() => {
    if (open && variants.length > 0) {
      const firstVariant = variants[0];
      setSelectedOptions({
        color: firstVariant.color_name || "",
        storage: firstVariant.storage?.trim() || "",
        finish: firstVariant.finish || null,
      });
      setQuantity(1);
    }
  }, [open, variants]);

  // Encontrar la variante exacta según las opciones seleccionadas
  const selectedVariant = useMemo(() => {
    if (!open || !selectedOptions.color || !selectedOptions.storage) {
      return null;
    }

    return variants.find(v => {
      const colorMatch = v.color_name === selectedOptions.color;
      const storageMatch = v.storage?.trim() === selectedOptions.storage;
      const finishMatch = selectedOptions.finish 
        ? v.finish === selectedOptions.finish 
        : true; // Si no hay finish seleccionado, aceptar cualquier finish
      
      return colorMatch && storageMatch && finishMatch;
    }) || null;
  }, [open, variants, selectedOptions]);

  // Cambiar una opción
  const handleOptionChange = (field: keyof SelectedOptions, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [field]: value === "" ? null : value
    }));
  };

  // Cantidad
  const increaseQuantity = () => {
    if (!selectedVariant) return;
    setQuantity(q => Math.min(selectedVariant.stock, q + 1));
  };

  const decreaseQuantity = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  // Precios
  const unitPrice = selectedVariant?.price ?? 0;
  const totalPrice = unitPrice * quantity;

  // Confirmar
  const handleConfirm = async () => {
    if (!selectedVariant) {
      toast.error("Selecciona una combinación válida", { position: "bottom-right" });
      return;
    }

    if (selectedVariant.stock <= 0) {
      toast.error("No hay stock disponible para esta variante", { position: "bottom-right" });
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Solo hay ${selectedVariant.stock} unidades disponibles`, { position: "bottom-right" });
      return;
    }

    setIsSubmitting(true);

    try {
      addItem({
        id: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images?.[0] ?? "",
        quantity,
        variant: {
          color: selectedVariant.color_name,
          storage: selectedVariant.storage,
          finish: selectedVariant.finish,
          colorHex: selectedVariant.color,
        }
      });

      toast.success(`${quantity} ${quantity === 1 ? 'producto' : 'productos'} agregado al carrito`, { 
        position: "bottom-right" 
      });
      onClose();
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error("Error al agregar el producto al carrito", { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  if (variants.length === 0 && !loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Producto no disponible</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Este producto no tiene variantes disponibles en este momento.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Entendido</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        Configurar producto
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Imagen */}
            <Box sx={{ flex: { md: 1 }, maxWidth: { md: '40%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: 'grey.50', borderRadius: 2, p: 3, minHeight: 280 }}>
                <img
                  src={product.images?.[0] ?? "/placeholder-product.jpg"}
                  alt={product.name}
                  style={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain" }}
                />
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Marca: {product.brand}</Typography>
                
                {product.features && product.features.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Características:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Chip key={index} label={feature} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Controles */}
            <Box sx={{ flex: { md: 1 }, maxWidth: { md: '60%' }, minWidth: 0, mt: 1 }}>
              <Stack spacing={3}>
                {/* Color */}
                {colorOptions.length > 0 && (
                  <FormControl fullWidth size="medium">
                    <InputLabel id="modal-color-label">Color</InputLabel>
                    <Select
                      labelId="modal-color-label"
                      value={selectedOptions.color}
                      label="Color"
                      onChange={(e) => handleOptionChange('color', e.target.value)}
                    >
                      {colorOptions.map((color) => (
                        <MenuItem key={color.name} value={color.name}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                backgroundColor: color.hex,
                                border: "1px solid rgba(0,0,0,0.1)",
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Typography variant="body2">{color.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Storage */}
                {storageOptions.length > 0 && (
                  <FormControl fullWidth size="medium">
                    <InputLabel id="modal-storage-label">Presentación</InputLabel>
                    <Select
                      labelId="modal-storage-label"
                      value={selectedOptions.storage}
                      label="Presentación"
                      onChange={(e) => handleOptionChange('storage', e.target.value)}
                    >
                      {storageOptions.map((storage) => (
                        <MenuItem key={storage} value={storage}>
                          <Typography variant="body2">{storage}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Finish */}
                {finishOptions.length > 0 && (
                  <FormControl fullWidth size="medium">
                    <InputLabel id="modal-finish-label">Terminación</InputLabel>
                    <Select
                      labelId="modal-finish-label"
                      value={selectedOptions.finish || ''}
                      label="Terminación"
                      onChange={(e) => handleOptionChange('finish', e.target.value)}
                    >
                      <MenuItem value=""><em>Sin terminación específica</em></MenuItem>
                      {finishOptions.map((finish) => (
                        <MenuItem key={finish} value={finish}>
                          <Typography variant="body2">{finish}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Divider />

                {/* Variante seleccionada */}
                {selectedVariant && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      Variante seleccionada:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedVariant.color_name && (
                        <Chip 
                          label={`Color: ${selectedVariant.color_name}`}
                          size="small"
                          avatar={
                            <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: selectedVariant.color, ml: 0.5 }} />
                          }
                        />
                      )}
                      {selectedVariant.storage && (
                        <Chip label={`Presentación: ${selectedVariant.storage}`} size="small" />
                      )}
                      {selectedVariant.finish && (
                        <Chip label={`Terminación: ${selectedVariant.finish}`} size="small" />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Cantidad */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Cantidad</Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton 
                      size="small" 
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || !selectedVariant}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Box sx={{ minWidth: 80, textAlign: "center", border: "1px solid", borderColor: "divider", borderRadius: 1, py: 1, px: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{quantity}</Typography>
                    </Box>

                    <IconButton 
                      size="small" 
                      onClick={increaseQuantity}
                      disabled={!selectedVariant || quantity >= (selectedVariant?.stock || 0)}
                    >
                      <AddIcon />
                    </IconButton>

                    {selectedVariant && (
                      <Typography variant="caption" color="text.secondary">
                        {selectedVariant.stock} disponibles
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Precios */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Precio unitario</Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {formatPrice(unitPrice)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>
                </Box>

                {/* Alertas */}
                {!selectedVariant && selectedOptions.color && selectedOptions.storage && (
                  <Alert severity="warning">
                    Esta combinación no está disponible. Prueba con otras opciones.
                  </Alert>
                )}
                
                {selectedVariant && selectedVariant.stock === 0 && (
                  <Alert severity="error">Producto agotado para esta combinación</Alert>
                )}
                
                {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
                  <Alert severity={selectedVariant.stock <= 3 ? "warning" : "info"}>
                    {selectedVariant.stock <= 3 
                      ? `¡Últimas unidades! Solo ${selectedVariant.stock} en stock.` 
                      : `Stock limitado: ${selectedVariant.stock} unidades disponibles.`
                    }
                  </Alert>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedVariant || selectedVariant.stock <= 0 || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          sx={{ minWidth: 140 }}
        >
          {isSubmitting ? "Agregando..." : "Agregar al carrito"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};