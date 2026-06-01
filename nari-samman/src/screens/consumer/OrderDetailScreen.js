// import React, { useEffect, useState } from 'react';
// import {
//   View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from
// 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';

// import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";
// import { ORDER_FLOW_STEPS, getFlowIndex, getVisualOrderStatus, buildReadableTimeline, findDispatchForOrder, PAYMENT_LABELS } from '../../utils/orderWorkflow';

// const STATUS_STEPS = ORDER_FLOW_STEPS.map((step) => step.key);

// const STATUS_CONFIG = {
//   confirmed: { label: 'Order Confirmed', emoji: '✅', color: COLORS.info, desc: 'Your order has been received. Vendor is preparing your items.' },
//   packed: { label: 'Packed & Ready', emoji: '📦', color: COLORS.teal, desc: 'Items packed and quality-checked. Ready for logistics.' },
//   sent_to_logistics: { label: 'At Logistics Hub', emoji: '🏭', color: COLORS.warning, desc: 'Order reached IS&SF logistics hub. Dispatch team is preparing shipment.' },
//   processing: { label: 'Being Processed', emoji: '⚙️', color: COLORS.warning, desc: 'Our team is quality-checking and packing your items.' },
//   shipped: { label: 'Shipped / In Transit', emoji: '🚚', color: COLORS.green, desc: 'Your order is on the way! Logistics partner is moving it to your address.' },
//   delivered: { label: 'Delivered', emoji: '🎉', color: COLORS.success, desc: 'Your order has been delivered. Thank you for supporting SHG artisans!' },
//   cancelled: { label: 'Cancelled', emoji: '❌', color: COLORS.error, desc: 'This order was cancelled.' }
// };

// export default function OrderDetailScreen({ route, navigation }) {const lang = useAppLanguage();

//   const routeOrder = route.params?.order;
//   const routeOrderId = route.params?.orderId || routeOrder?.id;
//   const { products, orders, dispatches } = useStore();
//   const order = orders.find((o) => o.id === routeOrderId) || routeOrder || {};
//   const dispatch = findDispatchForOrder(dispatches, order.id, 'consumer');
//   const visualStatus = getVisualOrderStatus(order);
//   const timeline = buildReadableTimeline(order, dispatch);
//   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
//   const [showCancelSuccess, setShowCancelSuccess] = useState(false);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('blur', () => {
//       setShowCancelConfirm(false);
//       setShowCancelSuccess(false);
//     });

//     return unsubscribe;
//   }, [navigation]);

//   const status = STATUS_CONFIG[visualStatus] || STATUS_CONFIG.confirmed;
//   const stepIndex = getFlowIndex(order);

//   // Enrich items with product data — new orders already carry full data
//   const enrichedItems = (order.items || []).map((item) => {
//     const product = products.find((p) => p.id === item.productId);
//     return {
//       ...item,
//       name: item.name || product?.name || 'Product',
//       emoji: item.emoji || product?.emoji || '📦',
//       price: item.price ?? product?.price ?? 0,
//       unit: item.unit || product?.unit || 'piece',
//       image: item.image || product?.image || null
//     };
//   });

//   const handleCancelRequest = () => {
//     if (['shipped', 'delivered'].includes(order.status)) {
//       if (Platform.OS === 'web') {
//         // Show inline cannot cancel message
//         setShowCancelConfirm(false);
//         return;
//       }
//       Alert.alert('Cannot Cancel', 'This order has already been shipped and cannot be cancelled.');
//       return;
//     }
//     setShowCancelConfirm(true);
//   };

//   const confirmCancel = () => {
//     setShowCancelConfirm(false);
//     setShowCancelSuccess(true);
//   };

//   const goBack = () => {
//     if (showCancelSuccess) {
//       setShowCancelSuccess(false);
//     }
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
//         <TouchableOpacity onPress={goBack} style={styles.backBtn}>
//           <Text style={styles.backText}>{"← Back"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.orderIdText}>Order #{order.id}</Text>
//         <Text style={styles.orderDate}>{order.date}</Text>

//         {/* Status Hero */}
//         <View style={styles.statusHero}>
//           <Text style={styles.statusEmoji}>{status.emoji}</Text>
//           <View style={styles.statusInfo}>
//             <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
//             <Text style={styles.statusDesc}>{status.desc}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}>
        
