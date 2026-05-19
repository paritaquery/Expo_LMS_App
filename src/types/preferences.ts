export type UserPreferences = {
  notificationsEnabled: boolean;
  reminderNotificationsEnabled: boolean;
  preferredTheme: 'light' | 'dark' | 'system';
  lastOpenedAt?: string;
};
