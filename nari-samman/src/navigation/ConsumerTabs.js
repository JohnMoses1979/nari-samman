import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import HomeScreen from '../screens/consumer/HomeScreen';
import ExploreScreen from '../screens/consumer/ExploreScreen';
import CartScreen from '../screens/consumer/CartScreen';
import WishlistScreen from '../screens/consumer/WishlistScreen';
import ProfileScreen from '../screens/consumer/ProfileScreen';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused, badgeCount }) {
  return (
    <View style={[tabStyles.tabItem, focused && tabStyles.tabItemFocused]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      {badgeCount > 0 ? (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badgeCount}</Text>
        </View>
      ) : null}
      <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    width: 64,
    position: 'relative',
  },
  tabItemFocused: {},
  emoji: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '500', color: COLORS.textMuted, marginTop: 2 },
  labelFocused: { color: COLORS.saffron, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 4,
    backgroundColor: COLORS.bengalRed,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

export default function ConsumerTabs() {
  const { getCartCount } = useStore();
  const cartCount = getCartCount();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        sceneContainerStyle={{
          flex: 1,
          minHeight: 0,
          backgroundColor: COLORS.dark,
        }}
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
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🏠" label="Home" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🔍" label="Explore" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🛒" label="Cart" focused={focused} badgeCount={cartCount} />
            ),
          }}
        />

        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="❤️" label="Wishlist" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="👤" label="Profile" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
