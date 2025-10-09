const env = {
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'ci'
}; 

export const setLocalStorage = <T>(key: string, value: T): void => {
    try {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(`@${env.storagePrefix}:${key}`, valueToStore);
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  };
  
  export const getLocalStorage = <T>(key: string, defaultValue: any): any => {
    try {
      const item = localStorage.getItem(`@${env.storagePrefix}:${key}`);
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
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  };
  
  export const removeLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(`@${env.storagePrefix}:${key}`);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  };
  
  export const clearLocalStorage = (): void => {
    try {
      // Limpa apenas os itens com o prefixo definido
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`@${env.storagePrefix}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };