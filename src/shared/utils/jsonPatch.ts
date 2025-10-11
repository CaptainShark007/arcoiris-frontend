import { JsonPatchOp } from '@shared/types/json';

/**
 * Crea operaciones JSON Patch comparando un objeto original con uno actualizado
 * @param original - Objeto con los valores originales
 * @param updated - Objeto con los valores actualizados
 * @param excludeFields - Array de campos que se deben excluir de la comparación
 * @returns Array de operaciones JSON Patch
 */
export const createPatchOperations = <T extends Record<string, any>>(
  original: T,
  updated: T,
  excludeFields: string[] = []
): JsonPatchOp[] => {
  const operations: JsonPatchOp[] = [];

  Object.keys(updated).forEach((key) => {
    // Saltar campos excluidos
    if (excludeFields.includes(key)) return;

    const originalValue = original[key];
    const updatedValue = updated[key];

    // Lógica especial para password: solo incluir si no está vacío
    if (key === 'password' && (!updatedValue || updatedValue.trim() === '')) {
      return;
    }

    // Comparar valores usando JSON.stringify para manejar objetos anidados
    if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
      operations.push({
        op: 'replace',
        path: `/${key}`,
        value: updatedValue,
      });
    }
  });

  return operations;
};

/**
 * Crea una operación JSON Patch individual
 * @param operation - Tipo de operación ('add', 'remove', 'replace', etc.)
 * @param path - Ruta del campo (ej: '/email', '/user/name')
 * @param value - Valor a asignar (opcional según el tipo de operación)
 * @returns Operación JSON Patch
 */
export const createPatchOperation = (
  operation: JsonPatchOp['op'],
  path: string,
  value?: any
): JsonPatchOp => {
  const op: JsonPatchOp = { op: operation, path };
  if (value !== undefined) {
    op.value = value;
  }
  return op;
};

/**
 * Valida si hay cambios entre dos objetos
 * @param original - Objeto original
 * @param updated - Objeto actualizado
 * @param excludeFields - Campos a excluir de la validación
 * @returns true si hay cambios, false si no
 */
export const hasChanges = <T extends Record<string, any>>(
  original: T,
  updated: T,
  excludeFields: string[] = []
): boolean => {
  return createPatchOperations(original, updated, excludeFields).length > 0;
};
