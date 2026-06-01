// import React from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';

// import useStore from '../../store/useStore';
// import Text from '../../autoTranslation/AutoText';
// import useAppLanguage from '../../autoTranslation/useAppLanguage';
// import { formatText } from '../../autoTranslation/formatText';

// const TYPE_CONFIG = {
//   order: { bg: COLORS.green + '20', icon: '📦', color: COLORS.green },
//   promo: { bg: COLORS.purple + '20', icon: '🎉', color: COLORS.purple },
//   offer: { bg: COLORS.saffron + '20', icon: '🏷️', color: COLORS.saffron },
//   system: { bg: COLORS.info + '20', icon: '🔔', color: COLORS.info },
//   payment: { bg: COLORS.gold + '20', icon: '💰', color: COLORS.gold },
//   approval: { bg: COLORS.warning + '20', icon: '✅', color: COLORS.warning },
//   logistics: { bg: COLORS.teal + '20', icon: '🚚', color: COLORS.teal },
// };

// function buildConsumerNotifications(notifications) {
//   return (notifications || []).map((n) => ({
//     id: n.id,
//     type: n.type || 'system',
//     read: Boolean(n.read),
//     time: n.time || 'Just now',
//     title: n.title || (n.type === 'order' ? 'Order Update' : 'Notification'),
//     message: n.message || '',
//     cta: n.type === 'order' ? 'View Orders' : null,
//   }));
// }

// function buildVendorNotifications(vendorNotifications, vendorOrders) {
//   const payoutItems = (vendorNotifications || []).map((n) => ({
//     id: n.id,
//     type: n.type?.includes('payment') || n.type?.includes('payout') ? 'payment' : 'system',
//     read: Boolean(n.read),
//     time: n.time || 'Just now',
//     title: n.title || 'Vendor Update',
//     message: n.message || 'You have a new vendor notification.',
//     cta: null,
//   }));

//   const orderItems = [...(vendorOrders || [])]
//     .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
//     .slice(0, 8)
//     .map((o) => ({
//       id: `vendor_order_${o.id}`,
//       type: 'order',
//       read: ['delivered', 'cancelled'].includes(o.status),
//       time: o.date || 'Recently',
//       title: `Order ${String(o.status || 'confirmed').replace(/_/g, ' ')}`,
//       message: `${o.buyer || 'Customer'} ordered ${o.item || 'product'} for ₹${Number(o.amount || 0).toLocaleString()}. Current stage: ${String(o.status || 'confirmed').replace(/_/g, ' ')}.`,
//       cta: 'Open Order',
//     }));

//   return [...payoutItems, ...orderItems];
// }

// function buildAdminNotifications({ pendingProducts, pendingSHGRegistrations, payoutRequests, vendorOrders }) {
//   const productItems = (pendingProducts || []).slice(0, 8).map((p) => ({
//     id: `admin_product_${p.id}`,
//     type: 'approval',
//     read: false,
//     time: 'Pending',
//     title: 'Product Approval Pending',
//     message: `${p.name} from ${p.category || 'vendor'} is waiting for approval.`,
//     cta: 'Review Product',
//   }));

//   const shgItems = (pendingSHGRegistrations || []).filter((r) => r.status === 'pending').slice(0, 6).map((r) => ({
//     id: `admin_shg_${r.id}`,
//     type: 'approval',
//     read: false,
//     time: 'Pending',
//     title: 'SHG Registration Pending',
//     message: `${r.shgName || r.name || 'New SHG'} is waiting for verification.`,
//     cta: 'Review SHG',
//   }));

//   const payoutItems = (payoutRequests || []).filter((r) => r.status === 'requested').slice(0, 6).map((r) => ({
//     id: `admin_payout_${r.id}`,
//     type: 'payment',
//     read: false,
//     time: 'Pending',
//     title: 'Payout Request Pending',
//     message: `Vendor payout of ₹${Number(r.amount || 0).toLocaleString()} needs approval.`,
//     cta: 'Open Payouts',
//   }));

//   const logisticsItems = (vendorOrders || []).filter((o) => !['delivered', 'cancelled'].includes(o.status)).slice(0, 6).map((o) => ({
//     id: `admin_logistics_${o.id}`,
//     type: 'logistics',
//     read: true,
//     time: o.date || 'Recently',
//     title: 'Live Delivery Stage',
//     message: `${o.item || 'Order'} is currently ${String(o.status || 'confirmed').replace(/_/g, ' ')}.`,
//     cta: 'Track Order',
//   }));

//   return [...productItems, ...shgItems, ...payoutItems, ...logisticsItems];
// }

// export default function NotificationsScreen({ navigation, route }) {
//   const lang = useAppLanguage();
//   const roleFromRoute = route?.params?.role;
//   const {
//     currentRole,
//     notifications,
//     vendorNotifications,
//     vendorOrders,
//     pendingProducts,
//     pendingSHGRegistrations,
//     payoutRequests,
//     markNotificationRead,
//     markVendorNotifRead,
//   } = useStore();

