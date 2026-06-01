// import React, { useState } from 'react';
// import {
//   View, StyleSheet, ScrollView, TouchableOpacity, Platform } from
// 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";
// import { getVisualOrderStatus } from '../../utils/orderWorkflow';


// const STATUS_CONFIG = {
//   confirmed: { label: 'Confirmed', color: COLORS.info, emoji: '✅', bg: '#E8F4FD' },
//   packed: { label: 'Packed', color: COLORS.teal, emoji: '📦', bg: '#E0F7F7' },
//   sent_to_logistics: { label: 'At Logistics', color: COLORS.warning, emoji: '🏭', bg: '#FFF8E7' },
//   processing: { label: 'Processing', color: COLORS.warning, emoji: '⚙️', bg: '#FFF8E7' },
//   shipped: { label: 'Shipped', color: COLORS.green, emoji: '🚚', bg: '#E8F7EE' },
//   delivered: { label: 'Delivered', color: COLORS.success, emoji: '🎉', bg: '#E6F9F0' },
//   cancelled: { label: 'Cancelled', color: COLORS.error, emoji: '❌', bg: '#FDECEA' }
// };

// const FILTER_TABS = ['all', 'active', 'delivered', 'cancelled'];
// const FILTER_LABEL_MAP = { all: 'All', active: 'Active', delivered: 'Delivered', cancelled: 'Cancelled' };

// function OrderCard({ order, onPress }) {
//   const visualStatus = getVisualOrderStatus(order);
//   const status = STATUS_CONFIG[visualStatus] || STATUS_CONFIG.confirmed;

//   return (
//     <TouchableOpacity onPress={() => onPress(order)} style={styles.card} activeOpacity={0.88}>
//       {/* Card Header */}
//       <View style={styles.cardHeader}>
//         <View>
//           <Text style={styles.orderId}>#{order.id}</Text>
//           <Text style={styles.orderDate}>📅 {order.date}</Text>
//         </View>
//         <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
//           <Text style={{ fontSize: 12 }}>{status.emoji}</Text>
//           <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       {/* Order Info Grid */}
//       <View style={styles.infoGrid}>
//         <View style={styles.infoCell}>
//           <Text style={styles.infoLabel}>{"Items"}</Text>
//           <Text style={styles.infoVal}>{order.items?.length || 0} item(s)</Text>
//         </View>
//         <View style={styles.infoCell}>
//           <Text style={styles.infoLabel}>{"Total"}</Text>
//           <Text style={[styles.infoVal, { color: COLORS.saffron, fontWeight: '700' }]}>₹{order.total}</Text>
//         </View>
//       </View>

//       {/* Tracking */}
//       <View style={styles.trackingRow}>
//         <Text style={styles.trackingDot}>●</Text>
//         <Text style={styles.trackingText}>{order.tracking}</Text>
//       </View>

//       {/* CTA */}
//       <LinearGradient
//         colors={[COLORS.saffron + '15', COLORS.gold + '10']}
//         style={styles.ctaBar}>
        
//         <Text style={styles.ctaText}>{"View Details"} →</Text>
//       </LinearGradient>
//     </TouchableOpacity>);

// }

// export default function OrderHistoryScreen({ navigation }) {
//   const { orders } = useStore();const lang = useAppLanguage();

//   const [activeFilter, setActiveFilter] = useState('all');

//   const goBack = () => {
//     if (navigation.canGoBack()) navigation.goBack();else
//     navigation.navigate('Profile');
//   };

//   const filteredOrders = orders.filter((o) => {
//     if (activeFilter === 'all') return true;
//     if (activeFilter === 'active') return ['confirmed', 'processing', 'packed', 'sent_to_logistics', 'shipped'].includes(o.status);
//     if (activeFilter === 'delivered') return o.status === 'delivered';
//     if (activeFilter === 'cancelled') return o.status === 'cancelled';
//     return true;
//   });

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={goBack} style={styles.backBtn}>
//           <Text style={styles.backText}>{"← Back"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{"My Orders"}</Text>
//         <Text style={styles.orderCount}>{orders.length} {"Orders".toLowerCase()}</Text>
//       </View>

//       {/* Filter Tabs */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.filterRow}
//         style={styles.filterScroll}>
        