//         {/* Progress Tracker */}
//         {order.status !== 'cancelled' &&
//         <View style={styles.section}>
//             <Text style={styles.sectionTitle}>{"Order Progress"}</Text>
//             <View style={styles.progressTracker}>
//               {STATUS_STEPS.map((step, i) => {
//               const done = i <= stepIndex;
//               const active = i === stepIndex;
//               const cfg = STATUS_CONFIG[step];
//               return (
//                 <View key={step} style={styles.progressItem}>
//                     <View style={styles.progressLeft}>
//                       <View style={[
//                     styles.progressDot,
//                     done ? { backgroundColor: cfg.color } : styles.progressDotInactive,
//                     active && styles.progressDotActive]
//                     }>
//                         <Text style={styles.progressDotEmoji}>{done ? cfg.emoji : '○'}</Text>
//                       </View>
//                       {i < STATUS_STEPS.length - 1 &&
//                     <View style={[styles.progressLine, done && i < stepIndex && { backgroundColor: STATUS_CONFIG[STATUS_STEPS[i]].color }]} />
//                     }
//                     </View>
//                     <View style={styles.progressContent}>
//                       <Text style={[styles.progressLabel, active && { color: cfg.color, fontWeight: '700' }]}>
//                         {cfg.label}
//                       </Text>
//                       {active && <Text style={styles.progressDesc}>{cfg.desc}</Text>}
//                     </View>
//                   </View>);

//             })}
//             </View>
//           </View>
//         }

//         {/* Live Timeline */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>{"Live Delivery Timeline"}</Text>
//           <View style={styles.timelineCard}>
//             {timeline.map((event, i) => (
//               <View key={event.id || i} style={[styles.timelineRow, i > 0 && styles.timelineRowGap]}>
//                 <Text style={styles.timelineDot}>●</Text>
//                 <View style={styles.timelineInfo}>
//                   <Text style={styles.timelineTitle}>{event.title || event.status}</Text>
//                   <Text style={styles.timelineMsg}>{event.message}</Text>
//                   <Text style={styles.timelineMeta}>{event.actor || 'System'} · {event.date || order.date}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Items Ordered */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Items Ordered ({enrichedItems.length})</Text>
//           {enrichedItems.map((item, i) =>
//           <View key={i} style={styles.itemCard}>
//               <View style={styles.itemImgBox}>
//                 <Text style={styles.itemEmoji}>{item.emoji}</Text>
//               </View>
//               <View style={styles.itemInfo}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.itemUnit}>{item.unit}</Text>
//                 <Text style={styles.itemQty}>Qty: {item.qty}</Text>
//               </View>
//               <View style={styles.itemPriceCol}>
//                 <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
//                 <Text style={styles.itemPriceUnit}>₹{item.price} each</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Order Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>{"Price Summary"}</Text>
//           <View style={styles.summaryCard}>
//             {[
//             { label: 'Item Total', value: `₹${order.total}` },
//             { label: 'Delivery Charge', value: order.total >= 499 ? 'FREE 🎉' : '₹60' },
//             { label: 'Packaging', value: '₹0' }].
//             map((row, i) =>
//             <View key={i} style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>{row.label}</Text>
//                 <Text style={[styles.summaryValue, row.value.includes('FREE') && { color: COLORS.success }]}>
//                   {row.value}
//                 </Text>
//               </View>
//             )}
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryRow}>
//               <Text style={styles.totalLabel}>{"Total Paid"}</Text>
//               <Text style={styles.totalValue}>₹{order.total >= 499 ? order.total : order.total + 60}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Delivery Info */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>{"Delivery Details"}</Text>
//           <View style={styles.deliveryCard}>
//             <View style={styles.deliveryRow}>
//               <Text style={styles.deliveryIcon}>📍</Text>
//               <View style={styles.deliveryInfo}>
//                 <Text style={styles.deliveryLabel}>{"Delivery Address"}</Text>
//                 <Text style={styles.deliveryValue}>{order.address}</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Text style={styles.deliveryIcon}>🏭</Text>
//               <View style={styles.deliveryInfo}>
//                 <Text style={styles.deliveryLabel}>{"Dispatched From"}</Text>
//                 <Text style={styles.deliveryValue}>{"Nari Samman Warehouse, Sandeshkhali, N24PGS"}</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Text style={styles.deliveryIcon}>📋</Text>
//               <View style={styles.deliveryInfo}>
//                 <Text style={styles.deliveryLabel}>{"Tracking Status"}</Text>
//                 <Text style={[styles.deliveryValue, { color: COLORS.green }]}>{order.tracking}</Text>
//               </View>
//             </View>
//             <View style={styles.deliveryRow}>
//               <Text style={styles.deliveryIcon}>💳</Text>
//               <View style={styles.deliveryInfo}>
//                 <Text style={styles.deliveryLabel}>{"Payment Status"}</Text>
//                 <Text style={styles.deliveryValue}>{PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus || 'Pending'}</Text>
//               </View>
//             </View>
//             {dispatch && (
//               <View style={styles.deliveryRow}>
//                 <Text style={styles.deliveryIcon}>🚚</Text>
//                 <View style={styles.deliveryInfo}>
//                   <Text style={styles.deliveryLabel}>{"Logistics Details"}</Text>
//                   <Text style={styles.deliveryValue}>
//                     {dispatch.driver || 'Driver not assigned'} · {dispatch.vehicle || 'Vehicle pending'} · ETA {dispatch.eta || 'TBD'}
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* SHG Impact Note */}
//         <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.impactCard}>
//           <Text style={styles.impactEmoji}>🌱</Text>
//           <View style={styles.impactInfo}>
//             <Text style={styles.impactTitle}>{"Thank you for your impact!"}</Text>
//             <Text style={styles.impactText}>
//               Your purchase of ₹{order.total} directly supports SHG artisan women and tribal communities of West Bengal through the IS&SF Nari Samman initiative.
//             </Text>
//           </View>
//         </LinearGradient>

