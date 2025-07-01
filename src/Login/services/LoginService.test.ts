import { LoginService, MockLoginService } from './LoginService';
import { post } from '../../services/ApiService';
import { AUTH_ENDPOINTS } from '../../config/environment';

// Mock the API service
jest.mock('../../services/ApiService', () => ({
  post: jest.fn(),
  wrapApiCall: jest.fn((fn) => fn()),
}));

describe('LoginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call post with correct parameters', async () => {
      const mockResponse = { accessToken: 'test-token' };
      (post as jest.Mock).mockResolvedValue(mockResponse);

      const email = 'test@example.com';
      const password = 'Password123!';

      await LoginService.signIn(email, password);

      expect(post).toHaveBeenCalledWith(
        AUTH_ENDPOINTS.SIGN_IN,
        { email, password },
        { authenticated: false }
      );
    });
  });

  describe('signUp', () => {
    it('should call post with correct parameters', async () => {
      const mockResponse = { userId: 'user-123', accessToken: 'test-token' };
      (post as jest.Mock).mockResolvedValue(mockResponse);

      const email = 'test@example.com';
      const password = 'Password123!';

      await LoginService.signUp(email, password);

      expect(post).toHaveBeenCalledWith(
        AUTH_ENDPOINTS.SIGN_UP,
        { email, password },
        { authenticated: false }
      );
    });
  });
});

describe('MockLoginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
  });

  describe('signIn', () => {
    it('should return success with token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';

      const response = await MockLoginService.signIn(email, password);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.accessToken).toBeDefined();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should return error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      const response = await MockLoginService.signIn(email, password);

      expect(response.success).toBe(false);
      expect(response.error).toBe('Email ou mot de passe incorrect');
    });
  });

  describe('signUp', () => {
    it('should return success with userId and token', async () => {
      const email = 'new@example.com';
      const password = 'Password123!';

      const response = await MockLoginService.signUp(email, password);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.userId).toBeDefined();
      expect(response.data?.accessToken).toBeDefined();
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });
});
