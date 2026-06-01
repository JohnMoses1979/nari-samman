import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VendorTabs from './VendorTabs';
import AddProductScreen from '../screens/vendor/AddProductScreen';
import VendorOrderDetailScreen from '../screens/vendor/VendorOrderDetailScreen';
import TotalEarningsScreen from '../screens/vendor/TotalEarningsScreen';
import PendingPayoutScreen from '../screens/vendor/PendingPayoutScreen';
import VendorBankDetailsScreen from '../screens/vendor/VendorBankDetailsScreen';
import VendorKYCDocumentsScreen from '../screens/vendor/VendorKYCDocumentsScreen';

const Stack = createStackNavigator();

export default function VendorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VendorTabs" component={VendorTabs} />
      <Stack.Screen name="EditProduct" component={AddProductScreen} />
      <Stack.Screen name="VendorOrderDetail" component={VendorOrderDetailScreen} />
      <Stack.Screen name="TotalEarnings" component={TotalEarningsScreen} />
      <Stack.Screen name="PendingPayout" component={PendingPayoutScreen} />
      <Stack.Screen name="VendorBankDetails" component={VendorBankDetailsScreen} />
      <Stack.Screen name="VendorKYCDocuments" component={VendorKYCDocumentsScreen} />
    </Stack.Navigator>
  );
}