//         {/* Action Buttons */}
//         <View style={styles.actions}>
//           {!['delivered', 'cancelled', 'shipped'].includes(order.status) &&
//           <TouchableOpacity onPress={handleCancelRequest} style={styles.cancelBtn}>
//               <Text style={styles.cancelBtnText}>{"Cancel Order"}</Text>
//             </TouchableOpacity>
//           }
//           <TouchableOpacity
//             onPress={() => {
//               if (Platform.OS !== 'web') {
//                 Alert.alert('Support', 'For order support, contact:\nsupport@narisamman.in\nor call +91 98765 00000');
//               }
//             }}
//             style={styles.supportBtn}>
            
//             <Text style={styles.supportBtnText}>{"🤝 Need Help?"}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 30 }} />
//       </ScrollView>

//       {/* Web-safe Cancel Confirm Modal */}
//       {showCancelConfirm &&
//       <View style={styles.overlay}>
//           <View style={styles.confirmBox}>
//             <Text style={styles.confirmEmoji}>⚠️</Text>
//             <Text style={styles.confirmTitle}>{"Cancel Order?"}</Text>
//             <Text style={styles.confirmMsg}>
//               Are you sure you want to cancel order #{order.id}?
//               {'\n'}A refund will be processed in 3–5 business days.
//             </Text>
//             <View style={styles.confirmBtns}>
//               <TouchableOpacity
//               onPress={() => setShowCancelConfirm(false)}
//               style={styles.keepBtn}>
              
//                 <Text style={styles.keepBtnText}>{"Keep Order"}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={confirmCancel} style={styles.confirmCancelBtn}>
//                 <Text style={styles.confirmCancelText}>{"Cancel Order"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       }

//       {/* Cancel Success Banner */}
//       {showCancelSuccess &&
//       <View style={styles.overlay}>
//           <View style={styles.confirmBox}>
//             <Text style={styles.confirmEmoji}>✅</Text>
//             <Text style={styles.confirmTitle}>{"Cancellation Submitted"}</Text>
//             <Text style={styles.confirmMsg}>
//               Your cancellation request has been submitted.{'\n'}Refund will be processed in 3–5 business days.
//             </Text>
//             <TouchableOpacity onPress={goBack} style={styles.okBtn}>
//               <Text style={styles.okBtnText}>{"My Orders"}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       }
//     </View>);

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   scroll: { flex: 1, minHeight: 0 },
//   scrollContent: { flexGrow: 1 },

//   // Header
//   header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
//   backBtn: { marginBottom: 14 },
//   backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
//   orderIdText: { fontSize: 20, fontWeight: '800', color: '#fff' },
//   orderDate: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginTop: 3 },
//   statusHero: {
//     flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14
//   },
//   statusEmoji: { fontSize: 36 },
//   statusInfo: { flex: 1 },
//   statusLabel: { fontSize: 18, fontWeight: '800' },
//   statusDesc: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginTop: 4, lineHeight: 17 },

