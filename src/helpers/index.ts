export const formatPrice = (price?: number | null): string => {
  const safePrice = Number(price ?? 0);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safePrice);
};