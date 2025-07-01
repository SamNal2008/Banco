import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { MockLoginService } from './services/LoginService';

// Mock the hooks and services
jest.mock('./hooks/useLogin', () => ({
  useLogin: () => ({
    login: jest.fn().mockImplementation(async (email, password) => {
      const response = await MockLoginService.signIn(email, password);
      return response;
    }),
    signUp: jest.fn().mockImplementation(async (email, password) => {
      const response = await MockLoginService.signUp(email, password);
      return response;
    }),
    isLoading: false,
    error: null
  })
}));

// Mock window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('Login Integration', () => {
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
    mockLocation.href = '';
  });

  it('renders login form by default', () => {
    render(<Login />);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    expect(screen.getByText(/vous n'avez pas de compte/i)).toBeInTheDocument();
  });

  it('switches to sign-up form when toggle button is clicked', async () => {
    render(<Login />);
    
    const toggleButton = screen.getByText(/vous n'avez pas de compte/i);
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Créer un compte')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /créer un compte/i })).toBeInTheDocument();
      expect(screen.getByText(/déjà un compte/i)).toBeInTheDocument();
    });
  });

  it('switches back to login form when toggle button is clicked again', async () => {
    render(<Login />);
    
    // Switch to sign-up
    const toggleToSignUp = screen.getByText(/vous n'avez pas de compte/i);
    fireEvent.click(toggleToSignUp);
    
    // Switch back to login
    const toggleToLogin = await screen.findByText(/déjà un compte/i);
    fireEvent.click(toggleToLogin);
    
    await waitFor(() => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });
  });

  it('validates password requirements in sign-up form', async () => {
    render(<Login />);
    
    // Switch to sign-up
    const toggleButton = screen.getByText(/vous n'avez pas de compte/i);
    fireEvent.click(toggleButton);
    
    // Fill form with invalid password
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/^mot de passe$/i);
    const confirmPasswordInput = await screen.findByLabelText(/confirmer le mot de passe/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } }); // Missing requirements
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    
    // Check for validation error
    expect(await screen.findByText(/le mot de passe doit contenir/i)).toBeInTheDocument();
  });
});
