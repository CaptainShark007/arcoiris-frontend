import { jwtDecode } from 'jwt-decode';

export const decodeJWT = <T>(token: string): T | null => {
  try {
    const decoded = jwtDecode<T>(token);
    return decoded;
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};
