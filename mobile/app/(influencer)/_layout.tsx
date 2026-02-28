import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { tokens } from '../../src/theme';

export default function InfluencerLayout() {
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
        name="campaigns"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
      {/* Hide detail screens from tab bar */}
      <Tabs.Screen name="campaign/[id]" options={{ href: null }} />
      <Tabs.Screen name="profile-edit" options={{ href: null }} />
    </Tabs>
  );
}