//   // Progress
//   section: { paddingHorizontal: 16, marginTop: 20 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
//   progressTracker: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
//   progressItem: { flexDirection: 'row', gap: 14, minHeight: 52 },
//   progressLeft: { alignItems: 'center', width: 32 },
//   progressDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
//   progressDotInactive: { backgroundColor: COLORS.darkCard },
//   progressDotActive: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
//   progressDotEmoji: { fontSize: 16 },
//   progressLine: { flex: 1, width: 2, backgroundColor: COLORS.darkCard, marginTop: 4, marginBottom: 4 },
//   progressContent: { flex: 1, paddingTop: 4, paddingBottom: 12 },
//   progressLabel: { fontSize: 14, fontWeight: '500', color: COLORS.textMuted },
//   progressDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
//   timelineCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
//   timelineRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
//   timelineRowGap: { marginTop: 14 },
//   timelineDot: { fontSize: 12, color: COLORS.green, marginTop: 3 },
//   timelineInfo: { flex: 1 },
//   timelineTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
//   timelineMsg: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 17 },
//   timelineMeta: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },

//   // Items
//   itemCard: {
//     flexDirection: 'row', gap: 14, backgroundColor: COLORS.darkCard,
//     borderRadius: 16, padding: 14, marginBottom: 10, ...SHADOWS.small
//   },
//   itemImgBox: { width: 64, height: 64, borderRadius: 12, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
//   itemEmoji: { fontSize: 32 },
//   itemInfo: { flex: 1 },
//   itemName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 19 },
//   itemUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
//   itemQty: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
//   itemPriceCol: { alignItems: 'flex-end', justifyContent: 'center' },
//   itemPrice: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
//   itemPriceUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

//   // Summary
//   summaryCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
//   summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
//   summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
//   summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
//   summaryDivider: { height: 1, backgroundColor: COLORS.darkCard, marginVertical: 8 },
//   totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
//   totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.saffron },

//   // Delivery
//   deliveryCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, gap: 14, ...SHADOWS.medium },
//   deliveryRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
//   deliveryIcon: { fontSize: 20, marginTop: 2 },
//   deliveryInfo: { flex: 1 },
//   deliveryLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
//   deliveryValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', marginTop: 3, lineHeight: 18 },

//   // Impact
//   impactCard: {
//     marginHorizontal: 16, marginTop: 20, borderRadius: 20, padding: 16,
//     flexDirection: 'row', gap: 12, alignItems: 'flex-start',
//     borderWidth: 1, borderColor: COLORS.greenLight + '40'
//   },
//   impactEmoji: { fontSize: 32, marginTop: 4 },
//   impactInfo: { flex: 1 },
//   impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green },
//   impactText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 4 },

//   // Actions
//   actions: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 20 },
//   cancelBtn: {
//     flex: 1, backgroundColor: COLORS.error + '12',
//     borderWidth: 1.5, borderColor: COLORS.error + '50',
//     borderRadius: 14, paddingVertical: 14, alignItems: 'center'
//   },
//   cancelBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
//   supportBtn: {
//     flex: 1, backgroundColor: COLORS.green + '15',
//     borderWidth: 1.5, borderColor: COLORS.green + '50',
//     borderRadius: 14, paddingVertical: 14, alignItems: 'center'
//   },
//   supportBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 14 },

//   // Modal Overlay
//   overlay: {
//     position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     alignItems: 'center', justifyContent: 'center',
//     zIndex: 999
//   },
//   confirmBox: {
//     backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28,
//     alignItems: 'center', width: 320, ...SHADOWS.large
//   },
//   confirmEmoji: { fontSize: 44, marginBottom: 12 },
//   confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
//   confirmMsg: {
//     fontSize: 14, color: COLORS.textSecondary,
//     textAlign: 'center', lineHeight: 22
//   },
//   confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
//   keepBtn: {
//     flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder,
//     borderRadius: 14, paddingVertical: 12, alignItems: 'center'
//   },
//   keepBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
//   confirmCancelBtn: {
//     flex: 1, backgroundColor: COLORS.error,
//     borderRadius: 14, paddingVertical: 12, alignItems: 'center'
//   },
//   confirmCancelText: { fontSize: 14, fontWeight: '700', color: '#fff' },
//   okBtn: {
//     marginTop: 24, backgroundColor: COLORS.saffron,
//     borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center'
//   },
//   okBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 }
// });






