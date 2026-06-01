import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

const MONTHLY_DATA = [
{ month: 'Jan', revenue: 420000, orders: 82, shgPayouts: 294000 },
{ month: 'Feb', revenue: 510000, orders: 95, shgPayouts: 357000 },
{ month: 'Mar', revenue: 680000, orders: 110, shgPayouts: 476000 },
{ month: 'Apr', revenue: 840000, orders: 134, shgPayouts: 588000 },
{ month: 'May', revenue: 970000, orders: 156, shgPayouts: 679000 }];


const CATEGORY_REVENUE = [
{ name: 'Handloom & Textiles', revenue: 3708000, pct: 45, emoji: '🧵', color: COLORS.green },
{ name: 'Food & Allied', revenue: 3131200, pct: 38, emoji: '🍯', color: COLORS.saffron },
{ name: 'Tribal Crafts', revenue: 1400800, pct: 17, emoji: '🏺', color: COLORS.purple }];


const PAYMENT_SPLIT = [
{ label: 'SHG Payouts (70%)', value: 5768000, color: COLORS.green },
{ label: 'Platform Fee (15%)', value: 1236000, color: COLORS.saffron },
{ label: 'Logistics & Ops (10%)', value: 824000, color: COLORS.purple },
{ label: 'Warehouse Reserve (5%)', value: 412000, color: COLORS.teal }];