//   const role = roleFromRoute || currentRole || 'consumer';
//   const list = role === 'admin'
//     ? buildAdminNotifications({ pendingProducts, pendingSHGRegistrations, payoutRequests, vendorOrders })
//     : role === 'vendor'
//       ? buildVendorNotifications(vendorNotifications, vendorOrders)
//       : buildConsumerNotifications(notifications);

//   const unreadCount = list.filter((n) => !n.read).length;
//   const title = role === 'admin' ? 'Admin Notifications 🔔' : role === 'vendor' ? 'Vendor Notifications 🔔' : 'Notifications 🔔';

//   const handlePress = (item) => {
//     if (role === 'vendor' && item.id && !item.id.startsWith('vendor_order_')) {
//       markVendorNotifRead && markVendorNotifRead(item.id);
//     }
//     if (role === 'consumer') {
//       markNotificationRead && markNotificationRead(item.id);
//     }

//     if (role === 'admin') {
//       if (item.id.startsWith('admin_product_')) navigation.navigate('AdminStack', { screen: 'ProductApproval' });
//       else if (item.id.startsWith('admin_shg_')) navigation.navigate('AdminStack', { screen: 'SHGManagement' });
//       else if (item.id.startsWith('admin_payout_')) navigation.navigate('AdminStack', { screen: 'PayoutRequests' });
//       else if (item.id.startsWith('admin_logistics_')) navigation.navigate('AdminStack', { screen: 'AdminTabs', params: { screen: 'Logistics' } });
//     } else if (role === 'vendor' && item.id.startsWith('vendor_order_')) {
//       const orderId = item.id.replace('vendor_order_', '');
//       const order = (vendorOrders || []).find((o) => o.id === orderId);
//       if (order) navigation.navigate('VendorStack', { screen: 'VendorOrderDetail', params: { order } });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>{'← Back'}</Text>
//         </TouchableOpacity>
//         <View style={styles.headerBottom}>
//           <View>
//             <Text style={styles.headerTitle}>{title}</Text>
//             <Text style={styles.headerSub}>{formatText('{n} unread', { n: unreadCount })}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}>
//         {unreadCount > 0 && (
//           <View style={styles.unreadHeader}>
//             <View style={styles.unreadDot} />
//             <Text style={styles.unreadLabel}>{'New'}</Text>
//           </View>
//         )}

//         {list.length === 0 ? (
//           <View style={styles.empty}>
//             <Text style={styles.emptyEmoji}>🔕</Text>
//             <Text style={styles.emptyText}>{'No notifications yet'}</Text>
//           </View>
//         ) : (
//           list.map((item, index) => {
//             const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
//             return (
//               <TouchableOpacity
//                 key={item.id}
//                 style={[styles.notifCard, !item.read && styles.notifCardUnread, index > 0 && { marginTop: 10 }]}
//                 activeOpacity={0.85}
//                 onPress={() => handlePress(item)}>
//                 {!item.read && <View style={styles.unreadIndicator} />}
//                 <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
//                   <Text style={styles.iconEmoji}>{cfg.icon}</Text>
//                 </View>
//                 <View style={styles.notifContent}>
//                   <View style={styles.notifTop}>
//                     <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
//                       {item.title}
//                     </Text>
//                     <Text style={styles.notifTime}>{item.time}</Text>
//                   </View>
//                   <Text style={styles.notifMessage} numberOfLines={3}>{item.message}</Text>
//                   {item.cta && (
//                     <View style={[styles.ctaBtn, { backgroundColor: cfg.bg }]}> 
//                       <Text style={[styles.ctaText, { color: cfg.color }]}>{item.cta} →</Text>
//                     </View>
//                   )}
//                 </View>
//               </TouchableOpacity>
//             );
//           })
//         )}
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   scroll: { flex: 1, minHeight: 0 },
//   header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
//   backBtn: { marginBottom: 16 },
//   backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
//   headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
//   headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
//   headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4 },
//   list: { padding: 16, paddingBottom: 30 },
//   unreadHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
//   unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.saffron },
//   unreadLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
//   notifCard: {
//     flexDirection: 'row', gap: 14,
//     backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16,
//     ...SHADOWS.small, position: 'relative', overflow: 'hidden'
//   },
//   notifCardUnread: {
//     backgroundColor: COLORS.saffron + '08',
//     borderWidth: 1, borderColor: COLORS.saffron + '25'
//   },
//   unreadIndicator: {
//     position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
//     backgroundColor: COLORS.saffron, borderTopLeftRadius: 18, borderBottomLeftRadius: 18
//   },
//   iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
//   iconEmoji: { fontSize: 22 },
//   notifContent: { flex: 1 },
//   notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
//   notifTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, flex: 1, paddingRight: 8, textTransform: 'capitalize' },
//   notifTitleUnread: { fontWeight: '800', color: COLORS.textPrimary },
//   notifTime: { fontSize: 11, color: COLORS.textMuted, flexShrink: 0 },
//   notifMessage: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
//   ctaBtn: { marginTop: 10, alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
//   ctaText: { fontSize: 12, fontWeight: '700' },
//   empty: { alignItems: 'center', paddingTop: 80 },
//   emptyEmoji: { fontSize: 56, marginBottom: 14 },
//   emptyText: { fontSize: 16, color: COLORS.textMuted },
// });









