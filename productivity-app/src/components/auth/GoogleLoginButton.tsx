import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore, User } from '../../store/authStore';
import { Loader2 } from 'lucide-react';
import apiClient from '../../services/api';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  size?: 'large' | 'medium' | 'small';
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, size = 'large' }) => {
  const { login, setError, setLoading, isLoading } = useAuthStore();
  const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  /**
   * Handle Google Sign-In success.
   * Sends Google credential to backend for verification, receives MySpace JWT.
   */
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Send Google credential to our backend for verification
      const response = await apiClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      // Backend returns: { success, user, accessToken, tokenType }
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture || '',
        googleId: data.user.googleId || data.user.id,
      };

      // Store MySpace JWT (not the Google credential)
      login(user, data.accessToken);

      if (onSuccess) {
        setTimeout(onSuccess, 500);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to sign in with Google';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <Loader2 size={20} className="animate-spin text-blue-600" />
        <span className="text-sm font-medium text-slate-700">Signing you in...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {hasGoogleClientId ? (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          size={size}
          theme="outline"
          shape="rectangular"
          text="continue_with"
          width={size === 'large' ? 280 : undefined}
          locale="en"
        />
      ) : (
        <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-slate-100 border border-slate-200 w-[280px]">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#9CA3AF"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#9CA3AF"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#9CA3AF"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#9CA3AF"/>
          </svg>
          <span className="text-sm font-medium text-slate-400">Set VITE_GOOGLE_CLIENT_ID</span>
        </div>
      )}

      <p className="text-xs text-slate-400 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Secure Google sign-in • Your data stays private
      </p>
    </div>
  );
};
