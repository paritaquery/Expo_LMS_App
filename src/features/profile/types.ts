import type { UserPreferences } from '@/types/preferences';
import type { UserProfile, UserStatistics } from '@/types/user';

export type ProfileState = {
  profile: UserProfile | null;
  stats: UserStatistics | null;
  preferences: UserPreferences;
};
