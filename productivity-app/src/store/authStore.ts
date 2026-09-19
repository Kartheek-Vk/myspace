import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  googleId: string;
}

export type AuthMode = 'guest' | 'google' | null;

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  authMode: AuthMode;
  isLoading: boolean;
  error: string | null;
  guestId: string | null;

  login: (user: User, token: string) => void;
  enterGuestMode: () => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  verifySession: () => boolean;
}

function generateGuestId(): string {
  return 'guest_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      authMode: null,
      isLoading: false,
      error: null,
      guestId: null,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isGuest: false,
          authMode: 'google',
          error: null,
          guestId: null,
        });
      },

      enterGuestMode: () => {
        const existingGuestId = get().guestId;
        set({
          user: null,
          token: null,
          isAuthenticated: true,
          isGuest: true,
          authMode: 'guest',
          error: null,
          guestId: existingGuestId || generateGuestId(),
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: false,
          authMode: null,
          error: null,
          guestId: null,
        });
      },

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),

      verifySession: () => {
        const { isAuthenticated } = get();
        return isAuthenticated;
      },
    }),
    {
      name: 'myspace-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        authMode: state.authMode,
        guestId: state.guestId,
      }),
    }
  )
);
