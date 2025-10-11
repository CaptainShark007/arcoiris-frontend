export const formatDNI = (dni: number | string): string => {
  const dniString = dni.toString();
  return dniString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatNumber = (num: number | string): string => {
  const numString = num.toString();
  return numString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
