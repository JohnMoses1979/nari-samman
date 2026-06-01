import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
  cancelled: COLORS.error
};

const ACTION_LABELS = {
  confirmed: '📦 Mark as Packed',
  packed: '🚚 Send to Logistics'
};

export default function VendorOrderDetailScreen({ route, navigation }) {
  const lang = useAppLanguage();
  const { orderId } = route.params || {};
  const { vendorOrders, vendorProfile, orders, dispatches, updateOrderStatus, shgSendToLogistics, loadVendorOrders } = useStore();
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    loadVendorOrders(vendorProfile?.id).catch(() => {});
  }, [loadVendorOrders, vendorProfile?.id]);

  const order = vendorOrders.find((o) => o.id === orderId);
  const consumerOrder = order?.consumerOrderId ? orders.find((o) => o.id === order.consumerOrderId) : null;
  const dispatch = findDispatchForOrder(dispatches, orderId, 'vendor') || (consumerOrder ? findDispatchForOrder(dispatches, consumerOrder.id, 'consumer') : null);

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.headerPlain}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Order Not Found</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.empty}><Text style={styles.emptyText}>This vendor order could not be found.</Text></View>
      </View>
    );
  }

  const visualStatus = getVisualOrderStatus(order);
  const statusColor = STATUS_COLOR[visualStatus] || COLORS.info;
  const flowIndex = getFlowIndex(order);
  const timeline = buildReadableTimeline(order, dispatch);
  const canPack = order.status === 'confirmed';
  const canSend = order.status === 'packed';

  const runAction = async () => {
    if (!confirm) return;
    try {
      if (confirm === 'pack') await updateOrderStatus(order.id, 'packed');
      if (confirm === 'send') await shgSendToLogistics(order.id);
    } catch (err) {
      Alert.alert('Order Update Failed', err.message || 'Please try again.');
    }
    setConfirm(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <Text style={styles.headerMeta}>#{order.id}</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { borderColor: statusColor + '70' }]}>
          <Text style={styles.heroEmoji}>{ORDER_FLOW_STEPS[flowIndex]?.emoji || '📦'}</Text>
          <View style={styles.heroInfo}>
            <Text style={[styles.heroStatus, { color: statusColor }]}>{STATUS_LABELS[visualStatus] || visualStatus}</Text>
            <Text style={styles.heroText}>{order.tracking || consumerOrder?.tracking || 'Order is being processed.'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Flow</Text>
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
                    <Text style={[styles.flowLabel, active && { color: statusColor, fontWeight: '800' }]}>{step.label}</Text>
                    <Text style={styles.flowDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="👤" label="Buyer" value={order.buyer} />
            <InfoRow icon="🛍️" label="Product" value={order.item} />
            <InfoRow icon="🔢" label="Quantity" value={`${order.qty}`} />
            <InfoRow icon="💰" label="Amount" value={`₹${order.amount.toLocaleString()}`} />
            <InfoRow icon="📅" label="Order Date" value={order.date} />
            <InfoRow icon="💳" label="Payment" value={PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus || 'Pending'} />
            <InfoRow icon="📍" label="Delivery Address" value={consumerOrder?.address || dispatch?.destination || 'Pending address confirmation'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logistics Details</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="🏭" label="Hub" value="IS&SF Sandeshkhali Warehouse" />
            <InfoRow icon="🚚" label="Dispatch Status" value={dispatch ? STATUS_LABELS[getVisualOrderStatus(order, dispatch.status)] || dispatch.status : 'Not sent to logistics yet'} />
            <InfoRow icon="👷" label="Driver" value={dispatch?.driver || 'Not assigned'} />
            <InfoRow icon="🚗" label="Vehicle" value={dispatch?.vehicle || 'Not assigned'} />
            <InfoRow icon="⏱️" label="ETA" value={dispatch?.eta || 'TBD'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Updates</Text>
          <View style={styles.timelineCard}>
            {timeline.map((event, index) => (
              <View key={event.id || index} style={[styles.timelineRow, index > 0 && { marginTop: 14 }]}>
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

        {(canPack || canSend) && (
          <TouchableOpacity
            style={[styles.actionBtn, canSend && { backgroundColor: COLORS.warning, borderColor: COLORS.warning }]}
            onPress={() => setConfirm(canSend ? 'send' : 'pack')}
          >
            <Text style={styles.actionText}>{canSend ? ACTION_LABELS.packed : ACTION_LABELS.confirmed}</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {confirm && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>{confirm === 'send' ? '🚚' : '📦'}</Text>
            <Text style={styles.confirmTitle}>{confirm === 'send' ? 'Send to Logistics?' : 'Mark as Packed?'}</Text>
            <Text style={styles.confirmMsg}>
              {confirm === 'send'
                ? 'This order will move to IS&SF logistics. Logistics updates will reflect for vendor, admin, and consumer.'
                : 'Customer and admin will see this order as packed.'}
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setConfirm(null)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={runAction} style={styles.confirmBtn}><Text style={styles.confirmText}>Confirm</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  back: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerMeta: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700' },
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, borderWidth: 1.5, ...SHADOWS.medium },
  heroEmoji: { fontSize: 38 },
  heroInfo: { flex: 1 },
  heroStatus: { fontSize: 18, fontWeight: '900' },
  heroText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  section: { marginHorizontal: 16, marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
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
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, marginTop: 2, lineHeight: 18, fontWeight: '600' },
  timelineCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 14, ...SHADOWS.small },
  timelineRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  timelineDot: { fontSize: 12, color: COLORS.green, marginTop: 3 },
  timelineInfo: { flex: 1 },
  timelineTitle: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  timelineMsg: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 17 },
  timelineMeta: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  actionBtn: { marginHorizontal: 16, marginTop: 20, backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderWidth: 1.5, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '900', color: '#1C2437' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  confirmBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 26, width: 320, alignItems: 'center', ...SHADOWS.large },
  confirmEmoji: { fontSize: 46, marginBottom: 10 },
  confirmTitle: { fontSize: 20, color: COLORS.textPrimary, fontWeight: '900', marginBottom: 8 },
  confirmMsg: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, textAlign: 'center' },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: COLORS.textSecondary, fontWeight: '700' },
  confirmBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  confirmText: { color: '#1C2437', fontWeight: '900' }
});