//         {FILTER_TABS.map((tab) =>
//         <TouchableOpacity
//           key={tab}
//           onPress={() => setActiveFilter(tab)}
//           style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}>
          
//             <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
//               {FILTER_LABEL_MAP[tab]}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>

//       {/* Orders List */}
//       {filteredOrders.length === 0 ?
//       <View style={styles.emptyContainer}>
//           <Text style={styles.emptyEmoji}>📦</Text>
//           <Text style={styles.emptyTitle}>{"No orders here"}</Text>
//           <Text style={styles.emptySubtitle}>
//             {activeFilter === 'all' ? "Your orders will appear here once you shop" :

//           `${"No orders here"}`}
//           </Text>
//         </View> :

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}>
        
//           {filteredOrders.map((order) =>
//         <OrderCard
//           key={order.id}
//           order={order}
//           onPress={(o) => navigation.navigate('OrderDetail', { orderId: o.id, order: o })} />

//         )}
//           <View style={{ height: 30 }} />
//         </ScrollView>
//       }
//     </View>);

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

//   header: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
//     backgroundColor: COLORS.darkCard, ...SHADOWS.small
//   },
//   backBtn: { paddingVertical: 4, paddingRight: 8 },
//   backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '600' },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
//   orderCount: { fontSize: 13, color: COLORS.textMuted },

//   filterScroll: { flexGrow: 0, backgroundColor: COLORS.darkCard },
//   filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
//   filterTab: {
//     paddingHorizontal: 18, paddingVertical: 7, borderRadius: 50,
//     backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: 'transparent'
//   },
//   filterTabActive: {
//     backgroundColor: COLORS.saffron, borderColor: COLORS.saffron
//   },
//   filterTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
//   filterTabTextActive: { color: '#fff' },

//   scroll: { flex: 1, minHeight: 0 },
//   list: { padding: 16, flexGrow: 1 },

//   emptyContainer: {
//     flex: 1, alignItems: 'center', justifyContent: 'center',
//     padding: 32
//   },
//   emptyEmoji: { fontSize: 64, marginBottom: 16 },
//   emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
//   emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 20 },

//   // Card styles
//   card: {
//     backgroundColor: COLORS.darkCard, borderRadius: 20, overflow: 'hidden',
//     marginBottom: 14, ...SHADOWS.medium
//   },
//   cardHeader: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
//     padding: 16, paddingBottom: 12
//   },
//   orderId: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
//   orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
//   statusBadge: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5
//   },
//   statusText: { fontSize: 12, fontWeight: '700' },
//   divider: { height: 1, backgroundColor: COLORS.darkCard, marginHorizontal: 16 },

//   infoGrid: {
//     flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 20
//   },
//   infoCell: { alignItems: 'flex-start' },
//   infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
//   infoVal: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', marginTop: 2 },

//   trackingRow: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     paddingHorizontal: 16, paddingBottom: 12
//   },
//   trackingDot: { fontSize: 8, color: COLORS.green },
//   trackingText: { fontSize: 12, color: COLORS.green, fontWeight: '500', flex: 1 },

//   ctaBar: {
//     paddingVertical: 12, paddingHorizontal: 16, alignItems: 'flex-end'
//   },
//   ctaText: { fontSize: 13, fontWeight: '700', color: COLORS.saffron }
// });






import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";
import { getVisualOrderStatus } from '../../utils/orderWorkflow';
import { getConsumerId } from '../../storage/authStorage';


const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: COLORS.info, emoji: '✅', bg: '#E8F4FD' },
  packed: { label: 'Packed', color: COLORS.teal, emoji: '📦', bg: '#E0F7F7' },
  sent_to_logistics: { label: 'At Logistics', color: COLORS.warning, emoji: '🏭', bg: '#FFF8E7' },
  processing: { label: 'Processing', color: COLORS.warning, emoji: '⚙️', bg: '#FFF8E7' },
  shipped: { label: 'Shipped', color: COLORS.green, emoji: '🚚', bg: '#E8F7EE' },
  delivered: { label: 'Delivered', color: COLORS.success, emoji: '🎉', bg: '#E6F9F0' },
  cancelled: { label: 'Cancelled', color: COLORS.error, emoji: '❌', bg: '#FDECEA' }
};

