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
  ListItemText,
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
  color: string | null;
  storage: string | null;
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
    color: null,
    storage: null,
    finish: null,
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Esto maneja el error de carga de imagen
  const [imageError, setImageError] = useState(false);
  
  const getProductImage = () => {
    if (imageError || !product.images[0]) {
      return "https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png";
    }
    return product.images[0];
  }
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Detectar qué atributos están presentes
  const attributesPresent = useMemo(() => {
    if (!open || variants.length === 0) {
      return { hasColor: false, hasStorage: false, hasFinish: false };
    }

    const hasColor = variants.some((v) => v.color_name);
    const hasStorage = variants.some((v) => v.storage);
    const hasFinish = variants.some((v) => v.finish);

    return { hasColor, hasStorage, hasFinish };
  }, [open, variants]);

  // Obtener TODAS las opciones disponibles (sin filtrar)
  const allOptions = useMemo(() => {
    const colorSet = new Map<string, { name: string; hex: string }>();
    const storageSet = new Set<string>();
    const finishSet = new Set<string | null>();

    variants.forEach((v) => {
      if (v.color_name && v.color) {
        colorSet.set(v.color_name, { name: v.color_name, hex: v.color });
      }
      if (v.storage) storageSet.add(v.storage.trim());
      finishSet.add(v.finish);
    });

    return {
      colorOptions: Array.from(colorSet.values()),
      storageOptions: Array.from(storageSet),
      finishOptions: Array.from(finishSet).sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return a.localeCompare(b);
      }),
    };
  }, [variants]);

  // Verificar si una combinación de opciones es válida
  const isOptionValid = useMemo(() => {
    return {
      color: (colorName: string) => {
        return variants.some((v) => {
          if (v.color_name !== colorName) return false;
          if (selectedOptions.storage && v.storage?.trim() !== selectedOptions.storage)
            return false;
          if (selectedOptions.finish && v.finish !== selectedOptions.finish)
            return false;
          return true;
        });
      },
      storage: (storageName: string) => {
        return variants.some((v) => {
          if (v.storage?.trim() !== storageName) return false;
          if (selectedOptions.color && v.color_name !== selectedOptions.color)
            return false;
          if (selectedOptions.finish && v.finish !== selectedOptions.finish)
            return false;
          return true;
        });
      },
      finish: (finishName: string | null) => {
        return variants.some((v) => {
          if (v.finish !== finishName) return false;
          if (selectedOptions.color && v.color_name !== selectedOptions.color)
            return false;
          if (selectedOptions.storage && v.storage?.trim() !== selectedOptions.storage)
            return false;
          return true;
        });
      },
    };
  }, [variants, selectedOptions]);

  // Encontrar la variante exacta
  const selectedVariant = useMemo(() => {
    if (!open) {
      return null;
    }

    const hasSelectedColor = attributesPresent.hasColor && selectedOptions.color !== null;
    const hasSelectedStorage = attributesPresent.hasStorage && selectedOptions.storage !== null;
    const hasSelectedFinish = attributesPresent.hasFinish && selectedOptions.finish !== null;

    if (attributesPresent.hasColor && !hasSelectedColor) return null;
    if (attributesPresent.hasStorage && !hasSelectedStorage) return null;
    if (attributesPresent.hasFinish && !hasSelectedFinish) return null;

    return (
      variants.find((v) => {
        if (attributesPresent.hasColor && v.color_name !== selectedOptions.color)
          return false;
        if (attributesPresent.hasStorage && v.storage?.trim() !== selectedOptions.storage)
          return false;
        if (attributesPresent.hasFinish && v.finish !== selectedOptions.finish)
          return false;
        return true;
      }) || null
    );
  }, [open, variants, selectedOptions, attributesPresent]);

  // Cambiar una opción
  const handleOptionChange = (field: keyof SelectedOptions, value: string | null) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  // Cantidad
  const increaseQuantity = () => {
    if (!selectedVariant) return;
    setQuantity((q) => Math.min(selectedVariant.stock, q + 1));
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const unitPrice = selectedVariant?.price ?? 0;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = async () => {
    if (!selectedVariant) {
      toast.error("Selecciona una combinación válida", { position: "top-right" });
      return;
    }

    if (selectedVariant.stock <= 0) {
      toast.error("No hay stock disponible para esta variante", {
        position: "top-right",
      });
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Solo hay ${selectedVariant.stock} unidades disponibles`, {
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addItem({
        id: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price,
        image: getProductImage(), // product.images?.[0] ?? ""
        quantity,
        variant: {
          color: selectedVariant.color_name,
          storage: selectedVariant.storage,
          finish: selectedVariant.finish,
          colorHex: selectedVariant.color,
          stock: selectedVariant.stock,
        },
      });

      toast.success(
        `${quantity} ${quantity === 1 ? "producto" : "productos"} agregado al carrito`,
        {
          position: "top-right",
          style: {
            marginTop: '50px',
          }
        }
      );
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error al agregar el producto al carrito", {
        position: "top-right"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelectedOptions({
        color: null,
        storage: null,
        finish: null,
      });
      setQuantity(1);
    }
  }, [open]);

  if (variants.length === 0 && !loading) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        disableScrollLock={false} // Asegura el bloqueo del body
        scroll="paper" // Mantiene el scroll interno
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Producto no disponible</DialogTitle>
        <DialogContent sx={{ py: 2, px: { xs: 1.5, md: 2 } }}>
          <Alert severity="warning">
            Este producto no tiene variantes disponibles en este momento.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      disableScrollLock={false}
      PaperProps={{
        sx: {
          overscrollBehavior: 'contain',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 1.5, fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
        Configurar producto
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box
              sx={{
                flex: { md: 1 },
                maxWidth: { md: "40%" },
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  p: 3,
                  minHeight: 280,
                }}
              >
                <img
                  src={getProductImage()}
                  alt={product.name}
                  onError={handleImageError}
                  style={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain" }}
                />
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Marca: {product.brand}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: { md: 1 },
                maxWidth: { md: "60%" },
                minWidth: 0,
                mt: 1,
              }}
            >
              <Stack spacing={2}>
                {/* Botón limpiar filtros */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Opciones
                  </Typography>
                  {(selectedOptions.color || selectedOptions.storage || selectedOptions.finish) && (
                    <Button
                      size="small"
                      onClick={() =>
                        setSelectedOptions({
                          color: null,
                          storage: null,
                          finish: null,
                        })
                      }
                      sx={{ textTransform: "none", fontSize: "0.75rem", padding: "4px 8px" }}
                    >
                      Limpiar
                    </Button>
                  )}
                </Box>
                {/* Color */}
                {attributesPresent.hasColor && allOptions.colorOptions.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel id="modal-color-label" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                      Color
                    </InputLabel>
                    <Select
                      labelId="modal-color-label"
                      value={selectedOptions.color || ""}
                      label="Color"
                      onChange={(e) => handleOptionChange("color", e.target.value || null)}
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      <MenuItem value=""><em>Seleccionar color</em></MenuItem>
                      {allOptions.colorOptions.map((color) => {
                        const isValid = isOptionValid.color(color.name);
                        return (
                          <MenuItem
                            key={color.name}
                            value={color.name}
                            disabled={!isValid}
                            sx={{
                              opacity: isValid ? 1 : 0.5,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  backgroundColor: color.hex,
                                  border: "1px solid rgba(0,0,0,0.1)",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  opacity: isValid ? 1 : 0.5,
                                  flexShrink: 0,
                                }}
                              />
                              <ListItemText
                                primary={color.name}
                                secondary={!isValid ? "No disponible" : undefined}
                                primaryTypographyProps={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                                secondaryTypographyProps={{ variant: "caption", fontSize: "0.75rem" }}
                              />
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {/* Storage */}
                {attributesPresent.hasStorage && allOptions.storageOptions.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel id="modal-storage-label" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                      Presentación
                    </InputLabel>
                    <Select
                      labelId="modal-storage-label"
                      value={selectedOptions.storage || ""}
                      label="Presentación"
                      onChange={(e) => handleOptionChange("storage", e.target.value || null)}
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      <MenuItem value=""><em>Seleccionar presentación</em></MenuItem>
                      {allOptions.storageOptions.map((storage) => {
                        const isValid = isOptionValid.storage(storage);
                        return (
                          <MenuItem
                            key={storage}
                            value={storage}
                            disabled={!isValid}
                            sx={{
                              opacity: isValid ? 1 : 0.5,
                            }}
                          >
                            <ListItemText
                              primary={storage}
                              secondary={!isValid ? "No disponible" : undefined}
                              primaryTypographyProps={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                              secondaryTypographyProps={{ variant: "caption", fontSize: "0.75rem" }}
                            />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {/* Finish */}
                {attributesPresent.hasFinish && allOptions.finishOptions.length > 0 && (
                  <FormControl fullWidth size="small">
                    <InputLabel id="modal-finish-label" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                      Terminación
                    </InputLabel>
                    <Select
                      labelId="modal-finish-label"
                      value={selectedOptions.finish || ""}
                      label="Terminación"
                      onChange={(e) => handleOptionChange("finish", e.target.value || null)}
                      sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                    >
                      <MenuItem value=""><em>Seleccionar terminación</em></MenuItem>
                      {allOptions.finishOptions.map((finish) => {
                        const isValid = isOptionValid.finish(finish);
                        return (
                          <MenuItem
                            key={finish ?? "none"}
                            value={finish || ""}
                            disabled={!isValid}
                            sx={{
                              opacity: isValid ? 1 : 0.5,
                            }}
                          >
                            <ListItemText
                              primary={finish || "Sin terminación"}
                              secondary={!isValid ? "No disponible" : undefined}
                              primaryTypographyProps={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                              secondaryTypographyProps={{ variant: "caption", fontSize: "0.75rem" }}
                            />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                <Divider sx={{ my: 0.5 }} />

                {/* Variante seleccionada */}
                {selectedVariant && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: "block", fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                    >
                      Variante:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                      {attributesPresent.hasColor && selectedVariant.color_name && (
                        <Chip
                          label={selectedVariant.color_name}
                          size="small"
                          avatar={
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                backgroundColor: selectedVariant.color,
                                ml: 0.5,
                              }}
                            />
                          }
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                      {attributesPresent.hasStorage && selectedVariant.storage && (
                        <Chip
                          label={selectedVariant.storage}
                          size="small"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                      {attributesPresent.hasFinish && selectedVariant.finish && (
                        <Chip
                          label={selectedVariant.finish}
                          size="small"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Cantidad */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 1, display: "block", fontSize: { xs: "0.8rem", md: "0.875rem" }, fontWeight: 600 }}>
                    Cantidad
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || !selectedVariant}
                      sx={{ padding: "4px" }}
                    >
                      <RemoveIcon sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                    </IconButton>

                    <Box
                      sx={{
                        minWidth: 50,
                        textAlign: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        py: 0.5,
                        px: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                        {quantity}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={increaseQuantity}
                      disabled={
                        !selectedVariant || quantity >= (selectedVariant?.stock || 0)
                      }
                      sx={{ padding: "4px" }}
                    >
                      <AddIcon sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                    </IconButton>

                    {selectedVariant && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: "auto", fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                        {selectedVariant.stock} disp.
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                {/* Precios */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                      Unitario
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.1rem" } }}>
                      {formatPrice(unitPrice)}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.3rem" } }}>
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>
                </Box>

                {/* Alertas */}
                {!selectedVariant && (selectedOptions.color || selectedOptions.storage || selectedOptions.finish) && (
                  <Alert severity="warning" sx={{ py: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                    Combinación no disponible
                  </Alert>
                )}

                {selectedVariant && selectedVariant.stock === 0 && (
                  <Alert severity="error" sx={{ py: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                    Agotado
                  </Alert>
                )}

                {selectedVariant &&
                  selectedVariant.stock > 0 &&
                  selectedVariant.stock <= 10 && (
                    <Alert
                      severity={selectedVariant.stock <= 3 ? "warning" : "info"}
                      sx={{ py: 1, fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                    >
                      {selectedVariant.stock <= 3
                        ? `¡Últimas ${selectedVariant.stock}!`
                        : `Solo ${selectedVariant.stock} disponibles`}
                    </Alert>
                  )}
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexDirection: { xs: "column-reverse", md: "row" } }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting} fullWidth={false}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedVariant || selectedVariant.stock <= 0 || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          sx={{ minWidth: 140 }}
          fullWidth
        >
          {isSubmitting ? "Agregando..." : "Agregar al carrito"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};