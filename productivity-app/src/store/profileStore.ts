import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  nickname: string;
  avatar: string;
  avatarType: 'preset' | 'custom';
  favoriteQuote: string;
  motto: string;
  favoriteColor: string;
  bio: string;
  birthday: string;
  personalWish: string;
  rewardEnabled: boolean;
  rewardType: string;
  rewardDuration: number;
  rewardMessage: string;
  requireFullCompletion: boolean;
  emailNotifications: {
    dailyComplete: boolean;
    tomorrowReminder: boolean;
    individualTask: boolean;
    overdueTask: boolean;
  };
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  nickname: '',
  avatar: '👨🏻‍💻',
  avatarType: 'preset',
  favoriteQuote: 'Small progress is still progress.',
  motto: 'Plan • Do • Grow',
  favoriteColor: '#3b82f6',
  bio: '',
  birthday: '',
  personalWish: '',
  rewardEnabled: true,
  rewardType: '🎮 Gaming',
  rewardDuration: 60,
  rewardMessage: 'You earned it. Take it easy 😌',
  requireFullCompletion: true,
  emailNotifications: {
    dailyComplete: true,
    tomorrowReminder: true,
    individualTask: false,
    overdueTask: false,
  },
};

export const AVATAR_PRESETS = [
  { emoji: '👨🏻‍💻', label: 'Developer' },
  { emoji: '👩🏻‍💻', label: 'Developer' },
  { emoji: '🧑🏻‍🎓', label: 'Student' },
  { emoji: '👩🏻‍🎓', label: 'Student' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐺', label: 'Wolf' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🦅', label: 'Eagle' },
  { emoji: '🐉', label: 'Dragon' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🎯', label: 'Target' },
  { emoji: '💎', label: 'Diamond' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🌊', label: 'Wave' },
  { emoji: '🏔️', label: 'Mountain' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🎨', label: 'Art' },
  { emoji: '🧠', label: 'Brain' },
  { emoji: '💪', label: 'Strong' },
  { emoji: '🌱', label: 'Growth' },
  { emoji: '☕', label: 'Coffee' },
];

export const REWARD_TYPES = [
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🎬', label: 'Movie' },
  { emoji: '📺', label: 'YouTube' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🍿', label: 'Entertainment' },
  { emoji: '📱', label: 'Social Media' },
  { emoji: '🎨', label: 'Hobby' },
  { emoji: '😴', label: 'Free Time' },
];

interface ProfileState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getGreeting: () => string;
  getDisplayName: () => string;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: { ...DEFAULT_PROFILE },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      getGreeting: () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
      },

      getDisplayName: () => {
        const { nickname, name } = get().profile;
        return nickname || name || 'there';
      },
    }),
    { name: 'myspace-profile' }
  )
);
