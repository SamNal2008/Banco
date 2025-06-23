import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { userSchema, UserFormData } from '../schemas/userSchema';
import { useOnboarding } from '../context/OnboardingContext';
import { useSignUpMutation } from '../hooks/useAuthMutation';

const AccountCreationStep = () => {
  const { state, setEmail, setPassword, nextStep, setError } = useOnboarding();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      email: state.email,
      password: state.password
    }
  });

  const password = watch('password', '');
  
  // Use the extracted authentication mutation hook
  const signUpMutation = useSignUpMutation({
    onSuccess: () => {
      // Clear any previous errors
      setError(null);
      nextStep();
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const onSubmit = (data: UserFormData) => {
    // Save the data to context
    setEmail(data.email);
    setPassword(data.password);
    
    // Call the API to register the user
    signUpMutation.mutate({
      email: data.email,
      password: data.password
    });
  };

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasUppercase) strength += 1;
    if (hasNumber) strength += 1;
    return strength;
  };
  
  const passwordStrength = getPasswordStrength();
  
  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Faible';
    if (passwordStrength === 2) return 'Moyen';
    if (passwordStrength === 3) return 'Bon';
    return 'Fort';
  };
  
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Créez votre compte</h2>
        <p className="text-gray-400">Commencez à agréger vos comptes bancaires</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full px-4 py-3 bg-gray-900/50 border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="votre@email.com"
              {...register('email')}
            />
            {errors.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                <AlertCircle size={18} />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`w-full px-4 py-3 bg-gray-900/50 border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Force du mot de passe</span>
                <span className={`text-xs ${
                  passwordStrength < 2 ? 'text-red-400' : 
                  passwordStrength < 4 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
              
              {/* Password Requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-gray-500" />
                  )}
                  <span className={`text-xs ${hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                    8 caractères minimum
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowercase ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-gray-500" />
                  )}
                  <span className={`text-xs ${hasLowercase ? 'text-green-400' : 'text-gray-500'}`}>
                    Une minuscule
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUppercase ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-gray-500" />
                  )}
                  <span className={`text-xs ${hasUppercase ? 'text-green-400' : 'text-gray-500'}`}>
                    Une majuscule
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasNumber ? (
                    <CheckCircle2 size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-gray-500" />
                  )}
                  <span className={`text-xs ${hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                    Un chiffre
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValid || signUpMutation.isPending}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              isValid && !signUpMutation.isPending
                ? 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02]'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {signUpMutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Création en cours...
              </>
            ) : (
              'Continuer'
            )}
          </button>
        </div>
        
        {/* Error message */}
        {state.error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={16} />
              {state.error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountCreationStep;
