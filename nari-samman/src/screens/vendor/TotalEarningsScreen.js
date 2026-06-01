import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthKey(dateStr) {
  // dateStr like "2025-05-10"
  const parts = dateStr.split('-');
  return `${parts[0]}-${parts[1]}`;
}

export default function TotalEarningsScreen({ navigation }) {const lang = useAppLanguage();

  const { vendorOrders } = useStore();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'monthly'

  // Only count orders where admin has actually paid out (paymentStatus === 'paid')
  const paidOrders = vendorOrders.filter((o) => o.status === 'delivered' && o.paymentStatus === 'paid');
  const totalEarnings = paidOrders.reduce((s, o) => s + o.amount, 0);

  // Pending payment (delivered but not yet paid out)
  const pendingOrders = vendorOrders.filter((o) => o.status === 'delivered' && o.paymentStatus === 'pending_payment');
  const pendingAmount = pendingOrders.reduce((s, o) => s + o.amount, 0);

  // Requested but awaiting admin
  const requestedAmount = vendorOrders.
  filter((o) => o.paymentStatus === 'payout_requested').
  reduce((s, o) => s + o.amount, 0);

  // Monthly breakdown from delivered orders
  const monthlyMap = {};
  paidOrders.forEach((o) => {
    const key = getMonthKey(o.date);
    if (!monthlyMap[key]) monthlyMap[key] = { amount: 0, count: 0 };
    monthlyMap[key].amount += o.amount;
    monthlyMap[key].count += 1;
  });
  const monthlySorted = Object.entries(monthlyMap).
  sort((a, b) => b[0].localeCompare(a[0])).
  slice(0, 6).
  reverse();

  const maxMonthly = Math.max(...monthlySorted.map((m) => m[1].amount), 1);

  // Category breakdown
  const catMap = {};
  paidOrders.forEach((o) => {
    const cat = o.item?.includes('Saree') || o.item?.includes('Dupatta') || o.item?.includes('Silk') || o.item?.includes('Stole') ?
    'Textiles' : o.item?.includes('Honey') || o.item?.includes('Pickle') || o.item?.includes('Spice') || o.item?.includes('Rice') || o.item?.includes('Jaggery') ?
    'Food' : 'Crafts';
    if (!catMap[cat]) catMap[cat] = 0;
    catMap[cat] += o.amount;
  });
  const catColors = { Textiles: COLORS.green, Food: COLORS.gold, Crafts: COLORS.saffron };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Total Earnings"}</Text>
        <View style={{ width: 60 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Amount */}
        <LinearGradient colors={['#7AAF2A', '#9DCD43']} style={styles.heroCard}>
          <Text style={styles.heroLabel}>{"Amount Received (Paid Out)"}</Text>
          <Text style={styles.heroAmount}>₹{totalEarnings.toLocaleString()}</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{paidOrders.length}</Text>
              <Text style={styles.heroStatLabel}>{"Orders Paid"}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatVal, { color: '#fff' }]}>
                ₹{(pendingAmount + requestedAmount).toLocaleString()}
              </Text>
              <Text style={styles.heroStatLabel}>{"Pending Payout"}</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>⭐ 4.9</Text>
              <Text style={styles.heroStatLabel}>{"Rating"}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Monthly Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Monthly Earnings"}</Text>
          <View style={styles.barChart}>
            {monthlySorted.map(([key, data]) => {
              const [year, month] = key.split('-');
              const barH = Math.max(data.amount / maxMonthly * 100, 4);
              const isThisMonth = monthlySorted[monthlySorted.length - 1][0] === key;
              return (
                <View key={key} style={styles.barCol}>
                  <Text style={styles.barAmt}>₹{(data.amount / 1000).toFixed(1)}K</Text>
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={isThisMonth ? [COLORS.saffron, COLORS.gold] : [COLORS.green, COLORS.greenLight]}
                      style={[styles.bar, { height: barH }]} />
                    
                  </View>
                  <Text style={styles.barLabel}>{MONTHS[parseInt(month, 10) - 1]}</Text>
                  <Text style={styles.barCount}>{data.count} orders</Text>
                </View>);

            })}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Earnings by Category"}</Text>
          {Object.entries(catMap).map(([cat, amt]) => {
            const pct = Math.round(amt / totalEarnings * 100);
            return (
              <View key={cat} style={styles.catRow}>
                <View style={styles.catLeft}>
                  <View style={[styles.catDot, { backgroundColor: catColors[cat] || COLORS.green }]} />
                  <Text style={styles.catName}>{cat}</Text>
                </View>
                <View style={styles.catBar}>
                  <View
                    style={[styles.catFill, { width: `${pct}%`, backgroundColor: catColors[cat] || COLORS.green }]} />
                  
                </View>
                <Text style={styles.catAmt}>₹{amt.toLocaleString()}</Text>
                <Text style={styles.catPct}>{pct}%</Text>
              </View>);

          })}
        </View>

        {/* Top 3 Earning Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Top Earning Products"}</Text>
          {(() => {
            const prodMap = {};
            paidOrders.forEach((o) => {
              if (!prodMap[o.item]) prodMap[o.item] = { amount: 0, count: 0 };
              prodMap[o.item].amount += o.amount;
              prodMap[o.item].count += o.qty || 1;
            });
            return Object.entries(prodMap).
            sort((a, b) => b[1].amount - a[1].amount).
            slice(0, 3).
            map(([item, data], idx) =>
            <View key={item} style={styles.topProdRow}>
                  <View style={[styles.rankBadge, idx === 0 && { backgroundColor: COLORS.gold }]}>
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                  </View>
                  <View style={styles.topProdInfo}>
                    <Text style={styles.topProdName} numberOfLines={1}>{item}</Text>
                    <Text style={styles.topProdMeta}>{data.count} units sold</Text>
                  </View>
                  <Text style={styles.topProdAmt}>₹{data.amount.toLocaleString()}</Text>
                </View>
            );
          })()}
        </View>

        {/* Recent Completed Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Completed Orders"}</Text>
          {paidOrders.slice(0, 8).map((order) =>
          <View key={order.id} style={styles.orderRow}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderBuyer}>{order.buyer}</Text>
                <Text style={styles.orderItem} numberOfLines={1}>{order.item}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmt}>₹{order.amount.toLocaleString()}</Text>
                <View style={styles.deliveredChip}>
                  <Text style={styles.deliveredText}>{"✓ Paid"}</Text>
                </View>
              </View>
            </View>
          )}
          {paidOrders.length > 8 &&
          <Text style={styles.moreText}>+{paidOrders.length - 8} more completed orders</Text>
          }
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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

  heroCard: { borderRadius: 24, padding: 24, marginBottom: 16, alignItems: 'center' },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  heroAmount: { fontSize: 40, fontWeight: '900', color: '#fff', marginBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around' },
  heroStat: { alignItems: 'center' },
  heroStatVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 3 },
  heroStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  section: {
    backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16,
    marginBottom: 14, ...SHADOWS.small
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },

  // Bar Chart
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingBottom: 4 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barAmt: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },
  barTrack: { height: 100, width: 28, justifyContent: 'flex-end' },
  bar: { width: 28, borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  barCount: { fontSize: 9, color: COLORS.textMuted },

  // Category
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  catBar: { flex: 1, height: 8, backgroundColor: COLORS.darkCard, borderRadius: 4, overflow: 'hidden' },
  catFill: { height: 8, borderRadius: 4 },
  catAmt: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, width: 75, textAlign: 'right' },
  catPct: { fontSize: 11, color: COLORS.textMuted, width: 30, textAlign: 'right' },

  // Top Products
  topProdRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.dark, borderRadius: 12, padding: 12, marginBottom: 8
  },
  rankBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.green + '30',
    alignItems: 'center', justifyContent: 'center'
  },
  rankText: { fontSize: 12, fontWeight: '800', color: COLORS.green },
  topProdInfo: { flex: 1 },
  topProdName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  topProdMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  topProdAmt: { fontSize: 14, fontWeight: '800', color: COLORS.green },

  // Orders
  orderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.creamDark
  },
  orderLeft: { flex: 1 },
  orderBuyer: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  orderItem: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  orderDate: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmt: { fontSize: 14, fontWeight: '800', color: COLORS.green },
  deliveredChip: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  deliveredText: { fontSize: 10, fontWeight: '700', color: COLORS.success },
  moreText: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 10 }
});