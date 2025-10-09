const env = {
  storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'ci'
};

export interface CookieOptions {
  expires?: Date | string;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * Set a cookie with optional configuration
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  try {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Add expiration
    if (options.expires) {
      const expires = options.expires instanceof Date ? options.expires : new Date(options.expires);
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    // Add max-age
    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    // Add path (default to '/')
    cookieString += `; path=${options.path || '/'}`;

    // Add domain
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    // Add secure flag
    if (options.secure) {
      cookieString += `; secure`;
    }

    // Add sameSite
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    // Note: httpOnly can only be set by server, not by client-side JavaScript
    document.cookie = cookieString;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(cookie.substring(nameEQ.length));
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie:', error);
    return null;
  }
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
  try {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // Add path (default to '/')
    cookieString += `; path=${options.path || '/'}`;

    // Add domain if specified
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    document.cookie = cookieString;
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

/**
 * Get all cookies with the app prefix
 */
export const getAllAppCookies = (): Record<string, string> => {
  try {
    const prefix = `${env.storagePrefix}_`;
    const cookies: Record<string, string> = {};
    const allCookies = document.cookie.split(';');

    for (let cookie of allCookies) {
      cookie = cookie.trim();
      const [nameEncoded, valueEncoded] = cookie.split('=');
      
      if (nameEncoded && valueEncoded) {
        const name = decodeURIComponent(nameEncoded);
        const value = decodeURIComponent(valueEncoded);
        
        if (name.startsWith(prefix)) {
          const cleanName = name.substring(prefix.length);
          cookies[cleanName] = value;
        }
      }
    }

    return cookies;
  } catch (error) {
    console.error('Error reading all cookies:', error);
    return {};
  }
};

/**
 * Clear all app cookies
 */
export const clearAllAppCookies = (options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
  try {
    const appCookies = getAllAppCookies();
    
    Object.keys(appCookies).forEach(name => {
      deleteCookie(name, options);
    });
  } catch (error) {
    console.error('Error clearing app cookies:', error);
  }
};