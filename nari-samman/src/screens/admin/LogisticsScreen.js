import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const DISPATCH_STATUS = {
  at_hub: { label: 'At Hub', color: COLORS.warning || '#FF9800', emoji: '🏭' },
  dispatched: { label: 'Dispatched', color: COLORS.info || '#2196F3', emoji: '📤' },
  in_transit: { label: 'In Transit', color: COLORS.green || '#4CAF50', emoji: '🚚' },
  delivered: { label: 'Delivered', color: COLORS.success || '#4CAF50', emoji: '✅' }
};

const QUALITY_STATUS = {
  quality_check: { label: 'Quality Check', color: COLORS.warning || '#FF9800', emoji: '🔍' },
  approved: { label: 'Approved', color: COLORS.green || '#4CAF50', emoji: '✅' },
  rejected: { label: 'Rejected', color: COLORS.bengalRed, emoji: '❌' }
};

const TABS = ['Warehouse', 'Dispatch'];

export default function LogisticsScreen({ navigation }) {const lang = useAppLanguage();

  const { warehouseStock, dispatches, updateWarehouseItemStatus, updateDispatchStatus, orders, loadDispatches, loadAdminOrders } = useStore();
  const [activeTab, setActiveTab] = useState('Warehouse');
  const [expandedWarehouseId, setExpandedWarehouseId] = useState(null);
  const [expandedDispatchId, setExpandedDispatchId] = useState(null);

  useEffect(() => {
    Promise.all([loadDispatches(), loadAdminOrders()]).catch(() => {});
  }, [loadDispatches, loadAdminOrders]);

  // Derive stats from real data
  const warehouseStats = [
  { label: 'Total Items', value: warehouseStock?.reduce((s, w) => s + w.qty, 0) || 0, color: COLORS.textPrimary },
  { label: 'In Quality Check', value: warehouseStock?.filter((w) => w.qualityStatus === 'quality_check').length || 0, color: COLORS.warning || '#FF9800' },
  { label: 'Approved', value: warehouseStock?.filter((w) => w.qualityStatus === 'approved').length || 0, color: COLORS.green || '#4CAF50' },
  { label: 'Rejected', value: warehouseStock?.filter((w) => w.qualityStatus === 'rejected').length || 0, color: COLORS.bengalRed }];


  const dispatchStats = [
  { label: 'At Hub', value: dispatches?.filter((d) => d.status === 'at_hub').length || 0, color: COLORS.warning || '#FF9800' },
  { label: 'Dispatched', value: dispatches?.filter((d) => d.status === 'dispatched').length || 0, color: '#2196F3' },
  { label: 'In Transit', value: dispatches?.filter((d) => d.status === 'in_transit').length || 0, color: COLORS.green || '#4CAF50' },
  { label: 'Delivered', value: dispatches?.filter((d) => d.status === 'delivered').length || 0, color: COLORS.success || '#4CAF50' }];


  const handleQualityAction = (item, newStatus, reason) => {
    if (Platform.OS === 'web') {
      updateWarehouseItemStatus(item.id, newStatus, reason);
    } else {
      const action = newStatus === 'approved' ? "✅ Approve & Add to Stock".replace('✅ ', '').replace(' & Add to Stock', '') : "Rejected";
      Alert.alert(`${action} Item`, `${action} "${item.productName}"?`, [
      { text: "Cancel", style: 'cancel' },
      { text: action, onPress: () => updateWarehouseItemStatus(item.id, newStatus, reason) }]
      );
    }
  };

  const handleDispatchAction = (item, newStatus) => {
    if (Platform.OS === 'web') {
      updateDispatchStatus(item.id, newStatus).catch((err) => {
        if (Platform.OS === 'web') window.alert(err.message || 'Dispatch update failed.');
      });
    } else {
      const s = DISPATCH_STATUS[newStatus];
      Alert.alert("Status", `${"Order ID"} #${item.orderId} → "${s.label}"?`, [
      { text: "Cancel", style: 'cancel' },
      { text: "Update", onPress: () => updateDispatchStatus(item.id, newStatus).catch((err) => Alert.alert('Dispatch Update Failed', err.message || 'Please try again.')) }]
      );
    }
  };

  const DISPATCH_FLOW = ['at_hub', 'dispatched', 'in_transit', 'delivered'];
  const nextStatus = (current) => {
    const idx = DISPATCH_FLOW.indexOf(current);
    return idx < DISPATCH_FLOW.length - 1 ? DISPATCH_FLOW[idx + 1] : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Logistics"} & Warehouse</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) =>
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
        style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'Warehouse' ? '🏭 Warehouse' : '🚚 Dispatch'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Warehouse Hub Info */}
        <View style={styles.hubCard}>
          <Text style={styles.hubEmoji}>🏭</Text>
          <View style={styles.hubInfo}>
            <Text style={styles.hubTitle}>{"Sandeshkhali Warehouse Hub"}</Text>
            <Text style={styles.hubAddress}>{"North 24 Parganas, West Bengal 743446"}</Text>
            <Text style={styles.hubStatus}>{"● Operational — 24/7 Aggregation Centre"}</Text>
          </View>
        </View>

        {/* Stats Banner */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBar}>
          {(activeTab === 'Warehouse' ? warehouseStats : dispatchStats).map((s, i) =>
          <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── WAREHOUSE TAB ── */}
        {activeTab === 'Warehouse' &&
        <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>{"📦 Warehouse Stock — Quality Control"}</Text>
            <Text style={styles.sectionSub}>{"All items received from SHGs undergo quality check before dispatch."}</Text>

            {(warehouseStock || []).map((item) => {
            const qs = QUALITY_STATUS[item.qualityStatus] || QUALITY_STATUS.quality_check;
            const isExpanded = expandedWarehouseId === item.id;
            return (
              <TouchableOpacity key={item.id} onPress={() => setExpandedWarehouseId(isExpanded ? null : item.id)}
              style={[styles.card, { borderLeftColor: qs.color }]} activeOpacity={0.8}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.productName}>{item.productName}</Text>
                      <Text style={styles.shgLabel}>📍 {item.shgName}</Text>
                      <Text style={styles.itemMeta}>🗓️ Received: {item.receivedDate} · 📍 {item.location}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <View style={[styles.statusBadge, { backgroundColor: qs.color + '20' }]}>
                        <Text style={{ fontSize: 13 }}>{qs.emoji}</Text>
                        <Text style={[styles.statusText, { color: qs.color }]}>{qs.label}</Text>
                      </View>
                      <Text style={styles.qtyText}>{item.qty} {item.unit}</Text>
                      <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                    </View>
                  </View>

                  {isExpanded &&
                <View style={styles.expandedContent}>
                      <View style={styles.divider} />
                      {item.rejectionReason ?
                  <View style={styles.rejectionNote}>
                          <Text style={styles.rejectionText}>⚠️ Rejection Reason: {item.rejectionReason}</Text>
                        </View> :
                  null}

                      {/* DPR Workflow: Quality Check → Approved / Rejected */}
                      {item.qualityStatus === 'quality_check' &&
                  <>
                          <Text style={styles.actionLabel}>{"Quality Check Decision:"}</Text>
                          <View style={styles.actionBtnsRow}>
                            <TouchableOpacity onPress={() => handleQualityAction(item, 'approved', null)}
                      style={styles.approveBtn}>
                              <Text style={styles.approveBtnText}>{"✅ Approve & Add to Stock"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleQualityAction(item, 'rejected', 'Failed quality standards')}
                      style={styles.rejectBtn}>
                              <Text style={styles.rejectBtnText}>❌ {"Reject"}</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                  }
                      {item.qualityStatus === 'approved' &&
                  <View style={styles.approvedNote}>
                          <Text style={styles.approvedNoteText}>{"✅ This item is approved and ready for order fulfilment & dispatch."}</Text>
                        </View>
                  }
                      {item.qualityStatus === 'rejected' &&
                  <TouchableOpacity onPress={() => handleQualityAction(item, 'quality_check', null)} style={styles.reQueueBtn}>
                          <Text style={styles.reQueueText}>{"🔁 Re-queue for Quality Check"}</Text>
                        </TouchableOpacity>
                  }
                    </View>
                }
                </TouchableOpacity>);

          })}
          </View>
        }

        {/* ── DISPATCH TAB ── */}
        {activeTab === 'Dispatch' &&
        <View style={styles.listSection}>
            <Text style={styles.sectionLabel}>{"🚚 Order Dispatch Tracker"}</Text>
            <Text style={styles.sectionSub}>{"Track and advance order status from hub to consumer delivery."}</Text>

            {/* DPR Workflow Visual */}
            <View style={styles.workflowCard}>
              <Text style={styles.workflowTitle}>{"📋 Dispatch Workflow (DPR)"}</Text>
              <View style={styles.workflowSteps}>
                {[
              { emoji: '📥', label: 'SHG Delivers\nto Hub' },
              { emoji: '🔍', label: 'Quality\nCheck' },
              { emoji: '📦', label: 'Packaging\n& Labelling' },
              { emoji: '📤', label: 'Dispatch\nto Courier' },
              { emoji: '🚚', label: 'In Transit\nto Buyer' },
              { emoji: '✅', label: 'Delivered\n& Confirmed' }].
              map((step, i, arr) =>
              <React.Fragment key={i}>
                    <View style={styles.workflowStep}>
                      <Text style={styles.workflowEmoji}>{step.emoji}</Text>
                      <Text style={styles.workflowStepLabel}>{step.label}</Text>
                    </View>
                    {i < arr.length - 1 && <Text style={styles.workflowArrow}>→</Text>}
                  </React.Fragment>
              )}
              </View>
            </View>

            {(dispatches || []).map((item) => {
            const s = DISPATCH_STATUS[item.status] || DISPATCH_STATUS.at_hub;
            const next = nextStatus(item.status);
            const nextS = next ? DISPATCH_STATUS[next] : null;
            const isExpanded = expandedDispatchId === item.id;
            return (
              <TouchableOpacity key={item.id} onPress={() => setExpandedDispatchId(isExpanded ? null : item.id)}
              style={[styles.card, { borderLeftColor: s.color }]} activeOpacity={0.8}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.productName}>Order #{item.orderId}</Text>
                      {item.shgName && <Text style={[styles.shgLabel, { color: COLORS.saffron }]}>📦 From: {item.shgName}</Text>}
                      <Text style={styles.shgLabel}>👤 {item.buyer}</Text>
                      <Text style={styles.itemMeta}>📍 {item.destination}</Text>
                      {item.productNames?.map((n, i) =>
                    <Text key={i} style={styles.productItem}>• {n}</Text>
                    )}
                    </View>
                    <View style={styles.cardRight}>
                      <View style={[styles.statusBadge, { backgroundColor: s.color + '20' }]}>
                        <Text style={{ fontSize: 13 }}>{s.emoji}</Text>
                        <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                      </View>
                      <Text style={styles.etaText}>ETA: {item.eta}</Text>
                      <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                    </View>
                  </View>

                  {isExpanded &&
                <View style={styles.expandedContent}>
                      <View style={styles.divider} />
                      <View style={styles.detailGrid}>
                        {item.vehicle && <View style={styles.detailRow}><Text style={styles.detailIcon}>🚗</Text><Text style={styles.detailValue}>Vehicle: {item.vehicle}</Text></View>}
                        {item.driver && <View style={styles.detailRow}><Text style={styles.detailIcon}>👷</Text><Text style={styles.detailValue}>Driver: {item.driver}</Text></View>}
                        {item.dispatchDate && <View style={styles.detailRow}><Text style={styles.detailIcon}>📅</Text><Text style={styles.detailValue}>Dispatched: {item.dispatchDate}</Text></View>}
                      </View>
                      {nextS &&
                  <TouchableOpacity onPress={() => handleDispatchAction(item, next)} style={[styles.advanceBtn, { backgroundColor: nextS.color + '20', borderColor: nextS.color + '40' }]}>
                          <Text style={[styles.advanceBtnText, { color: nextS.color }]}>
                            {nextS.emoji} Advance to "{nextS.label}"
                          </Text>
                        </TouchableOpacity>
                  }
                      {item.status === 'delivered' &&
                  <View style={styles.deliveredNote}>
                          <Text style={styles.deliveredNoteText}>{"✅ Order fully delivered. Payment processing can now be initiated."}</Text>
                        </View>
                  }
                    </View>
                }
                </TouchableOpacity>);

          })}
          </View>
        }

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: COLORS.darkCard, ...SHADOWS.small },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.darkCard, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.purple },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.purple },
  hubCard: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.darkCard, margin: 16, marginBottom: 0, borderRadius: 16, padding: 14, ...SHADOWS.small, alignItems: 'center' },
  hubEmoji: { fontSize: 36 },
  hubInfo: { flex: 1 },
  hubTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  hubAddress: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  hubStatus: { fontSize: 12, color: COLORS.green || '#4CAF50', fontWeight: '600', marginTop: 4 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, margin: 16, marginTop: 12, borderRadius: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: 'rgba(200,208,228,0.6)', marginTop: 2, textAlign: 'center' },
  listSection: { paddingHorizontal: 16 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 14, lineHeight: 17 },
  workflowCard: { backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 16, ...SHADOWS.small },
  workflowTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  workflowSteps: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  workflowStep: { alignItems: 'center', gap: 4 },
  workflowEmoji: { fontSize: 20 },
  workflowStepLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center', lineHeight: 12 },
  workflowArrow: { fontSize: 16, color: COLORS.textMuted, marginTop: -4 },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, ...SHADOWS.small, borderLeftWidth: 4, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  shgLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  itemMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  productItem: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  qtyText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  etaText: { fontSize: 11, color: COLORS.textMuted },
  expandArrow: { fontSize: 11, color: COLORS.textMuted },
  expandedContent: { marginTop: 10 },
  divider: { height: 1, backgroundColor: COLORS.darkBorder, marginBottom: 12 },
  rejectionNote: { backgroundColor: COLORS.bengalRed + '15', borderRadius: 10, padding: 10, marginBottom: 10 },
  rejectionText: { fontSize: 12, color: COLORS.bengalRed, fontWeight: '600' },
  actionLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8, fontWeight: '600' },
  actionBtnsRow: { flexDirection: 'row', gap: 8 },
  approveBtn: { flex: 1, backgroundColor: '#4CAF5020', borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF5040' },
  approveBtnText: { fontSize: 13, color: '#4CAF50', fontWeight: '700' },
  rejectBtn: { flex: 1, backgroundColor: COLORS.bengalRed + '15', borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.bengalRed + '30' },
  rejectBtnText: { fontSize: 13, color: COLORS.bengalRed, fontWeight: '700' },
  approvedNote: { backgroundColor: '#4CAF5015', borderRadius: 10, padding: 10 },
  approvedNoteText: { fontSize: 12, color: '#4CAF50', lineHeight: 17 },
  reQueueBtn: { backgroundColor: '#FF980015', borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FF980040' },
  reQueueText: { fontSize: 13, color: '#FF9800', fontWeight: '700' },
  detailGrid: { gap: 6, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailIcon: { fontSize: 15 },
  detailValue: { fontSize: 13, color: COLORS.textSecondary },
  advanceBtn: { borderRadius: 12, paddingVertical: 11, alignItems: 'center', borderWidth: 1, marginTop: 4 },
  advanceBtnText: { fontSize: 13, fontWeight: '700' },
  deliveredNote: { backgroundColor: '#4CAF5015', borderRadius: 10, padding: 10, marginTop: 4 },
  deliveredNoteText: { fontSize: 12, color: '#4CAF50', lineHeight: 17 }
});