import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import Text from '../../autoTranslation/AutoText';
import useAppLanguage from '../../autoTranslation/useAppLanguage';
import { formatText } from '../../autoTranslation/formatText';

const TYPE_CONFIG = {
  order: { bg: COLORS.green + '20', icon: '📦', color: COLORS.green },
  promo: { bg: COLORS.purple + '20', icon: '🎉', color: COLORS.purple },
  offer: { bg: COLORS.saffron + '20', icon: '🏷️', color: COLORS.saffron },
  system: { bg: COLORS.info + '20', icon: '🔔', color: COLORS.info },
  payment: { bg: COLORS.gold + '20', icon: '💰', color: COLORS.gold },
  approval: { bg: COLORS.warning + '20', icon: '✅', color: COLORS.warning },
  logistics: { bg: COLORS.teal + '20', icon: '🚚', color: COLORS.teal },
};

function buildConsumerNotifications(notifications) {
  return (notifications || []).map((n) => ({
    id: n.id,
    type: n.type || 'system',
    read: Boolean(n.read),
    time: n.time || 'Just now',
    title: n.title || (n.type === 'order' ? 'Order Update' : 'Notification'),
    message: n.message || '',
    cta: n.type === 'order' ? 'View Orders' : null,
  }));
}

function buildVendorNotifications(vendorNotifications, vendorOrders) {
  const payoutItems = (vendorNotifications || []).map((n) => ({
    id: n.id,
    type: n.type?.includes('payment') || n.type?.includes('payout') ? 'payment' : 'system',
    read: Boolean(n.read),
    time: n.time || 'Just now',
    title: n.title || 'Vendor Update',
    message: n.message || 'You have a new vendor notification.',
    cta: null,
  }));

  const orderItems = [...(vendorOrders || [])]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8)
    .map((o) => ({
      id: `vendor_order_${o.id}`,
      type: 'order',
      read: ['delivered', 'cancelled'].includes(o.status),
      time: o.date || 'Recently',
      title: `Order ${String(o.status || 'confirmed').replace(/_/g, ' ')}`,
      message: `${o.buyer || 'Customer'} ordered ${o.item || 'product'} for ₹${Number(o.amount || 0).toLocaleString()}. Current stage: ${String(o.status || 'confirmed').replace(/_/g, ' ')}.`,
      cta: 'Open Order',
    }));

  return [...payoutItems, ...orderItems];
}

function buildAdminNotifications({ pendingProducts, pendingSHGRegistrations, payoutRequests, vendorOrders }) {
  const productItems = (pendingProducts || []).slice(0, 8).map((p) => ({
    id: `admin_product_${p.id}`,
    type: 'approval',
    read: false,
    time: 'Pending',
    title: 'Product Approval Pending',
    message: `${p.name} from ${p.category || 'vendor'} is waiting for approval.`,
    cta: 'Review Product',
  }));

  const shgItems = (pendingSHGRegistrations || [])
    .filter((r) => r.status === 'pending')
    .slice(0, 6)
    .map((r) => ({
      id: `admin_shg_${r.id}`,
      type: 'approval',
      read: false,
      time: 'Pending',
      title: 'SHG Registration Pending',
      message: `${r.shgName || r.name || 'New SHG'} is waiting for verification.`,
      cta: 'Review SHG',
    }));

  const payoutItems = (payoutRequests || [])
    .filter((r) => r.status === 'requested')
    .slice(0, 6)
    .map((r) => ({
      id: `admin_payout_${r.id}`,
      type: 'payment',
      read: false,
      time: 'Pending',
      title: 'Payout Request Pending',
      message: `Vendor payout of ₹${Number(r.amount || 0).toLocaleString()} needs approval.`,
      cta: 'Open Payouts',
    }));

  const logisticsItems = (vendorOrders || [])
    .filter((o) => !['delivered', 'cancelled'].includes(o.status))
    .slice(0, 6)
    .map((o) => ({
      id: `admin_logistics_${o.id}`,
      type: 'logistics',
      read: true,
      time: o.date || 'Recently',
      title: 'Live Delivery Stage',
      message: `${o.item || 'Order'} is currently ${String(o.status || 'confirmed').replace(/_/g, ' ')}.`,
      cta: 'Track Order',
    }));

  return [...productItems, ...shgItems, ...payoutItems, ...logisticsItems];
}