import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";
import { ORDER_FLOW_STEPS, getFlowIndex, getVisualOrderStatus, buildReadableTimeline, findDispatchForOrder, PAYMENT_LABELS } from '../../utils/orderWorkflow';

const STATUS_STEPS = ORDER_FLOW_STEPS.map((step) => step.key);

const STATUS_CONFIG = {
  confirmed: { label: 'Order Confirmed', emoji: '✅', color: COLORS.info, desc: 'Your order has been received. Vendor is preparing your items.' },
  packed: { label: 'Packed & Ready', emoji: '📦', color: COLORS.teal, desc: 'Items packed and quality-checked. Ready for logistics.' },
  sent_to_logistics: { label: 'At Logistics Hub', emoji: '🏭', color: COLORS.warning, desc: 'Order reached IS&SF logistics hub. Dispatch team is preparing shipment.' },
  processing: { label: 'Being Processed', emoji: '⚙️', color: COLORS.warning, desc: 'Our team is quality-checking and packing your items.' },
  shipped: { label: 'Shipped / In Transit', emoji: '🚚', color: COLORS.green, desc: 'Your order is on the way! Logistics partner is moving it to your address.' },
  delivered: { label: 'Delivered', emoji: '🎉', color: COLORS.success, desc: 'Your order has been delivered. Thank you for supporting SHG artisans!' },
  cancelled: { label: 'Cancelled', emoji: '❌', color: COLORS.error, desc: 'This order was cancelled.' }
};

