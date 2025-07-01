import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} isLoading={false} error={null} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });
  
  it('shows loading state when isLoading is true', () => {
    render(<LoginForm onLogin={mockOnLogin} isLoading={true} error={null} />);
    
    expect(screen.getByText(/connexion en cours/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('displays error message when error is provided', () => {
    const errorMessage = 'Email ou mot de passe incorrect';
    render(<LoginForm onLogin={mockOnLogin} isLoading={false} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('calls onLogin with form values when submitted', async () => {
    render(<LoginForm onLogin={mockOnLogin} isLoading={false} error={null} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
    });
  });
  
  it('requires email and password fields', () => {
    render(<LoginForm onLogin={mockOnLogin} isLoading={false} error={null} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
