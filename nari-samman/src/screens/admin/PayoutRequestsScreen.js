import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function PayoutRequestsScreen({ navigation }) {const lang = useAppLanguage();

  const { payoutRequests, approvePayoutRequest, rejectPayoutRequest } = useStore();
  const [activeFilter, setActiveFilter] = useState('requested');
  const [confirm, setConfirm] = useState(null); // { request, action: 'approve'|'reject' }
  const [justActed, setJustActed] = useState(null);

  const pendingRequests = payoutRequests.filter((r) => r.status === 'requested');
  const paidRequests = payoutRequests.filter((r) => r.status === 'paid');
  const rejectedRequests = payoutRequests.filter((r) => r.status === 'rejected');

  const displayed = activeFilter === 'requested' ? pendingRequests :
  activeFilter === 'paid' ? paidRequests :
  rejectedRequests;

  const totalPendingAmount = pendingRequests.reduce((s, r) => s + r.amount, 0);

  const handleAction = (request, action) => {
    setConfirm({ request, action });
  };

  const doAction = () => {
    if (!confirm) return;
    if (confirm.action === 'approve') {
      approvePayoutRequest(confirm.request.id);
    } else {
      rejectPayoutRequest(confirm.request.id, 'Insufficient documentation');
    }
    setJustActed(confirm.request.id);
    setConfirm(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Payout Requests"}</Text>
        {pendingRequests.length > 0 &&
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingRequests.length}</Text>
          </View>
        }
      </View>

      {/* Summary */}
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{pendingRequests.length}</Text>
          <Text style={styles.summaryLabel}>{"Pending"}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: COLORS.warning }]}>
            ₹{totalPendingAmount.toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>To {"Approve"}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: COLORS.success }]}>{paidRequests.length}</Text>
          <Text style={styles.summaryLabel}>{"Paid Out"}</Text>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {[
        { key: 'requested', label: `Pending (${pendingRequests.length})` },
        { key: 'paid', label: `Paid (${paidRequests.length})` },
        { key: 'rejected', label: `Rejected (${rejectedRequests.length})` }].
        map((f) =>
        <TouchableOpacity
          key={f.key}
          onPress={() => setActiveFilter(f.key)}
          style={[styles.filterTab, activeFilter === f.key && styles.filterTabActive]}>
          
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        
        {displayed.length === 0 ?
        <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              {activeFilter === 'requested' ? '🎉' : '📭'}
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'requested' ? 'No pending payout requests' : 'No records here'}
            </Text>
          </View> :

        displayed.map((req, i) =>
        <View key={req.id} style={[styles.card, i > 0 && { marginTop: 12 }]}>
              {/* Card header */}
              <View style={styles.cardTop}>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{req.vendorName}</Text>
                  <Text style={styles.reqDate}>Requested: {req.requestedAt}</Text>
                  {req.paidAt && <Text style={styles.paidDate}>Paid: {req.paidAt}</Text>}
                  {req.ref && <Text style={styles.refCode}>Ref: {req.ref}</Text>}
                </View>
                <View style={styles.amountCol}>
                  <Text style={styles.reqAmount}>₹{req.amount.toLocaleString()}</Text>
                  <Text style={styles.orderCount}>{req.orders.length} order(s)</Text>
                </View>
              </View>

              {/* Status badge */}
              <View style={styles.statusRow}>
                <View style={[
            styles.statusBadge,
            req.status === 'requested' && { backgroundColor: COLORS.warning + '20' },
            req.status === 'paid' && { backgroundColor: COLORS.success + '20' },
            req.status === 'rejected' && { backgroundColor: COLORS.error + '20' }]
            }>
                  <Text style={[
              styles.statusText,
              req.status === 'requested' && { color: COLORS.warning },
              req.status === 'paid' && { color: COLORS.success },
              req.status === 'rejected' && { color: COLORS.error }]
              }>
                    {req.status === 'requested' ? '⏳ Awaiting Approval' :
                req.status === 'paid' ? '✅ Paid Out' :
                '❌ Rejected'}
                  </Text>
                </View>
              </View>

              {/* Action buttons — only for pending requests */}
              {req.status === 'requested' && justActed !== req.id &&
          <View style={styles.actionBtns}>
                  <TouchableOpacity
              onPress={() => handleAction(req, 'reject')}
              style={styles.rejectBtn}>
              
                    <Text style={styles.rejectBtnText}>✕ {"Reject"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
              onPress={() => handleAction(req, 'approve')}
              style={styles.approveBtn}>
              
                    <LinearGradient colors={[COLORS.green, COLORS.greenLight]} style={styles.approveBtnGrad}>
                      <Text style={styles.approveBtnText}>{"✓ Approve & Pay"}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
          }

              {justActed === req.id &&
          <View style={styles.actedBanner}>
                  <Text style={styles.actedText}>{"✅ Action processed — vendor notified"}</Text>
                </View>
          }
            </View>
        )
        }
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Confirm Modal */}
      {confirm &&
      <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>
              {confirm.action === 'approve' ? '💸' : '⚠️'}
            </Text>
            <Text style={styles.confirmTitle}>
              {confirm.action === 'approve' ? 'Approve & Pay?' : 'Reject Request?'}
            </Text>
            <Text style={styles.confirmMsg}>
              {confirm.action === 'approve' ?
            `Transfer ₹${confirm.request.amount.toLocaleString()} to ${confirm.request.vendorName}?\n\nVendor will be notified instantly.` :
            `Reject payout request of ₹${confirm.request.amount.toLocaleString()} from ${confirm.request.vendorName}?\n\nVendor will be notified.`}
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setConfirm(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={doAction}
              style={[styles.doBtn, confirm.action === 'reject' && { backgroundColor: COLORS.error }]}>
              
                <Text style={styles.doBtnText}>
                  {confirm.action === 'approve' ? 'Pay Now' : 'Reject'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  badge: { backgroundColor: COLORS.warning, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  summary: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  summaryItem: { alignItems: 'center' },
  summaryVal: { fontSize: 22, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: 'rgba(200,208,228,0.55)', marginTop: 3 },
  summaryDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.12)' },

  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: COLORS.darkCard, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.dark, borderWidth: 1.5, borderColor: COLORS.darkBorder },
  filterTabActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#fff' },

  list: { padding: 16, flexGrow: 1 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },

  card: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 18, ...SHADOWS.small },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  reqDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  paidDate: { fontSize: 12, color: COLORS.success, marginTop: 2 },
  refCode: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  amountCol: { alignItems: 'flex-end' },
  reqAmount: { fontSize: 22, fontWeight: '800', color: COLORS.saffron },
  orderCount: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  statusRow: { marginBottom: 12 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },

  actionBtns: { flexDirection: 'row', gap: 10 },
  rejectBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.error + '60', alignItems: 'center',
    backgroundColor: COLORS.error + '10'
  },
  rejectBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.error },
  approveBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
  approveBtnGrad: { paddingVertical: 12, alignItems: 'center' },
  approveBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  actedBanner: {
    backgroundColor: COLORS.success + '15', borderRadius: 10, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.success + '30'
  },
  actedText: { color: COLORS.success, fontWeight: '600', fontSize: 13 },

  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  confirmBox: {
    backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28,
    alignItems: 'center', width: 320, ...SHADOWS.large
  },
  confirmEmoji: { fontSize: 44, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center'
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  doBtn: { flex: 1, backgroundColor: COLORS.green, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  doBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' }
});