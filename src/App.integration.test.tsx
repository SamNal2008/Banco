import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { StorageService } from './services/StorageService';

// Mock the services that make external calls
jest.mock('./Login/services/LoginService', () => ({
  LoginService: {
    signIn: jest.fn(),
    signUp: jest.fn()
  },
  MockLoginService: {
    signIn: jest.fn().mockResolvedValue({
      success: true,
      data: {
        accessToken: 'mock-token',
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      }
    }),
    signUp: jest.fn().mockResolvedValue({
      success: true,
      data: {
        accessToken: 'mock-token',
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      }
    })
  }
}));

jest.mock('./config/environment', () => ({
  API_CONFIG: {
    USE_MOCK: true
  }
}));

describe('Login and Dashboard Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any URL state
    window.history.replaceState({}, '', '/');
  });

  it('should show login form when user clicks "Se connecter"', async () => {
    const user = userEvent.setup();
    render(<App />);

    // User should see the landing page
    expect(screen.getByText('Finances')).toBeInTheDocument();
    
    // Click the login button
    const loginButton = screen.getByText('Se connecter');
    await user.click(loginButton);

    // Should navigate to login page
    await waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
    });
  });

  it('should allow user to login and see personalized dashboard', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to login
    const loginButton = screen.getByText('Se connecter');
    await user.click(loginButton);

    // Fill in login form
    await waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Should redirect to dashboard with personalized welcome
    await waitFor(() => {
      expect(screen.getByText('Bonjour, test!')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Voici un aperçu de vos finances')).toBeInTheDocument();
  });

  it('should persist login state and show dashboard on page reload', async () => {
    // Simulate user already logged in
    StorageService.setUserToken('existing-token');
    StorageService.setUserInfo({
      id: 'user-123',
      email: 'johndoe@example.com'
    });

    render(<App />);

    // Should automatically show dashboard with user's name
    await waitFor(() => {
      expect(screen.getByText('Bonjour, johndoe!')).toBeInTheDocument();
    });
  });

  it('should logout user and return to landing page', async () => {
    const user = userEvent.setup();
    
    // Start with logged in user
    StorageService.setUserToken('existing-token');
    StorageService.setUserInfo({
      id: 'user-123',
      email: 'test@example.com'
    });

    render(<App />);

    // Should show dashboard
    await waitFor(() => {
      expect(screen.getByText('Bonjour, test!')).toBeInTheDocument();
    });

    // Click logout button
    const logoutButton = screen.getByRole('button', { name: '' }); // LogOut icon button
    await user.click(logoutButton);

    // Should return to landing page
    await waitFor(() => {
      expect(screen.getByText('Finances')).toBeInTheDocument();
      expect(screen.getByText('simplifiées')).toBeInTheDocument();
    });

    // Should clear localStorage
    expect(StorageService.getUserToken()).toBeNull();
    expect(StorageService.getUserInfo()).toBeNull();
  });

  it('should redirect to login if user tries to access dashboard without authentication', async () => {
    // Navigate directly to dashboard URL without being logged in
    window.history.pushState({}, '', '/dashboard');
    
    render(<App />);

    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
    });
  });

  it('should show different user names based on email', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to login
    const loginButton = screen.getByText('Se connecter');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    // Test with different email
    await user.type(emailInput, 'marie.dupont@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Should show personalized welcome with name from email
    await waitFor(() => {
      expect(screen.getByText('Bonjour, marie.dupont!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});