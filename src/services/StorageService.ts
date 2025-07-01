export const STORAGE_KEYS = {
  USER_TOKEN: 'banco_user_token',
  USER_INFO: 'banco_user_info',
  LOGIN_TIMESTAMP: 'banco_login_time'
} as const;

export interface UserInfo {
  id: string;
  email: string;
}

export class StorageService {
  static setUserToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.LOGIN_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error('Failed to save user token:', error);
    }
  }

  static getUserToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Failed to retrieve user token:', error);
      return null;
    }
  }

  static setUserInfo(userInfo: UserInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to save user info:', error);
    }
  }

  static getUserInfo(): UserInfo | null {
    try {
      const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      return userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch (error) {
      console.error('Failed to retrieve user info:', error);
      return null;
    }
  }

  static getLoginTimestamp(): number | null {
    try {
      const timestamp = localStorage.getItem(STORAGE_KEYS.LOGIN_TIMESTAMP);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('Failed to retrieve login timestamp:', error);
      return null;
    }
  }

  static isTokenExpired(expirationHours: number = 24): boolean {
    const timestamp = this.getLoginTimestamp();
    if (!timestamp) return true;
    
    const now = Date.now();
    const expirationTime = timestamp + (expirationHours * 60 * 60 * 1000);
    return now > expirationTime;
  }

  static clearUserData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_TIMESTAMP);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  static isUserLoggedIn(): boolean {
    const token = this.getUserToken();
    const userInfo = this.getUserInfo();
    return !!(token && userInfo && !this.isTokenExpired());
  }
}