import Constants from 'expo-constants';

type ExtraConfig = {
  apiBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const ENV = {
  apiBaseUrl: extra.apiBaseUrl ?? 'https://api.freeapi.app',
} as const;
