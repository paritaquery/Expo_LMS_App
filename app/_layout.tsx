import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { AppErrorBoundary, OfflineBanner } from '@/components/feedback';
import { AppProviders } from '@/providers';
import { useAppStore } from '@/store';

function RootNavigator() {
  const isOnline = useAppStore((state) => state.isOnline);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <OfflineBanner isOnline={isOnline} />
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          contentStyle: {
            backgroundColor: '#f8fafc',
          },
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export { AppErrorBoundary as ErrorBoundary };

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
