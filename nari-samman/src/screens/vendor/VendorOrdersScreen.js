import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const STATUS_META = {
  confirmed: { color: COLORS.info, bg: COLORS.info + '20', emoji: '✅', label: 'New Order' },
  packed: { color: COLORS.teal, bg: COLORS.teal + '20', emoji: '📦', label: 'Packed' },
  sent_to_logistics: { color: COLORS.warning, bg: COLORS.warning + '20', emoji: '🚚', label: 'With Logistics' },
  shipped: { color: COLORS.primary, bg: COLORS.primary + '20', emoji: '📤', label: 'Shipped' },
  delivered: { color: COLORS.success, bg: COLORS.success + '20', emoji: '🎉', label: 'Delivered' }
};

const PAYMENT_META = {
  pending: { color: COLORS.textMuted, bg: COLORS.darkBorder, label: 'COD Pending' },
  pending_payment: { color: COLORS.warning, bg: COLORS.warning + '20', label: '💰 Collect Payment' },
  payout_requested: { color: COLORS.info, bg: COLORS.info + '20', label: '⏳ Payout Requested' },
  paid: { color: COLORS.success, bg: COLORS.success + '20', label: '✓ Paid Out' }
};

// SHG can only do: confirmed → packed → send_to_logistics
// After that, {'Logistics'} owns ship & deliver
const SHG_NEXT = { confirmed: 'packed', packed: 'send_to_logistics' };
const SHG_ACTION_LABEL = {
  confirmed: '📦 Mark as Packed',
  packed: '🚚 Send to Logistics'
};

const TABS = [
{ key: 'active', label: "Active" },
{ key: 'delivered', label: "Delivered" },
{ key: 'all', label: "My Orders" }];


