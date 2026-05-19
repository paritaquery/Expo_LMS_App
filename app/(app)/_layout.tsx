import { Redirect, Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { useAuthStore } from '@/store';

export default function AppLayout() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);

  if (status === 'bootstrapping') {
    return null;
  }

  if (status !== 'authenticated' || !session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#ffffff',
        },
        sceneStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="home-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarLabel: 'Bookmarks',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="bookmark-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="person-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="course/[id]"
        options={{
          href: null,
          headerTitle: 'Course Details',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <Ionicons color="#0f172a" name="arrow-back" size={24} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="course/[id]/learn"
        options={{
          href: null,
          headerTitle: 'Course Content',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <Ionicons color="#0f172a" name="arrow-back" size={24} />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