export default function NotificationsScreen({ navigation, route }) {
  const lang = useAppLanguage();
  const roleFromRoute = route?.params?.role;

  const {
    currentRole,
    notifications,
    vendorNotifications,
    vendorOrders,
    pendingProducts,
    pendingSHGRegistrations,
    payoutRequests,
    markNotificationRead,
    markVendorNotifRead,
  } = useStore();

  const role = roleFromRoute || currentRole || 'consumer';

  const list = role === 'admin'
    ? buildAdminNotifications({ pendingProducts, pendingSHGRegistrations, payoutRequests, vendorOrders })
    : role === 'vendor'
      ? buildVendorNotifications(vendorNotifications, vendorOrders)
      : buildConsumerNotifications(notifications);

  const unreadCount = list.filter((n) => !n.read).length;

  const title =
    role === 'admin'
      ? 'Admin Notifications 🔔'
      : role === 'vendor'
        ? 'Vendor Notifications 🔔'
        : 'Notifications 🔔';

  const handlePress = (item) => {
    if (role === 'vendor' && item.id && !item.id.startsWith('vendor_order_')) {
      markVendorNotifRead && markVendorNotifRead(item.id);
    }

    if (role === 'consumer') {
      markNotificationRead && markNotificationRead(item.id);
    }

    if (role === 'admin') {
      if (item.id.startsWith('admin_product_')) {
        navigation.navigate('AdminStack', { screen: 'ProductApproval' });
      } else if (item.id.startsWith('admin_shg_')) {
        navigation.navigate('AdminStack', { screen: 'SHGManagement' });
      } else if (item.id.startsWith('admin_payout_')) {
        navigation.navigate('AdminStack', { screen: 'PayoutRequests' });
      } else if (item.id.startsWith('admin_logistics_')) {
        navigation.navigate('AdminStack', { screen: 'AdminTabs', params: { screen: 'Logistics' } });
      }
    } else if (role === 'vendor' && item.id.startsWith('vendor_order_')) {
      const orderId = item.id.replace('vendor_order_', '');
      const order = (vendorOrders || []).find((o) => o.id === orderId);

      if (order) {
        navigation.navigate('VendorStack', {
          screen: 'VendorOrderDetail',
          params: { order },
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'← Back'}</Text>
        </TouchableOpacity>

        <View style={styles.headerBottom}>
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSub}>{formatText('{n} unread', { n: unreadCount })}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {unreadCount > 0 && (
          <View style={styles.unreadHeader}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadLabel}>{'New'}</Text>
          </View>
        )}

        {list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔕</Text>
            <Text style={styles.emptyText}>{'No notifications yet'}</Text>
          </View>
        ) : (
          list.map((item, index) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notifCard,
                  !item.read && styles.notifCardUnread,
                  index > 0 && { marginTop: 10 },
                ]}
                activeOpacity={0.85}
                onPress={() => handlePress(item)}
              >
                {!item.read && <View style={styles.unreadIndicator} />}

                <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
                  <Text style={styles.iconEmoji}>{cfg.icon}</Text>
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                      {item.title}
                    </Text>

                    <Text style={styles.notifTime}>{item.time}</Text>
                  </View>

                  <Text style={styles.notifMessage} numberOfLines={3}>
                    {item.message}
                  </Text>

                  {item.cta && (
                    <View style={[styles.ctaBtn, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.ctaText, { color: cfg.color }]}>{item.cta} →</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.dark,
  },

  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },

  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  backBtn: {
    marginBottom: 16,
  },

  backText: {
    fontSize: 14,
    color: 'rgba(200,208,228,0.7)',
    fontWeight: '600',
  },

  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },

  headerSub: {
    fontSize: 13,
    color: 'rgba(200,208,228,0.5)',
    marginTop: 4,
  },

  list: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 30,
    flexGrow: 1,
  },

  unreadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.saffron,
  },

  unreadLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  notifCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    padding: 16,
    ...SHADOWS.small,
    position: 'relative',
    overflow: 'hidden',
  },

  notifCardUnread: {
    backgroundColor: COLORS.saffron + '08',
    borderWidth: 1,
    borderColor: COLORS.saffron + '25',
  },

  unreadIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.saffron,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  iconEmoji: {
    fontSize: 22,
  },

  notifContent: {
    flex: 1,
  },

  notifTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },

  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: 8,
    textTransform: 'capitalize',
  },

  notifTitleUnread: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  notifTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    flexShrink: 0,
  },

  notifMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },

  ctaBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  ctaText: {
    fontSize: 12,
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyEmoji: {
    fontSize: 56,
    marginBottom: 14,
  },

  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
});
