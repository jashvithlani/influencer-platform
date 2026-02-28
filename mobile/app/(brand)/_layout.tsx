import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { tokens } from '../../src/theme';

export default function BrandLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: tokens.color.tabActive,
      tabBarInactiveTintColor: tokens.color.tabInactive,
      headerShown: false,
      tabBarStyle: {
        backgroundColor: tokens.color.tabBg,
        borderTopWidth: 1,
        borderTopColor: tokens.color.tabBorder,
        ...(Platform.OS === 'web' ? {
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          position: 'relative' as const,
        } : {}),
      },
      tabBarLabelStyle: {
        fontFamily: tokens.font.family.semibold,
        fontSize: 12,
      },
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campaigns/index"
        options={{
          title: 'Campaigns',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved-lists"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
      {/* Hide detail/create screens from tab bar */}
      <Tabs.Screen name="campaigns/create" options={{ href: null }} />
      <Tabs.Screen name="campaigns/[id]" options={{ href: null }} />
      <Tabs.Screen name="influencer/[id]" options={{ href: null }} />
    </Tabs>
  );
}
