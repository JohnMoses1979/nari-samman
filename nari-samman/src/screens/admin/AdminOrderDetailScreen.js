import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import Text from '../../autoTranslation/AutoText';
import useAppLanguage from '../../autoTranslation/useAppLanguage';
import {
  ORDER_FLOW_STEPS,
  getFlowIndex,
  getVisualOrderStatus,
  buildReadableTimeline,
  findDispatchForOrder,
  STATUS_LABELS,
  PAYMENT_LABELS
} from '../../utils/orderWorkflow';

const STATUS_COLOR = {
  confirmed: COLORS.info,
  packed: COLORS.teal,
  sent_to_logistics: COLORS.warning,
  shipped: COLORS.green,
  delivered: COLORS.success,
  cancelled: COLORS.error,
  pending: COLORS.warning,
  processing: COLORS.purple
};

export default function AdminOrderDetailScreen({ route, navigation }) {
  const lang = useAppLanguage();
  const { orderId, source = 'consumer' } = route.params || {};
  const { orders, vendorOrders, dispatches } = useStore();

  const consumerOrder = source === 'consumer'
    ? orders.find((o) => o.id === orderId)
    : orders.find((o) => o.id === vendorOrders.find((v) => v.id === orderId)?.consumerOrderId);

  const vendorOrder = source === 'vendor'
    ? vendorOrders.find((o) => o.id === orderId)
    : vendorOrders.find((o) => o.consumerOrderId === orderId);

  const mainOrder = source === 'vendor' ? vendorOrder : consumerOrder;
  const dispatch = source === 'vendor'
    ? findDispatchForOrder(dispatches, orderId, 'vendor') || (consumerOrder ? findDispatchForOrder(dispatches, consumerOrder.id, 'consumer') : null)
    : findDispatchForOrder(dispatches, orderId, 'consumer');

  if (!mainOrder) {
    return (
      <View style={styles.container}>
        <View style={styles.headerPlain}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Order Not Found</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.empty}><Text style={styles.emptyText}>This order could not be found.</Text></View>
      </View>
    );
  }

  const visualStatus = getVisualOrderStatus(mainOrder, dispatch?.status);
  const statusColor = STATUS_COLOR[visualStatus] || COLORS.info;
  const flowIndex = getFlowIndex(mainOrder, dispatch?.status);
  const timeline = buildReadableTimeline(mainOrder, dispatch);
  const items = consumerOrder?.items || (vendorOrder ? [{ name: vendorOrder.item, qty: vendorOrder.qty, price: vendorOrder.amount / Math.max(1, vendorOrder.qty), unit: 'piece', emoji: '📦' }] : []);
  const amount = consumerOrder?.total ?? vendorOrder?.amount ?? 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <Text style={styles.headerMeta}>#{mainOrder.id}</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { borderColor: statusColor + '70' }]}>
          <Text style={styles.heroEmoji}>{ORDER_FLOW_STEPS[flowIndex]?.emoji || '📦'}</Text>
          <View style={styles.heroInfo}>
            <Text style={[styles.heroStatus, { color: statusColor }]}>{STATUS_LABELS[visualStatus] || visualStatus}</Text>
            <Text style={styles.heroText}>{mainOrder.tracking || consumerOrder?.tracking || vendorOrder?.tracking || 'Order is being processed.'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Order Flow</Text>
          <View style={styles.flowCard}>
            {ORDER_FLOW_STEPS.map((step, index) => {
              const done = index <= flowIndex;
              const active = index === flowIndex;
              return (
                <View key={step.key} style={styles.flowItem}>
                  <View style={styles.flowLeft}>
                    <View style={[styles.flowDot, done ? { backgroundColor: active ? statusColor : COLORS.green } : styles.flowDotPending]}>
                      <Text style={styles.flowEmoji}>{done ? step.emoji : '○'}</Text>
                    </View>
                    {index < ORDER_FLOW_STEPS.length - 1 && <View style={[styles.flowLine, done && index < flowIndex && { backgroundColor: COLORS.green }]} />}
                  </View>
                  <View style={styles.flowInfo}>
                    <Text style={[styles.flowLabel, active && { color: statusColor, fontWeight: '900' }]}>{step.label}</Text>
                    <Text style={styles.flowDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="🧾" label="Order ID" value={mainOrder.id} />
            <InfoRow icon="👤" label="Buyer" value={consumerOrder?.buyer || vendorOrder?.buyer || 'Consumer'} />
            <InfoRow icon="🏪" label="Vendor / SHG" value={vendorOrder?.shgName || 'Nari Samman SHG'} />
            <InfoRow icon="📅" label="Date" value={mainOrder.date} />
            <InfoRow icon="💰" label="Amount" value={`₹${amount.toLocaleString()}`} />
            <InfoRow icon="💳" label="Payment" value={PAYMENT_LABELS[mainOrder.paymentStatus || vendorOrder?.paymentStatus] || mainOrder.paymentStatus || vendorOrder?.paymentStatus || 'Pending'} />
            <InfoRow icon="📍" label="Delivery Address" value={consumerOrder?.address || dispatch?.destination || 'Not available'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item, index) => (
            <View key={`${item.productId || item.name}_${index}`} style={styles.itemCard}>
              <Text style={styles.itemEmoji}>{item.emoji || '📦'}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name || 'Product'}</Text>
                <Text style={styles.itemMeta}>Qty {item.qty} · {item.unit || 'piece'}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logistics</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="🏭" label="Hub" value="IS&SF Sandeshkhali Warehouse" />
            <InfoRow icon="🚚" label="Dispatch ID" value={dispatch?.id || 'Not created yet'} />
            <InfoRow icon="📦" label="Dispatch Status" value={dispatch?.status ? (STATUS_LABELS[getVisualOrderStatus(mainOrder, dispatch.status)] || dispatch.status) : 'Not assigned'} />
            <InfoRow icon="👷" label="Driver" value={dispatch?.driver || 'Not assigned'} />
            <InfoRow icon="🚗" label="Vehicle" value={dispatch?.vehicle || 'Not assigned'} />
            <InfoRow icon="⏱️" label="ETA" value={dispatch?.eta || 'TBD'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Timeline</Text>
          <View style={styles.timelineCard}>
            {timeline.map((event, index) => (
              <View key={event.id || index} style={[styles.timelineRow, index > 0 && { marginTop: 14 }]}>
                <Text style={styles.timelineDot}>●</Text>
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineTitle}>{event.title || event.status}</Text>
                  <Text style={styles.timelineMsg}>{event.message}</Text>
                  <Text style={styles.timelineMeta}>{event.actor || 'System'} · {event.date || mainOrder.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextBox}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  content: { paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14 },
  headerPlain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14, backgroundColor: COLORS.darkCard },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  headerMeta: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700' },
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, borderWidth: 1.5, ...SHADOWS.medium },
  heroEmoji: { fontSize: 38 },
  heroInfo: { flex: 1 },
  heroStatus: { fontSize: 18, fontWeight: '900' },
  heroText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  section: { marginHorizontal: 16, marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 10 },
  flowCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.small },
  flowItem: { flexDirection: 'row', gap: 12, minHeight: 58 },
  flowLeft: { alignItems: 'center', width: 32 },
  flowDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  flowDotPending: { backgroundColor: COLORS.dark, borderWidth: 1, borderColor: COLORS.darkBorder },
  flowEmoji: { fontSize: 15 },
  flowLine: { flex: 1, width: 2, backgroundColor: COLORS.darkBorder, marginVertical: 4 },
  flowInfo: { flex: 1, paddingTop: 3, paddingBottom: 12 },
  flowLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  flowDesc: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, lineHeight: 16 },
  infoCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 14, gap: 12, ...SHADOWS.small },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoIcon: { fontSize: 18, width: 24 },
  infoTextBox: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700' },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, marginTop: 2, lineHeight: 18, fontWeight: '600' },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, marginBottom: 10, ...SHADOWS.small },
  itemEmoji: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  itemMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  itemPrice: { fontSize: 14, color: COLORS.saffron, fontWeight: '900' },
  timelineCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 14, ...SHADOWS.small },
  timelineRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  timelineDot: { fontSize: 12, color: COLORS.green, marginTop: 3 },
  timelineInfo: { flex: 1 },
  timelineTitle: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '900' },
  timelineMsg: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 17 },
  timelineMeta: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 }
});
