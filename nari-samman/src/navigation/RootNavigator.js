import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import ConsumerLoginScreen from '../screens/ConsumerLoginScreen';
import SHGLoginScreen from '../screens/SHGLoginScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import SHGPendingApprovalScreen from '../screens/SHGPendingApprovalScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Consumer
import ConsumerTabs from './ConsumerTabs';
import ProductDetailScreen from '../screens/consumer/ProductDetailScreen';
import CheckoutScreen from '../screens/consumer/CheckoutScreen';
import OrderSuccessScreen from '../screens/consumer/OrderSuccessScreen';
import OrderHistoryScreen from '../screens/consumer/OrderHistoryScreen';
import OrderDetailScreen from '../screens/consumer/OrderDetailScreen';
import NotificationsScreen from '../screens/consumer/NotificationsScreen';
import DeliveryAddressScreen from '../screens/consumer/DeliveryAddressScreen';
import PaymentMethodsScreen from '../screens/consumer/PaymentMethodsScreen';
import ImpactStoryScreen from '../screens/consumer/ImpactStoryScreen';
import HelpSupportScreen from '../screens/consumer/HelpSupportScreen';
import AIAssistantScreen from '../screens/consumer/AIAssistantantScreen';

// Shared
import MultilingualScreen from '../screens/admin/MultilingualScreen';

// Vendor
import VendorStack from './VendorStack';

// Admin
import AdminStack from './AdminStack';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: { opacity: current.progress }
        })
      }}>

      {/* Auth / Onboarding */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="ConsumerLogin" component={ConsumerLoginScreen} />
      <Stack.Screen name="SHGLogin" component={SHGLoginScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="SHGPendingApproval" component={SHGPendingApprovalScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* Consumer Flow */}
      <Stack.Screen name="ConsumerTabs" component={ConsumerTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="DeliveryAddress" component={DeliveryAddressScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="ImpactStory" component={ImpactStoryScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen
        name="AIAssistant"
        component={AIAssistantScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />

      {/* Shared — Language Picker (all roles) */}
      <Stack.Screen name="LanguageSelect" component={MultilingualScreen} />

      {/* Vendor Flow */}
      <Stack.Screen name="VendorStack" component={VendorStack} />

      {/* Admin Flow */}
      <Stack.Screen name="AdminStack" component={AdminStack} />
    </Stack.Navigator>);

}