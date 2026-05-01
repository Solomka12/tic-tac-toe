import { useContext, Context } from 'react';

/**
 * Generates a custom hook for a React context.
 * @param entityContext - The React context.
 * @param entityName - The name of the context module.
 * @returns A custom hook for the context.
 */
export const generateContextHook = <T>(entityContext: Context<T | undefined>, entityName: string) => () => {
  const context = useContext(entityContext);
  if (context === undefined) {
    throw new Error(`use${entityName}State must be used within a ${entityName}Provider`);
  }
  return context;
};