export default function VendorOrdersScreen({ navigation }) {const lang = useAppLanguage();

  const { vendorOrders, vendorProfile, updateOrderStatus, shgSendToLogistics, loadVendorOrders } = useStore();
  const [tab, setTab] = useState('active');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    loadVendorOrders(vendorProfile?.id).catch(() => {});
  }, [loadVendorOrders, vendorProfile?.id]);

  const activeOrders = vendorOrders.filter((o) => o.status !== 'delivered');
  const deliveredOrders = vendorOrders.filter((o) => o.status === 'delivered');

  const displayed =
  tab === 'active' ? activeOrders :
  tab === 'delivered' ? deliveredOrders :
  vendorOrders;

  const doUpdate = async () => {
    if (!confirm) return;
    const { order, action } = confirm;
    try {
      if (action === 'send_to_logistics') {
        await shgSendToLogistics(order.id);
      } else {
        await updateOrderStatus(order.id, action);
      }
    } catch (err) {
      Alert.alert('Order Update Failed', err.message || 'Please try again.');
    }
    setConfirm(null);
  };

  const counts = {
    confirmed: vendorOrders.filter((o) => o.status === 'confirmed').length,
    packed: vendorOrders.filter((o) => o.status === 'packed').length,
    sent_to_logistics: vendorOrders.filter((o) => o.status === 'sent_to_logistics').length,
    shipped: vendorOrders.filter((o) => o.status === 'shipped').length,
    delivered: vendorOrders.filter((o) => o.status === 'delivered').length
  };

  const renderOrder = ({ item, index }) => {
    const sm = STATUS_META[item.status] || STATUS_META.confirmed;
    const pm = PAYMENT_META[item.paymentStatus] || PAYMENT_META.pending;
    const nextAction = SHG_NEXT[item.status];
    const isWithLogistics = ['sent_to_logistics', 'shipped'].includes(item.status);

    return (
      <TouchableOpacity
        style={[styles.card, index > 0 && { marginTop: 10 }]}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('VendorOrderDetail', { orderId: item.id })}>
        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <Text style={styles.buyer}>{item.buyer}</Text>
            <Text style={styles.itemName} numberOfLines={1}>{item.item}</Text>
            <Text style={styles.meta}>Qty {item.qty}  ·  {item.date}</Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.amount}>₹{item.amount.toLocaleString()}</Text>
            <View style={[styles.chip, { backgroundColor: sm.bg }]}>
              <Text style={[styles.chipText, { color: sm.color }]}>{sm.emoji} {sm.label}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.payChip, { backgroundColor: pm.bg }]}>
          <Text style={[styles.payText, { color: pm.color }]}>{pm.label}</Text>
          {item.paymentStatus === 'pending_payment' &&
          <Text style={[styles.payHint, { color: pm.color }]}>  → Request payout in {"Pending Payout"}</Text>
          }
        </View>

        {isWithLogistics &&
        <View style={styles.logisticsBanner}>
            <Text style={styles.logisticsEmoji}>🏭</Text>
            <Text style={styles.logisticsText}>
              Handed to IS&SF {"Logistics"} team at Sandeshkhali Warehouse. They will ship and deliver this order.
            </Text>
          </View>
        }

        {item.tracking &&
        <View style={styles.trackingBanner}>
            <Text style={styles.trackingText}>🚦 {item.tracking}</Text>
          </View>
        }

        <Text style={styles.viewDetailsText}>{"Open Details →"}</Text>

        {nextAction &&
        <TouchableOpacity
          style={[styles.actionBtn, nextAction === 'send_to_logistics' && styles.actionBtnLogistics]}
          onPress={() => setConfirm({ order: item, action: nextAction })}>
          
            <Text style={[styles.actionBtnText, nextAction === 'send_to_logistics' && styles.actionBtnTextLogistics]}>
              {SHG_ACTION_LABEL[item.status]}
            </Text>
          </TouchableOpacity>
        }
      </TouchableOpacity>);

  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Orders"}</Text>
        <Text style={styles.headerCount}>{vendorOrders.length} total</Text>
      </LinearGradient>

      <View style={styles.pipeline}>
        {[
        { key: 'confirmed', emoji: '✅', color: COLORS.info },
        { key: 'packed', emoji: '📦', color: COLORS.teal },
        { key: 'sent_to_logistics', emoji: '🏭', color: COLORS.warning },
        { key: 'shipped', emoji: '🚚', color: COLORS.green },
        { key: 'delivered', emoji: '🎉', color: COLORS.success }].
        map((s, i) =>
        <React.Fragment key={s.key}>
            <View style={styles.pipeItem}>
              <View style={[styles.pipeCircle, counts[s.key] > 0 && { borderColor: s.color }]}>
                <Text style={styles.pipeEmoji}>{s.emoji}</Text>
                {counts[s.key] > 0 &&
              <View style={[styles.pipeBadge, { backgroundColor: s.color }]}>
                    <Text style={styles.pipeBadgeText}>{counts[s.key]}</Text>
                  </View>
              }
              </View>
              <Text style={[styles.pipeLabel, counts[s.key] > 0 && { color: s.color }]}>
                {s.key === 'sent_to_logistics' ? "Logistics" : s.key.charAt(0).toUpperCase() + s.key.slice(1)}
              </Text>
            </View>
            {i < 4 && <View style={styles.pipeLine} />}
          </React.Fragment>
        )}
      </View>

      <View style={styles.flowInfo}>
        <Text style={styles.flowInfoText}>{"🏭 Your role: Confirm → Pack → Send to Logistics. IS&SF handles shipping & delivery."}</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tabItem) =>
        <TouchableOpacity
          key={tabItem.key}
          onPress={() => setTab(tabItem.key)}
          style={[styles.tab, tab === tabItem.key && styles.tabActive]}>
          
            <Text style={[styles.tabText, tab === tabItem.key && styles.tabTextActive]}>
              {tabItem.label}
              {tabItem.key === 'active' ? ` (${activeOrders.length})` : ''}
              {tabItem.key === 'delivered' ? ` (${deliveredOrders.length})` : ''}
              {tabItem.key === 'all' ? ` (${vendorOrders.length})` : ''}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {displayed.length === 0 ?
      <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>{tab === 'active' ? '🎉' : '📭'}</Text>
          <Text style={styles.emptyTitle}>
            {tab === 'active' ? "No active orders right now!" : "No orders here"}
          </Text>
          {tab === 'active' &&
        <Text style={styles.emptySubtitle}>{"New orders will appear here when customers shop"}</Text>
        }
        </View> :

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} />

      }

      {confirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>
              {confirm.action === 'send_to_logistics' ? '🚚' : '📦'}
            </Text>
            <Text style={styles.confirmTitle}>{SHG_ACTION_LABEL[confirm.order.status]}?</Text>
            <Text style={styles.confirmMsg}>
              Order from{' '}
              <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>{confirm.order.buyer}</Text>
              {'\n\n'}
              {confirm.action === 'send_to_logistics' ?
            'This will hand the order to IS&SF Logistics at Sandeshkhali Warehouse. They will dispatch and deliver it to the customer.' :
            'Status → "Packed". Consumer will be notified that their order is being prepared.'}
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setConfirm(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={doUpdate} style={[
            styles.confirmDoBtn,
            confirm.action === 'send_to_logistics' && { backgroundColor: COLORS.warning }]
            }>
                <Text style={styles.confirmDoText}>{"Confirm"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 14
  },
  back: { fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerCount: { fontSize: 13, color: 'rgba(200,208,228,0.6)' },
  pipeline: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.darkCard,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder
  },
  pipeItem: { alignItems: 'center', position: 'relative' },
  pipeCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.dark,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.darkBorder
  },
  pipeEmoji: { fontSize: 18 },
  pipeBadge: { position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pipeBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  pipeLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, fontWeight: '600' },
  pipeLine: { flex: 1, height: 1.5, backgroundColor: COLORS.darkBorder, marginBottom: 14 },
  flowInfo: { backgroundColor: COLORS.saffron + '12', borderBottomWidth: 1, borderBottomColor: COLORS.saffron + '25', paddingHorizontal: 16, paddingVertical: 8 },
  flowInfoText: { fontSize: 11, color: COLORS.saffron, fontWeight: '600', lineHeight: 16 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.darkCard, paddingHorizontal: 12, paddingBottom: 10, paddingTop: 6, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.dark, borderWidth: 1.5, borderColor: COLORS.darkBorder },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#1C2437', fontWeight: '800' },
  list: { padding: 14, paddingBottom: 30 },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, ...SHADOWS.small },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardLeft: { flex: 1, paddingRight: 10 },
  buyer: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  itemName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  meta: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  chip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, fontWeight: '700' },
  payChip: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10, flexWrap: 'wrap' },
  payText: { fontSize: 11, fontWeight: '700' },
  payHint: { fontSize: 10, opacity: 0.8 },
  logisticsBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: COLORS.warning + '12', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: COLORS.warning + '30' },
  logisticsEmoji: { fontSize: 18, marginTop: 1 },
  logisticsText: { flex: 1, fontSize: 11, color: COLORS.warning, lineHeight: 16 },
  trackingBanner: { backgroundColor: COLORS.green + '12', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: COLORS.green + '30' },
  trackingText: { fontSize: 11, color: COLORS.green, lineHeight: 16, fontWeight: '600' },
  viewDetailsText: { fontSize: 12, color: COLORS.primary, fontWeight: '800', textAlign: 'right', marginBottom: 10 },
  actionBtn: { backgroundColor: COLORS.primary + '15', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '50' },
  actionBtnLogistics: { backgroundColor: COLORS.warning + '20', borderColor: COLORS.warning + '60' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  actionBtnTextLogistics: { color: COLORS.warning },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 },
  emptyEmoji: { fontSize: 54, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  confirmBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, width: 320, alignItems: 'center', ...SHADOWS.large },
  confirmEmoji: { fontSize: 48, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmDoBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  confirmDoText: { fontSize: 14, fontWeight: '700', color: '#1C2437' }
});