export default function OrderDetailScreen({ route, navigation }) {const lang = useAppLanguage();

  const routeOrder = route.params?.order;
  const routeOrderId = route.params?.orderId || routeOrder?.id;
  const { products, orders, dispatches } = useStore();
  const order = orders.find((o) => o.id === routeOrderId) || routeOrder || {};
  const dispatch = findDispatchForOrder(dispatches, order.id, 'consumer');
  const visualStatus = getVisualOrderStatus(order);
  const timeline = buildReadableTimeline(order, dispatch);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShowCancelConfirm(false);
      setShowCancelSuccess(false);
    });

    return unsubscribe;
  }, [navigation]);

  const status = STATUS_CONFIG[visualStatus] || STATUS_CONFIG.confirmed;
  const stepIndex = getFlowIndex(order);

  // Enrich items with product data — new orders already carry full data
  const enrichedItems = (order.items || []).map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      name: item.name || product?.name || 'Product',
      emoji: item.emoji || product?.emoji || '📦',
      price: item.price ?? product?.price ?? 0,
      unit: item.unit || product?.unit || 'piece',
      image: item.image || product?.image || null
    };
  });

  const handleCancelRequest = () => {
    if (['shipped', 'delivered'].includes(order.status)) {
      if (Platform.OS === 'web') {
        // Show inline cannot cancel message
        setShowCancelConfirm(false);
        return;
      }
      Alert.alert('Cannot Cancel', 'This order has already been shipped and cannot be cancelled.');
      return;
    }
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setShowCancelSuccess(true);
  };

  const goBack = () => {
    if (showCancelSuccess) {
      setShowCancelSuccess(false);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.orderIdText}>Order #{order.id}</Text>
        <Text style={styles.orderDate}>{order.date}</Text>

        {/* Status Hero */}
        <View style={styles.statusHero}>
          <Text style={styles.statusEmoji}>{status.emoji}</Text>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
            <Text style={styles.statusDesc}>{status.desc}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        
        {/* Progress Tracker */}
        {order.status !== 'cancelled' &&
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{"Order Progress"}</Text>
            <View style={styles.progressTracker}>
              {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              const cfg = STATUS_CONFIG[step];
              return (
                <View key={step} style={styles.progressItem}>
                    <View style={styles.progressLeft}>
                      <View style={[
                    styles.progressDot,
                    done ? { backgroundColor: cfg.color } : styles.progressDotInactive,
                    active && styles.progressDotActive]
                    }>
                        <Text style={styles.progressDotEmoji}>{done ? cfg.emoji : '○'}</Text>
                      </View>
                      {i < STATUS_STEPS.length - 1 &&
                    <View style={[styles.progressLine, done && i < stepIndex && { backgroundColor: STATUS_CONFIG[STATUS_STEPS[i]].color }]} />
                    }
                    </View>
                    <View style={styles.progressContent}>
                      <Text style={[styles.progressLabel, active && { color: cfg.color, fontWeight: '700' }]}>
                        {cfg.label}
                      </Text>
                      {active && <Text style={styles.progressDesc}>{cfg.desc}</Text>}
                    </View>
                  </View>);

            })}
            </View>
          </View>
        }

        {/* Live Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Live Delivery Timeline"}</Text>
          <View style={styles.timelineCard}>
            {timeline.map((event, i) => (
              <View key={event.id || i} style={[styles.timelineRow, i > 0 && styles.timelineRowGap]}>
                <Text style={styles.timelineDot}>●</Text>
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineTitle}>{event.title || event.status}</Text>
                  <Text style={styles.timelineMsg}>{event.message}</Text>
                  <Text style={styles.timelineMeta}>{event.actor || 'System'} · {event.date || order.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Items Ordered */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered ({enrichedItems.length})</Text>
          {enrichedItems.map((item, i) =>
          <View key={i} style={styles.itemCard}>
              <View style={styles.itemImgBox}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.unit}</Text>
                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
              </View>
              <View style={styles.itemPriceCol}>
                <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
                <Text style={styles.itemPriceUnit}>₹{item.price} each</Text>
              </View>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Price Summary"}</Text>
          <View style={styles.summaryCard}>
            {[
            { label: 'Item Total', value: `₹${order.total}` },
            { label: 'Delivery Charge', value: order.total >= 499 ? 'FREE 🎉' : '₹60' },
            { label: 'Packaging', value: '₹0' }].
            map((row, i) =>
            <View key={i} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={[styles.summaryValue, row.value.includes('FREE') && { color: COLORS.success }]}>
                  {row.value}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{"Total Paid"}</Text>
              <Text style={styles.totalValue}>₹{order.total >= 499 ? order.total : order.total + 60}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Delivery Details"}</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>📍</Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>{"Delivery Address"}</Text>
                <Text style={styles.deliveryValue}>{order.address}</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🏭</Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>{"Dispatched From"}</Text>
                <Text style={styles.deliveryValue}>{"Nari Samman Warehouse, Sandeshkhali, N24PGS"}</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>📋</Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>{"Tracking Status"}</Text>
                <Text style={[styles.deliveryValue, { color: COLORS.green }]}>{order.tracking}</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>💳</Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>{"Payment Status"}</Text>
                <Text style={styles.deliveryValue}>{PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus || 'Pending'}</Text>
              </View>
            </View>
            {dispatch && (
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryIcon}>🚚</Text>
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryLabel}>{"Logistics Details"}</Text>
                  <Text style={styles.deliveryValue}>
                    {dispatch.driver || 'Driver not assigned'} · {dispatch.vehicle || 'Vehicle pending'} · ETA {dispatch.eta || 'TBD'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* SHG Impact Note */}
        <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.impactCard}>
          <Text style={styles.impactEmoji}>🌱</Text>
          <View style={styles.impactInfo}>
            <Text style={styles.impactTitle}>{"Thank you for your impact!"}</Text>
            <Text style={styles.impactText}>
              Your purchase of ₹{order.total} directly supports SHG artisan women and tribal communities of West Bengal through the IS&SF Nari Samman initiative.
            </Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!['delivered', 'cancelled', 'shipped'].includes(order.status) &&
          <TouchableOpacity onPress={handleCancelRequest} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{"Cancel Order"}</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS !== 'web') {
                Alert.alert('Support', 'For order support, contact:\nsupport@narisamman.in\nor call +91 98765 00000');
              }
            }}
            style={styles.supportBtn}>
            
            <Text style={styles.supportBtnText}>{"🤝 Need Help?"}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Web-safe Cancel Confirm Modal */}
      {showCancelConfirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>⚠️</Text>
            <Text style={styles.confirmTitle}>{"Cancel Order?"}</Text>
            <Text style={styles.confirmMsg}>
              Are you sure you want to cancel order #{order.id}?
              {'\n'}A refund will be processed in 3–5 business days.
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
              onPress={() => setShowCancelConfirm(false)}
              style={styles.keepBtn}>
              
                <Text style={styles.keepBtnText}>{"Keep Order"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmCancel} style={styles.confirmCancelBtn}>
                <Text style={styles.confirmCancelText}>{"Cancel Order"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }

      {/* Cancel Success Banner */}
      {showCancelSuccess &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>✅</Text>
            <Text style={styles.confirmTitle}>{"Cancellation Submitted"}</Text>
            <Text style={styles.confirmMsg}>
              Your cancellation request has been submitted.{'\n'}Refund will be processed in 3–5 business days.
            </Text>
            <TouchableOpacity onPress={goBack} style={styles.okBtn}>
              <Text style={styles.okBtnText}>{"My Orders"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {})
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 40 : 30
  },

  // Header
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 14 },
  backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
  orderIdText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  orderDate: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginTop: 3 },
  statusHero: {
    flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14
  },
  statusEmoji: { fontSize: 36 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 18, fontWeight: '800' },
  statusDesc: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginTop: 4, lineHeight: 17 },

  // Progress
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  progressTracker: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
  progressItem: { flexDirection: 'row', gap: 14, minHeight: 52 },
  progressLeft: { alignItems: 'center', width: 32 },
  progressDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  progressDotInactive: { backgroundColor: COLORS.darkCard },
  progressDotActive: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  progressDotEmoji: { fontSize: 16 },
  progressLine: { flex: 1, width: 2, backgroundColor: COLORS.darkCard, marginTop: 4, marginBottom: 4 },
  progressContent: { flex: 1, paddingTop: 4, paddingBottom: 12 },
  progressLabel: { fontSize: 14, fontWeight: '500', color: COLORS.textMuted },
  progressDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  timelineCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
  timelineRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  timelineRowGap: { marginTop: 14 },
  timelineDot: { fontSize: 12, color: COLORS.green, marginTop: 3 },
  timelineInfo: { flex: 1 },
  timelineTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  timelineMsg: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 17 },
  timelineMeta: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },

  // Items
  itemCard: {
    flexDirection: 'row', gap: 14, backgroundColor: COLORS.darkCard,
    borderRadius: 16, padding: 14, marginBottom: 10, ...SHADOWS.small
  },
  itemImgBox: { width: 64, height: 64, borderRadius: 12, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 19 },
  itemUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  itemQty: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  itemPriceCol: { alignItems: 'flex-end', justifyContent: 'center' },
  itemPrice: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
  itemPriceUnit: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  // Summary
  summaryCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.medium },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  summaryDivider: { height: 1, backgroundColor: COLORS.darkCard, marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.saffron },

  // Delivery
  deliveryCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, gap: 14, ...SHADOWS.medium },
  deliveryRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  deliveryIcon: { fontSize: 20, marginTop: 2 },
  deliveryInfo: { flex: 1 },
  deliveryLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  deliveryValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500', marginTop: 3, lineHeight: 18 },

  // Impact
  impactCard: {
    marginHorizontal: 16, marginTop: 20, borderRadius: 20, padding: 16,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    borderWidth: 1, borderColor: COLORS.greenLight + '40'
  },
  impactEmoji: { fontSize: 32, marginTop: 4 },
  impactInfo: { flex: 1 },
  impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green },
  impactText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 4 },

  // Actions
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 20 },
  cancelBtn: {
    flex: 1, backgroundColor: COLORS.error + '12',
    borderWidth: 1.5, borderColor: COLORS.error + '50',
    borderRadius: 14, paddingVertical: 14, alignItems: 'center'
  },
  cancelBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
  supportBtn: {
    flex: 1, backgroundColor: COLORS.green + '15',
    borderWidth: 1.5, borderColor: COLORS.green + '50',
    borderRadius: 14, paddingVertical: 14, alignItems: 'center'
  },
  supportBtnText: { color: COLORS.green, fontWeight: '700', fontSize: 14 },

  // Modal Overlay
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 999
  },
  confirmBox: {
    backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28,
    alignItems: 'center', width: 320, ...SHADOWS.large
  },
  confirmEmoji: { fontSize: 44, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 22
  },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  keepBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder,
    borderRadius: 14, paddingVertical: 12, alignItems: 'center'
  },
  keepBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmCancelBtn: {
    flex: 1, backgroundColor: COLORS.error,
    borderRadius: 14, paddingVertical: 12, alignItems: 'center'
  },
  confirmCancelText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  okBtn: {
    marginTop: 24, backgroundColor: COLORS.saffron,
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center'
  },
  okBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 }
});
