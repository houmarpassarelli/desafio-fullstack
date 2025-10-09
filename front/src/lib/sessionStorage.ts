const env = {
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'ci'
}; 

export const setSessionStorage = <T>(key: string, value: T): void => {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(`@${env.storagePrefix}:${key}`, valueToStore);
    } catch (error) {
      console.warn('Error saving to sessionStorage:', error);
    }
  };
  
  export const getSessionStorage = <T>(key: string, defaultValue: any): any => {
    try {
      const item = sessionStorage.getItem(`@${env.storagePrefix}:${key}`);
      if(item){
        if((item[0] === '{' || item[0] === '[') &&
          (item[item.length - 1] === '}' || item[item.length - 1] === ']')){
          return JSON.parse(item);
        } else {
          return item;
        }
      } else {
        return defaultValue;
      }      
    } catch (error) {
      console.warn('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  };
  
  export const removeSessionStorage = (key: string): void => {
    try {
      sessionStorage.removeItem(`@${env.storagePrefix}:${key}`);
    } catch (error) {
      console.warn('Error removing from sessionStorage:', error);
    }
  };
  
  export const clearSessionStorage = (): void => {
    try {
      // Limpa apenas os itens com o prefixo definido
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(`@${env.storagePrefix}:`)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing sessionStorage:', error);
    }
  }; 