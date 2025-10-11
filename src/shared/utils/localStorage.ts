export const getLocalStorage = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as T;
  } catch (e) {
    console.warn('Error obteniendo local storage', e);
    return undefined;
  }
};

export const setLocalStorage = (key: string, state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (e) {
    console.warn('Error guardando local storage', e);
  }
};

export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Error borrando localStorage', e);
  }
};
