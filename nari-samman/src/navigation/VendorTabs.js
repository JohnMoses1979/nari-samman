import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { COLORS } from '../theme/colors';

import VendorDashboard from '../screens/vendor/VendorDashboard';
import AddProductScreen from '../screens/vendor/AddProductScreen';
import ManageProductsScreen from '../screens/vendor/ManageProductsScreen';
import VendorOrdersScreen from '../screens/vendor/VendorOrdersScreen';
import VendorProfileScreen from '../screens/vendor/VendorProfileScreen';
import VendorBankDetailsScreen from '../screens/vendor/VendorBankDetailsScreen';
import VendorKYCDocumentsScreen from '../screens/vendor/VendorKYCDocumentsScreen';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';

const Tab = createBottomTabNavigator();

function showLockedMessage(status) {
  const message = status === 'pending_admin'
    ? 'Your product, KYC, and bank details are submitted. Remaining screens will open after admin approval.'
    : 'Complete Product Details, KYC Documents, and Bank Details first. Other screens will open after admin approval.';

  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert('Locked Until Approval', message);
  }
}

function TabIcon({ emoji, label, focused, badgeCount, locked }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.emoji, locked && styles.lockedEmoji]}>{locked ? '🔒' : emoji}</Text>
      {badgeCount > 0 && !locked && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
      <Text style={[styles.label, focused && styles.labelFocused, locked && styles.lockedLabel]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function VendorTabs() {
  const { vendorOrders, vendorNotifications, vendorOnboarding } = useStore();
  const pendingOrders = (vendorOrders || []).filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const unreadVendorNotifications = (vendorNotifications || []).filter((n) => !n.read).length;

  const onboardingStatus = vendorOnboarding?.status || 'approved';
  const isApproved = onboardingStatus === 'approved';
  const isWaitingApproval = onboardingStatus === 'pending_admin';

  const blockWhenWaiting = ({ navigation }) => ({
    tabPress: (e) => {
      if (isWaitingApproval) {
        e.preventDefault();
        showLockedMessage(onboardingStatus);
        navigation.navigate('VendorDashboard');
      }
    },
  });

  const blockUntilApproved = ({ navigation }) => ({
    tabPress: (e) => {
      if (!isApproved) {
        e.preventDefault();
        showLockedMessage(onboardingStatus);
        navigation.navigate('VendorDashboard');
      }
    },
  });

  const baseScreenOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: COLORS.creamDark,
      height: 70,
      paddingBottom: 10,
    },
    tabBarShowLabel: false,
  };

  if (!isApproved) {
    return (
      <Tab.Navigator screenOptions={baseScreenOptions}>
        <Tab.Screen
          name="VendorDashboard"
          component={VendorDashboard}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
        />
        <Tab.Screen
          name="AddProduct"
          component={AddProductScreen}
          listeners={blockWhenWaiting}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Product" focused={focused} locked={isWaitingApproval} /> }}
        />
        <Tab.Screen
          name="VendorKYCDocuments"
          component={VendorKYCDocumentsScreen}
          listeners={blockWhenWaiting}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🪪" label="KYC" focused={focused} locked={isWaitingApproval} /> }}
        />
        <Tab.Screen
          name="VendorBankDetails"
          component={VendorBankDetailsScreen}
          listeners={blockWhenWaiting}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏦" label="Bank" focused={focused} locked={isWaitingApproval} /> }}
        />
        <Tab.Screen
          name="VendorProfile"
          component={VendorProfileScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} badgeCount={unreadVendorNotifications} /> }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={baseScreenOptions}>
      <Tab.Screen
        name="VendorDashboard"
        component={VendorDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="ManageProducts"
        component={ManageProductsScreen}
        listeners={blockUntilApproved}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Products" focused={focused} /> }}
      />
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        listeners={blockUntilApproved}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="➕" label="Add" focused={focused} /> }}
      />
      <Tab.Screen
        name="VendorOrders"
        component={VendorOrdersScreen}
        listeners={blockUntilApproved}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📦" label="Orders" focused={focused} badgeCount={pendingOrders} /> }}
      />
      <Tab.Screen
        name="VendorProfile"
        component={VendorProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Settings" focused={focused} badgeCount={unreadVendorNotifications} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingTop: 6, width: 64, position: 'relative' },
  emoji: { fontSize: 22 },
  lockedEmoji: { opacity: 0.55 },
  label: { fontSize: 10, fontWeight: '500', color: COLORS.textMuted, marginTop: 2 },
  labelFocused: { color: COLORS.saffron, fontWeight: '700' },
  lockedLabel: { color: COLORS.textMuted, opacity: 0.7 },
  badge: { position: 'absolute', top: 2, right: 4, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