const FILTER_TABS = ['all', 'active', 'delivered', 'cancelled'];
const FILTER_LABEL_MAP = { all: 'All', active: 'Active', delivered: 'Delivered', cancelled: 'Cancelled' };

function OrderCard({ order, onPress }) {
  const visualStatus = getVisualOrderStatus(order);
  const status = STATUS_CONFIG[visualStatus] || STATUS_CONFIG.confirmed;

  return (
    <TouchableOpacity onPress={() => onPress(order)} style={styles.card} activeOpacity={0.88}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderDate}>📅 {order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={{ fontSize: 12 }}>{status.emoji}</Text>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Order Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>{"Items"}</Text>
          <Text style={styles.infoVal}>{order.items?.length || 0} item(s)</Text>
        </View>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>{"Total"}</Text>
          <Text style={[styles.infoVal, { color: COLORS.saffron, fontWeight: '700' }]}>₹{order.total}</Text>
        </View>
      </View>

      {/* Tracking */}
      <View style={styles.trackingRow}>
        <Text style={styles.trackingDot}>●</Text>
        <Text style={styles.trackingText}>{order.tracking}</Text>
      </View>

      {/* CTA */}
      <LinearGradient
        colors={[COLORS.saffron + '15', COLORS.gold + '10']}
        style={styles.ctaBar}>
        
        <Text style={styles.ctaText}>{"View Details"} →</Text>
      </LinearGradient>
    </TouchableOpacity>);

}

export default function OrderHistoryScreen({ navigation }) {
  const { orders, loadConsumerOrders } = useStore();const lang = useAppLanguage();

  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    getConsumerId()
      .then((id) => loadConsumerOrders(id))
      .catch(() => {});
  }, [loadConsumerOrders]);

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();else
    navigation.navigate('Profile');
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return ['confirmed', 'processing', 'packed', 'sent_to_logistics', 'shipped'].includes(o.status);
    if (activeFilter === 'delivered') return o.status === 'delivered';
    if (activeFilter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Orders"}</Text>
        <Text style={styles.orderCount}>{orders.length} {"Orders".toLowerCase()}</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
        keyboardShouldPersistTaps="handled">
        
        {FILTER_TABS.map((tab) =>
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveFilter(tab)}
          style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}>
          
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {FILTER_LABEL_MAP[tab]}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.list,
          filteredOrders.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}>
        
        {filteredOrders.length === 0 ?
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>{"No orders here"}</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all' ? "Your orders will appear here once you shop" :

            `${"No orders here"}`}
            </Text>
          </View> :

        filteredOrders.map((order) =>
          <OrderCard
            key={order.id}
            order={order}
            onPress={(o) => navigation.navigate('OrderDetail', { orderId: o.id, order: o })} />

          )
        }
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  orderCount: { fontSize: 13, color: COLORS.textMuted },

  filterScroll: { flexGrow: 0, backgroundColor: COLORS.darkCard },
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterTab: {
    paddingHorizontal: 18, paddingVertical: 7, borderRadius: 50,
    backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: 'transparent'
  },
  filterTabActive: {
    backgroundColor: COLORS.saffron, borderColor: COLORS.saffron
  },
  filterTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterTabTextActive: { color: '#fff' },

  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {})
  },
  list: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 30,
    flexGrow: 1
  },
  emptyList: {
    flexGrow: 1
  },

  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 20 },

  // Card styles
  card: {
    backgroundColor: COLORS.darkCard, borderRadius: 20, overflow: 'hidden',
    marginBottom: 14, ...SHADOWS.medium
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 16, paddingBottom: 12
  },
  orderId: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.darkCard, marginHorizontal: 16 },

  infoGrid: {
    flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 20
  },
  infoCell: { alignItems: 'flex-start' },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  infoVal: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', marginTop: 2 },

  trackingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingBottom: 12
  },
  trackingDot: { fontSize: 8, color: COLORS.green },
  trackingText: { fontSize: 12, color: COLORS.green, fontWeight: '500', flex: 1 },

  ctaBar: {
    paddingVertical: 12, paddingHorizontal: 16, alignItems: 'flex-end'
  },
  ctaText: { fontSize: 13, fontWeight: '700', color: COLORS.saffron }
});
