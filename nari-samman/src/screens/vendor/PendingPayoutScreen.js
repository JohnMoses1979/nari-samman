import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function PendingPayoutScreen({ navigation }) {const lang = useAppLanguage();

  const { vendorOrders, vendorProfile, payoutRequests, requestPayout, vendorNotifications } = useStore();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Orders delivered but not yet paid out
  const pendingPaymentOrders = vendorOrders.filter((o) =>
  o.status === 'delivered' && o.paymentStatus === 'pending_payment'
  );
  // Orders where payout is already requested (waiting for admin)
  const requestedOrders = vendorOrders.filter((o) =>
  o.status === 'delivered' && o.paymentStatus === 'payout_requested'
  );
  // Already paid orders
  const paidOrders = vendorOrders.filter((o) =>
  o.status === 'delivered' && o.paymentStatus === 'paid'
  );

  const pendingAmount = pendingPaymentOrders.reduce((s, o) => s + o.amount, 0);
  const requestedAmount = requestedOrders.reduce((s, o) => s + o.amount, 0);
  const paidAmount = paidOrders.reduce((s, o) => s + o.amount, 0);

  const selectedAmount = vendorOrders.
  filter((o) => selectedOrders.includes(o.id)).
  reduce((s, o) => s + o.amount, 0);

  const toggleSelect = (orderId) => {
    setSelectedOrders((prev) =>
    prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const selectAll = () => {
    setSelectedOrders(pendingPaymentOrders.map((o) => o.id));
  };

  const handleRequestPayout = () => {
    if (selectedOrders.length === 0) return;
    setShowRequestModal(true);
  };

  const confirmRequest = () => {
    requestPayout(selectedOrders);
    setSelectedOrders([]);
    setShowRequestModal(false);
    setRequestSent(true);
  };

  // Vendor-side view of payout requests
  const myRequests = payoutRequests.filter((r) => r.vendorId === vendorProfile.id);
  const pendingRequests = myRequests.filter((r) => r.status === 'requested');
  const paidRequests = myRequests.filter((r) => r.status === 'paid');

  // Unread payment notifications
  const paymentNotifs = (vendorNotifications || []).filter((n) => !n.read && n.type === 'payment');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Pending Payout"}</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Payment notifications */}
        {paymentNotifs.length > 0 &&
        <LinearGradient colors={[COLORS.success + '25', COLORS.mint + '15']} style={styles.notifBanner}>
            <Text style={styles.notifIcon}>🎉</Text>
            <View style={{ flex: 1 }}>
              {paymentNotifs.map((n) =>
            <Text key={n.id} style={styles.notifText}>{n.message}</Text>
            )}
            </View>
          </LinearGradient>
        }

        {/* Summary Hero */}
        <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.heroCard}>
          <Text style={styles.heroLabel}>{"Payment Overview"}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>₹{pendingAmount.toLocaleString()}</Text>
              <Text style={styles.heroStatLabel}>{"Awaiting Request"}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>₹{requestedAmount.toLocaleString()}</Text>
              <Text style={styles.heroStatLabel}>{"Requested"}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>₹{paidAmount.toLocaleString()}</Text>
              <Text style={styles.heroStatLabel}>{"Received"}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* How Payouts Work */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"💡 How Payouts Work"}</Text>
          {[
          { icon: '🛒', step: 'Order Placed', desc: 'Consumer places COD order. You prepare and ship.' },
          { icon: '🎉', step: 'Order Delivered', desc: 'Consumer receives and pays cash on delivery. Amount credited to your Pending Payout.' },
          { icon: '📩', step: "Request Payout", desc: 'Select delivered orders below and request payout from admin.' },
          { icon: '🏦', step: 'Admin Reviews & Pays', desc: 'Admin verifies and transfers amount to your bank. You get a notification.' }].
          map((item, i) =>
          <View key={i} style={styles.stepRow}>
              <View style={styles.stepIconBox}>
                <Text style={styles.stepIcon}>{item.icon}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepName}>{item.step}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
              {i < 3 && <View style={styles.stepConnector} />}
            </View>
          )}
        </View>

        {/* Delivered orders — select and request */}
        {pendingPaymentOrders.length > 0 &&
        <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>
                💰 Ready to Request ({pendingPaymentOrders.length})
              </Text>
              <TouchableOpacity onPress={selectAll}>
                <Text style={styles.selectAllText}>{"Select All"}</Text>
              </TouchableOpacity>
            </View>
            {pendingPaymentOrders.map((order) =>
          <TouchableOpacity
            key={order.id}
            onPress={() => toggleSelect(order.id)}
            style={[styles.orderRow, selectedOrders.includes(order.id) && styles.orderRowSelected]}>
            
                <View style={[
            styles.checkbox,
            selectedOrders.includes(order.id) && styles.checkboxSelected]
            }>
                  {selectedOrders.includes(order.id) && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderBuyer}>{order.buyer}</Text>
                  <Text style={styles.orderItem} numberOfLines={1}>{order.item}</Text>
                  <Text style={styles.orderDate}>Delivered: {order.date}</Text>
                </View>
                <Text style={styles.orderAmt}>₹{order.amount.toLocaleString()}</Text>
              </TouchableOpacity>
          )}

            {/* Request button */}
            <TouchableOpacity
            onPress={handleRequestPayout}
            style={[styles.requestBtn, selectedOrders.length === 0 && styles.requestBtnDisabled]}
            disabled={selectedOrders.length === 0}>
            
              <LinearGradient
              colors={selectedOrders.length > 0 ? [COLORS.green, COLORS.greenLight] : ['#555', '#444']}
              style={styles.requestBtnGrad}>
              
                <Text style={styles.requestBtnText}>
                  {selectedOrders.length > 0 ?
                `📩 Request Payout – ₹${selectedAmount.toLocaleString()}` :
                '📩 Select orders to request payout'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {requestSent &&
          <LinearGradient colors={[COLORS.success + '20', COLORS.mint + '10']} style={styles.successBanner}>
                <Text style={styles.successIcon}>✅</Text>
                <View>
                  <Text style={styles.successTitle}>{"Request Sent!"}</Text>
                  <Text style={styles.successDesc}>{"Admin will review and credit your bank within 1-2 working days."}</Text>
                </View>
              </LinearGradient>
          }
          </View>
        }

        {/* Orders awaiting admin approval */}
        {requestedOrders.length > 0 &&
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏳ Awaiting Admin Approval ({requestedOrders.length})</Text>
            {requestedOrders.map((order) =>
          <View key={order.id} style={styles.orderRow}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.info }]} />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderBuyer}>{order.buyer}</Text>
                  <Text style={styles.orderItem} numberOfLines={1}>{order.item}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.orderRightCol}>
                  <Text style={styles.orderAmt}>₹{order.amount.toLocaleString()}</Text>
                  <View style={[styles.statusChip, { backgroundColor: COLORS.info + '20' }]}>
                    <Text style={[styles.statusChipText, { color: COLORS.info }]}>{"Pending"}</Text>
                  </View>
                </View>
              </View>
          )}
          </View>
        }

        {/* Payout Request History */}
        {myRequests.length > 0 &&
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 {"Payout Requests"}</Text>
            {myRequests.map((req) =>
          <View key={req.id} style={styles.payoutHistoryRow}>
                <View style={[
            styles.payoutIconBox,
            { backgroundColor: req.status === 'paid' ? COLORS.success + '15' : COLORS.info + '15' }]
            }>
                  <Text style={styles.payoutHistoryIcon}>{req.status === 'paid' ? '💰' : '⏳'}</Text>
                </View>
                <View style={styles.payoutHistoryInfo}>
                  <Text style={styles.payoutHistoryAmt}>₹{req.amount.toLocaleString()}</Text>
                  <Text style={styles.payoutHistoryRef}>
                    {req.ref ? `${req.ref} • ` : ''}Requested {req.requestedAt}
                  </Text>
                  {req.paidAt && <Text style={styles.payoutHistoryDate}>Paid on {req.paidAt}</Text>}
                </View>
                <View style={[
            styles.paidChip,
            { backgroundColor: req.status === 'paid' ? COLORS.success + '20' : COLORS.info + '20' }]
            }>
                  <Text style={[
              styles.paidText,
              { color: req.status === 'paid' ? COLORS.success : COLORS.info }]
              }>
                    {req.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                  </Text>
                </View>
              </View>
          )}
          </View>
        }

        {/* Bank Account Card */}
        <LinearGradient colors={['#0F1822', '#131D29']} style={styles.bankCard}>
          <Text style={styles.bankCardTitle}>{"🏦 Linked Bank Account"}</Text>
          <View style={styles.bankCardRow}>
            <Text style={styles.bankCardLabel}>{"Account Holder"}</Text>
            <Text style={styles.bankCardValue}>{vendorProfile.name}</Text>
          </View>
          <View style={styles.bankCardRow}>
            <Text style={styles.bankCardLabel}>{"Account Number"}</Text>
            <Text style={styles.bankCardValue}>••••••••3821</Text>
          </View>
          <View style={styles.bankCardRow}>
            <Text style={styles.bankCardLabel}>{"Bank"}</Text>
            <Text style={styles.bankCardValue}>State Bank of India</Text>
          </View>
          <View style={styles.bankCardRow}>
            <Text style={styles.bankCardLabel}>IFSC</Text>
            <Text style={styles.bankCardValue}>SBIN0001234</Text>
          </View>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Request Payout Modal */}
      {showRequestModal &&
      <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>📩</Text>
            <Text style={styles.modalTitle}>Request Payout?</Text>
            <Text style={styles.modalMsg}>
              You are requesting payout of{'\n'}
              <Text style={{ fontWeight: '800', color: COLORS.green }}>
                ₹{selectedAmount.toLocaleString()}
              </Text>
              {'\n'}for {selectedOrders.length} order(s).{'\n\n'}
              Admin will review and transfer to{'\n'}
              <Text style={{ fontWeight: '700' }}>SBI ••3821</Text> within 1–2 working days.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
              onPress={() => setShowRequestModal(false)}
              style={styles.modalCancelBtn}>
              
                <Text style={styles.modalCancelText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRequest} style={styles.modalConfirmBtn}>
                <LinearGradient colors={[COLORS.green, COLORS.greenLight]} style={styles.modalConfirmGrad}>
                  <Text style={styles.modalConfirmText}>Send Request →</Text>
                </LinearGradient>
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
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  backBtn: { paddingVertical: 4 },
  backText: { color: 'rgba(200,208,228,0.8)', fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  notifBanner: {
    flexDirection: 'row', gap: 12, alignItems: 'center',
    borderRadius: 16, padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.success + '40'
  },
  notifIcon: { fontSize: 28 },
  notifText: { fontSize: 13, color: COLORS.success, fontWeight: '600', lineHeight: 20 },

  heroCard: { borderRadius: 24, padding: 20, marginBottom: 16 },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 14, textAlign: 'center', fontWeight: '600' },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center' },
  heroStatVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 3, textAlign: 'center' },
  heroStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  section: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, marginBottom: 14, ...SHADOWS.small },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  selectAllText: { fontSize: 13, color: COLORS.green, fontWeight: '600' },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, position: 'relative' },
  stepIconBox: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.dark,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2
  },
  stepIcon: { fontSize: 18 },
  stepInfo: { flex: 1 },
  stepName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  stepDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 2 },
  stepConnector: { position: 'absolute', left: 17, top: 40, width: 2, height: 16, backgroundColor: COLORS.darkBorder },

  orderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder
  },
  orderRowSelected: { backgroundColor: COLORS.green + '08', borderRadius: 10, paddingHorizontal: 6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.darkBorder, alignItems: 'center', justifyContent: 'center'
  },
  checkboxSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  orderInfo: { flex: 1 },
  orderBuyer: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  orderItem: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  orderDate: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  orderAmt: { fontSize: 15, fontWeight: '800', color: COLORS.saffron },
  orderRightCol: { alignItems: 'flex-end', gap: 4 },
  statusChip: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  statusChipText: { fontSize: 10, fontWeight: '700' },

  requestBtn: { marginTop: 14, borderRadius: 50, overflow: 'hidden' },
  requestBtnDisabled: { opacity: 0.6 },
  requestBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  requestBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  successBanner: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    borderRadius: 14, padding: 14, marginTop: 12
  },
  successIcon: { fontSize: 28 },
  successTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success },
  successDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },

  payoutHistoryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  payoutIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  payoutHistoryIcon: { fontSize: 18 },
  payoutHistoryInfo: { flex: 1 },
  payoutHistoryAmt: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  payoutHistoryRef: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  payoutHistoryDate: { fontSize: 11, color: COLORS.textMuted },
  paidChip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  paidText: { fontSize: 11, fontWeight: '700' },

  bankCard: { borderRadius: 20, padding: 20, marginBottom: 14 },
  bankCardTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 16 },
  bankCardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  bankCardLabel: { fontSize: 12, color: 'rgba(200,208,228,0.5)' },
  bankCardValue: { fontSize: 13, fontWeight: '600', color: '#fff' },

  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  modalBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 320, ...SHADOWS.large },
  modalEmoji: { fontSize: 48, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
  modalMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 4 },
  modalBtns: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 20 },
  modalCancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.darkBorder, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  modalConfirmBtn: { flex: 1, borderRadius: 50, overflow: 'hidden' },
  modalConfirmGrad: { paddingVertical: 13, alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});