export default function RevenueScreen({ navigation }) {const lang = useAppLanguage();

  const { adminStats, vendorOrders, payoutRequests, getTotalOrders } = useStore();
  const [period, setPeriod] = useState('Monthly');

  // Live revenue: all delivered vendor orders
  const liveRevenue = vendorOrders.
  filter((o) => o.status === 'delivered').
  reduce((sum, o) => sum + o.amount, 0);

  // Total paid out to vendors via approved payout requests
  const totalPaidOut = (payoutRequests || []).
  filter((r) => r.status === 'paid').
  reduce((sum, r) => sum + r.amount, 0);

  // Pending payout (requested but not yet paid)
  const pendingPayoutTotal = (payoutRequests || []).
  filter((r) => r.status === 'requested').
  reduce((sum, r) => sum + r.amount, 0);

  const liveTotalOrders = getTotalOrders();

  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Revenue"}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Revenue Card */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Platform {"Revenue"}</Text>
          <Text style={styles.heroValue}>
            ₹{(adminStats.totalRevenue / 100000).toFixed(1)}L
          </Text>
          <Text style={styles.heroSub}>
            ₹{(adminStats.totalRevenue / 10000000).toFixed(2)} Crore lifetime
          </Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>₹{(liveRevenue / 1000).toFixed(0)}K</Text>
              <Text style={styles.heroStatLabel}>Delivered {"Revenue"}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatVal, { color: COLORS.warning }]}>₹{(pendingPayoutTotal / 1000).toFixed(0)}K</Text>
              <Text style={styles.heroStatLabel}>{"Pending Payout"}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatVal, { color: COLORS.success }]}>₹{(totalPaidOut / 1000).toFixed(0)}K</Text>
              <Text style={styles.heroStatLabel}>{"Paid to Vendors"}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodRow}>
          {['Monthly', 'Quarterly'].map((p) =>
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[styles.periodTab, period === p && styles.periodTabActive]}>
            
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 {"Revenue"} Trend</Text>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {MONTHLY_DATA.map((d, i) => {
                const barH = d.revenue / maxRevenue * 130;
                return (
                  <View key={i} style={styles.barItem}>
                    <Text style={styles.barLabel2}>
                      {(d.revenue / 100000).toFixed(1)}L
                    </Text>
                    <LinearGradient
                      colors={[COLORS.saffron, COLORS.gold]}
                      style={[styles.bar, { height: barH }]} />
                    
                    <Text style={styles.barMonth}>{d.month}</Text>
                    <Text style={styles.barOrders}>{d.orders} ord</Text>
                  </View>);

              })}
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ {"Revenue"} by Category</Text>
          <View style={styles.chartCard}>
            {CATEGORY_REVENUE.map((c, i) =>
            <View key={i} style={[styles.catRow, i > 0 && { marginTop: 16 }]}>
                <Text style={styles.catEmoji}>{c.emoji}</Text>
                <View style={styles.catInfo}>
                  <View style={styles.catLabelRow}>
                    <Text style={styles.catName}>{c.name}</Text>
                    <Text style={[styles.catPct, { color: c.color }]}>{c.pct}%</Text>
                  </View>
                  <View style={styles.catBarBg}>
                    <View style={[styles.catBarFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
                  </View>
                  <Text style={styles.catRevenue}>₹{(c.revenue / 100000).toFixed(1)}L</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Revenue Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 {"Revenue"} Distribution</Text>
          <View style={styles.distributionCard}>
            {PAYMENT_SPLIT.map((item, i) =>
            <View key={i} style={[styles.splitRow, i < PAYMENT_SPLIT.length - 1 && styles.splitDivider]}>
                <View style={[styles.splitDot, { backgroundColor: item.color }]} />
                <Text style={styles.splitLabel}>{item.label}</Text>
                <Text style={[styles.splitValue, { color: item.color }]}>
                  ₹{(item.value / 100000).toFixed(1)}L
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Live Payout Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"💸 Live Payout Status"}</Text>
          <View style={styles.distributionCard}>
            {[
            { label: 'Delivered, Awaiting Request', value: vendorOrders.filter((o) => o.status === 'delivered' && o.paymentStatus === 'pending_payment').reduce((s, o) => s + o.amount, 0), color: COLORS.saffron },
            { label: 'Payout Requested by Vendors', value: pendingPayoutTotal, color: COLORS.warning },
            { label: 'Paid Out to Vendors', value: totalPaidOut, color: COLORS.success }].
            map((item, i) =>
            <View key={i} style={[styles.splitRow, i < 2 && styles.splitDivider]}>
                <View style={[styles.splitDot, { backgroundColor: item.color }]} />
                <Text style={styles.splitLabel}>{item.label}</Text>
                <Text style={[styles.splitValue, { color: item.color }]}>
                  ₹{item.value.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* SHG Payout Summary */}
        <LinearGradient
          colors={[COLORS.green + '15', COLORS.greenLight + '08']}
          style={styles.payoutCard}>
          
          <Text style={styles.payoutTitle}>{"Total Vendor Payouts"}</Text>
          <Text style={styles.payoutAmount}>₹{totalPaidOut.toLocaleString()}</Text>
          <Text style={styles.payoutSub}>Paid out across {adminStats.activeSHGs} active SHGs</Text>
          <Text style={styles.payoutAvg}>
            {(payoutRequests || []).filter((r) => r.status === 'paid').length} payout requests settled
          </Text>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  heroCard: { padding: 24 },
  heroLabel: { fontSize: 12, color: 'rgba(200,208,228,0.6)', marginBottom: 6 },
  heroValue: { fontSize: 44, fontWeight: '800', color: COLORS.gold },
  heroSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4, marginBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: 10, color: 'rgba(200,208,228,0.5)', marginTop: 4 },
  heroDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' },
  periodRow: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 4 },
  periodTab: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder
  },
  periodTabActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  periodText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  periodTextActive: { color: '#fff' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12, marginTop: 8 },
  chartCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 20, ...SHADOWS.medium },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 180 },
  barItem: { alignItems: 'center', gap: 4, flex: 1 },
  barLabel2: { fontSize: 9, fontWeight: '700', color: COLORS.textSecondary },
  bar: { width: 28, borderRadius: 8, minHeight: 8 },
  barMonth: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  barOrders: { fontSize: 9, color: COLORS.textMuted },
  catRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  catEmoji: { fontSize: 22 },
  catInfo: { flex: 1 },
  catLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  catPct: { fontSize: 13, fontWeight: '800' },
  catBarBg: { height: 8, backgroundColor: COLORS.darkCard, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  catBarFill: { height: 8, borderRadius: 4 },
  catRevenue: { fontSize: 11, color: COLORS.textMuted },
  distributionCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, ...SHADOWS.small, overflow: 'hidden' },
  splitRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  splitDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.creamDark },
  splitDot: { width: 10, height: 10, borderRadius: 5 },
  splitLabel: { flex: 1, fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
  splitValue: { fontSize: 14, fontWeight: '800' },
  payoutCard: {
    marginHorizontal: 16, marginBottom: 16, borderRadius: 20,
    padding: 20, borderWidth: 1, borderColor: COLORS.greenLight + '40',
    alignItems: 'center'
  },
  payoutTitle: { fontSize: 14, fontWeight: '600', color: COLORS.green, marginBottom: 8 },
  payoutAmount: { fontSize: 36, fontWeight: '800', color: COLORS.green },
  payoutSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  payoutAvg: { fontSize: 13, color: COLORS.green, fontWeight: '600', marginTop: 6 }
});