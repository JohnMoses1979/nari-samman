// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import AdminTabs from './AdminTabs';
// import ProductApprovalScreen from '../screens/admin/ProductApprovalScreen';
// import SHGManagementScreen from '../screens/admin/SHGManagementScreen';
// import AnnouncementsScreen from '../screens/admin/AnnouncementsScreen';
// import OrdersScreen from '../screens/admin/OrdersScreen';
// import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
// import RevenueScreen from '../screens/admin/RevenueScreen';
// import ArtisansScreen from '../screens/admin/ArtisansScreen';
// import ProductsListScreen from '../screens/admin/ProductsListScreen';
// import PayoutRequestsScreen from '../screens/admin/PayoutRequestsScreen';
// import EntrepreneursScreen from '../screens/admin/EntrepreneursScreen';
// import DistributionAgentsScreen from '../screens/admin/DistributionAgentsScreen';
// import ExportMarketScreen from '../screens/admin/ExportMarketScreen';
// import MultilingualScreen from '../screens/admin/MultilingualScreen';
// import NABARDReportsScreen from '../screens/admin/NABARDReportsScreen';
// import TrainingCentreScreen from '../screens/admin/TrainingCentreScreen';

// const Stack = createStackNavigator();

// export default function AdminStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="AdminTabs" component={AdminTabs} />
//       <Stack.Screen name="ProductApproval" component={ProductApprovalScreen} />
//       <Stack.Screen name="SHGManagement" component={SHGManagementScreen} />
//       <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
//       <Stack.Screen name="OrdersList" component={OrdersScreen} />
//       <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} />
//       <Stack.Screen name="Revenue" component={RevenueScreen} />
//       <Stack.Screen name="Artisans" component={ArtisansScreen} />
//       <Stack.Screen name="ProductsList" component={ProductsListScreen} />
//       <Stack.Screen name="PayoutRequests" component={PayoutRequestsScreen} />
//       <Stack.Screen name="Entrepreneurs" component={EntrepreneursScreen} />
//       <Stack.Screen name="DistributionAgents" component={DistributionAgentsScreen} />
//       <Stack.Screen name="ExportMarket" component={ExportMarketScreen} />
//       <Stack.Screen name="Multilingual" component={MultilingualScreen} />
//       <Stack.Screen name="NABARDReports" component={NABARDReportsScreen} />
//       <Stack.Screen name="TrainingCentre" component={TrainingCentreScreen} />
//     </Stack.Navigator>
//   );
// }



















import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminTabs from './AdminTabs';
import ProductApprovalScreen from '../screens/admin/ProductApprovalScreen';
import SHGManagementScreen from '../screens/admin/SHGManagementScreen';
import AnnouncementsScreen from '../screens/admin/AnnouncementsScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
import RevenueScreen from '../screens/admin/RevenueScreen';
import ArtisansScreen from '../screens/admin/ArtisansScreen';
import ProductsListScreen from '../screens/admin/ProductsListScreen';
import PayoutRequestsScreen from '../screens/admin/PayoutRequestsScreen';
import EntrepreneursScreen from '../screens/admin/EntrepreneursScreen';
import DistributionAgentsScreen from '../screens/admin/DistributionAgentsScreen';
import ExportMarketScreen from '../screens/admin/ExportMarketScreen';
import MultilingualScreen from '../screens/admin/MultilingualScreen';
import NABARDReportsScreen from '../screens/admin/NABARDReportsScreen';
import TrainingCentreScreen from '../screens/admin/TrainingCentreScreen';

// ── NEW: KYC Review ──────────────────────────────────────────────────────────
import AdminKycReviewScreen from '../screens/admin/AdminKycReviewScreen';

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs"         component={AdminTabs} />
      <Stack.Screen name="ProductApproval"   component={ProductApprovalScreen} />
      <Stack.Screen name="SHGManagement"     component={SHGManagementScreen} />
      <Stack.Screen name="Announcements"     component={AnnouncementsScreen} />
      <Stack.Screen name="OrdersList"        component={OrdersScreen} />
      <Stack.Screen name="AdminOrderDetail"  component={AdminOrderDetailScreen} />
      <Stack.Screen name="Revenue"           component={RevenueScreen} />
      <Stack.Screen name="Artisans"          component={ArtisansScreen} />
      <Stack.Screen name="ProductsList"      component={ProductsListScreen} />
      <Stack.Screen name="PayoutRequests"    component={PayoutRequestsScreen} />
      <Stack.Screen name="Entrepreneurs"     component={EntrepreneursScreen} />
      <Stack.Screen name="DistributionAgents" component={DistributionAgentsScreen} />
      <Stack.Screen name="ExportMarket"      component={ExportMarketScreen} />
      <Stack.Screen name="Multilingual"      component={MultilingualScreen} />
      <Stack.Screen name="NABARDReports"     component={NABARDReportsScreen} />
      <Stack.Screen name="TrainingCentre"    component={TrainingCentreScreen} />

      {/* ── KYC Review (new) ─────────────────────────────────────────────── */}
      <Stack.Screen name="AdminKycReview"    component={AdminKycReviewScreen} />
    </Stack.Navigator>
  );
}