import { useContext } from 'react';

/* Used for generation hooks for context
* @props
* entityContext - context itself
* entityName - string(name of context module)
*  */
export const generateContextHook = (entityContext, entityName) => () => {
    const context = useContext(entityContext);
    if (context === undefined) {
        throw new Error(`use${entityName}State must be used within a ${entityName}Provider`);
    }
    return context;
};