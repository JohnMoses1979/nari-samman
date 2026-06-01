import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

import AdminDashboard from '../screens/admin/AdminDashboard';
import OrdersScreen from '../screens/admin/OrdersScreen';
import LogisticsScreen from '../screens/admin/LogisticsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, badgeCount }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.emoji}>{emoji}</Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
      <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function AdminTabs() {
  const { pendingProducts, payoutRequests, pendingSHGRegistrations } = useStore();
  const pendingPayouts = (payoutRequests || []).filter((r) => r.status === 'requested').length;
  const pendingSHGs = (pendingSHGRegistrations || []).filter((r) => r.status === 'pending').length;
  const adminAlertCount = (pendingProducts || []).length + pendingPayouts + pendingSHGs;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: COLORS.creamDark,
          height: 70,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} badgeCount={adminAlertCount} /> }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📦" label="Orders" focused={focused} /> }}
      />
      <Tab.Screen
        name="Logistics"
        component={LogisticsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🚚" label="Logistics" focused={focused} /> }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Reports" focused={focused} /> }}
      />
      <Tab.Screen
        name="AdminSettings"
        component={AdminSettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 6, width: 64, position: 'relative' },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '500', color: COLORS.textMuted, marginTop: 2 },
  labelFocused: { color: COLORS.saffron, fontWeight: '700' },
  badge: { position: 'absolute', top: 2, right: 4, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
