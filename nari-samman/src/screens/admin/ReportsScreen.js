import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

const MONTHLY_DATA = [
{ month: 'Jan', orders: 82, revenue: 4.2 },
{ month: 'Feb', orders: 95, revenue: 5.1 },
{ month: 'Mar', orders: 110, revenue: 6.8 },
{ month: 'Apr', orders: 134, revenue: 8.4 },
{ month: 'May', orders: 156, revenue: 9.7 }];


const TOP_PRODUCTS = [
{ name: 'Pure Sundarbans Honey', sales: 234, revenue: 112320, emoji: '🍯' },
{ name: 'Tant Saree – Crimson Border', sales: 143, revenue: 171600, emoji: '👘' },
{ name: 'Jamdani Saree – White & Gold', sales: 67, revenue: 281400, emoji: '✨' },
{ name: 'Baluchari Silk – Mahabharata', sales: 28, revenue: 238000, emoji: '🧵' },
{ name: 'Clay Terracotta Horse', sales: 112, revenue: 42560, emoji: '🐴' }];


export default function ReportsScreen({ navigation }) {const lang = useAppLanguage();

  const { adminStats, getTotalOrders } = useStore();
  const liveTotalOrders = getTotalOrders ? getTotalOrders() : 0;

  const maxOrders = Math.max(...MONTHLY_DATA.map((d) => d.orders));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Reports"} & Analytics</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        

        {/* Summary KPIs */}
        <View style={styles.kpiRow}>
          {[
          { label: "Revenue", value: `₹${(adminStats.totalRevenue / 100000).toFixed(1)}L`, emoji: '💰', color: COLORS.success },
          { label: 'Total Orders', value: liveTotalOrders.toLocaleString(), emoji: '📦', color: COLORS.saffron },
          { label: 'Avg Order Value', value: '₹661', emoji: '📊', color: COLORS.purple },
          { label: 'Monthly Growth', value: `+${adminStats.monthlyGrowth}%`, emoji: '📈', color: COLORS.green }].
          map((k, i) =>
          <View key={i} style={styles.kpiCard}>
              <Text style={styles.kpiEmoji}>{k.emoji}</Text>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          )}
        </View>

        {/* Orders Trend Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"📊 Monthly Orders Trend"}</Text>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {MONTHLY_DATA.map((d, i) => {
                const barH = d.orders / maxOrders * 120;
                return (
                  <View key={i} style={styles.barItem}>
                    <Text style={styles.barValue}>{d.orders}</Text>
                    <LinearGradient
                      colors={[COLORS.saffron, COLORS.gold]}
                      style={[styles.bar, { height: barH }]} />
                    
                    <Text style={styles.barLabel}>{d.month}</Text>
                  </View>);

              })}
            </View>
          </View>
        </View>

        {/* Revenue Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Monthly {"Revenue"} (₹ Lakhs)</Text>
          <View style={styles.chartCard}>
            <View style={styles.bars}>
              {MONTHLY_DATA.map((d, i) => {
                const maxRev = Math.max(...MONTHLY_DATA.map((x) => x.revenue));
                const barH = d.revenue / maxRev * 120;
                return (
                  <View key={i} style={styles.barItem}>
                    <Text style={styles.barValue}>{d.revenue}L</Text>
                    <LinearGradient
                      colors={[COLORS.green, COLORS.greenLight]}
                      style={[styles.bar, { height: barH }]} />
                    
                    <Text style={styles.barLabel}>{d.month}</Text>
                  </View>);

              })}
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"🏷️ Sales by Category"}</Text>
          <View style={styles.chartCard}>
            {[
            { label: 'Food & Allied', pct: 38, color: COLORS.saffron, emoji: '🍯' },
            { label: 'Handloom & Textiles', pct: 45, color: COLORS.green, emoji: '🧵' },
            { label: 'Tribal Crafts', pct: 17, color: COLORS.purple, emoji: '🏺' }].
            map((c, i) =>
            <View key={i} style={styles.catRow}>
                <Text style={styles.catEmoji}>{c.emoji}</Text>
                <View style={styles.catInfo}>
                  <View style={styles.catLabelRow}>
                    <Text style={styles.catLabel}>{c.label}</Text>
                    <Text style={[styles.catPct, { color: c.color }]}>{c.pct}%</Text>
                  </View>
                  <View style={styles.catBarBg}>
                    <View style={[styles.catBarFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"🏆 Top Selling Products"}</Text>
          {TOP_PRODUCTS.map((p, i) =>
          <View key={i} style={styles.productRow}>
              <Text style={styles.rank}>#{i + 1}</Text>
              <Text style={styles.prodEmoji}>{p.emoji}</Text>
              <View style={styles.prodInfo}>
                <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.prodSales}>{p.sales} units sold</Text>
              </View>
              <Text style={styles.prodRevenue}>₹{(p.revenue / 1000).toFixed(0)}K</Text>
            </View>
          )}
        </View>

        {/* SHG Performance */}
        <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.shgSummary}>
          <Text style={styles.shgSummaryTitle}>{"SHG Performance Summary"}</Text>
          <View style={styles.shgStats}>
            {[
            { label: 'Active SHGs', value: adminStats.activeSHGs },
            { label: 'Total Members', value: '6,000+' },
            { label: 'Avg Payout/SHG', value: '₹3,200' },
            { label: 'Districts Covered', value: 12 }].
            map((s, i) =>
            <View key={i} style={styles.shgStatItem}>
                <Text style={styles.shgStatValue}>{s.value}</Text>
                <Text style={styles.shgStatLabel}>{s.label}</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* DPR Payout Split — 70/15/10/5% breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💸 {"Revenue"} Distribution (DPR Model)</Text>
          <View style={styles.chartCard}>
            <Text style={styles.splitSubtitle}>{"Every sale is split as per the Nari Samman DPR"}</Text>
            {[
            { label: 'SHG / Artisan Earnings', pct: 70, color: COLORS.green, emoji: '👩‍🏭' },
            { label: 'Platform Operations', pct: 15, color: COLORS.saffron, emoji: '🏦' },
            { label: 'Logistics & Delivery', pct: 10, color: COLORS.purple, emoji: '🚚' },
            { label: 'Marketing & Branding', pct: 5, color: COLORS.teal, emoji: '📣' }].
            map((s, i) =>
            <View key={i} style={styles.splitRow}>
                <Text style={styles.splitEmoji}>{s.emoji}</Text>
                <View style={styles.splitInfo}>
                  <View style={styles.splitLabelRow}>
                    <Text style={styles.splitLabel}>{s.label}</Text>
                    <Text style={[styles.splitPct, { color: s.color }]}>{s.pct}%</Text>
                  </View>
                  <View style={styles.splitBarBg}>
                    <View style={[styles.splitBarFill, { width: `${s.pct}%`, backgroundColor: s.color }]} />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.splitNote}>
              <Text style={styles.splitNoteText}>{"ℹ️ 70% of every sale goes directly to the SHG artisan — highest in the industry"}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, flexGrow: 1 },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  kpiCard: {
    width: (width - 52) / 2, backgroundColor: COLORS.darkCard, borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 4, ...SHADOWS.small
  },
  kpiEmoji: { fontSize: 24, marginBottom: 4 },
  kpiValue: { fontSize: 20, fontWeight: '800' },
  kpiLabel: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  chartCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 20, ...SHADOWS.medium },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 },
  barItem: { alignItems: 'center', gap: 6, flex: 1 },
  barValue: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },
  bar: { width: 32, borderRadius: 8, minHeight: 8 },
  barLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted },
  catRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  catEmoji: { fontSize: 22 },
  catInfo: { flex: 1 },
  catLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  catPct: { fontSize: 13, fontWeight: '800' },
  catBarBg: { height: 8, backgroundColor: COLORS.darkCard, borderRadius: 4, overflow: 'hidden' },
  catBarFill: { height: 8, borderRadius: 4 },
  productRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 8, ...SHADOWS.small
  },
  rank: { fontSize: 14, fontWeight: '800', color: COLORS.textMuted, width: 24 },
  prodEmoji: { fontSize: 26 },
  prodInfo: { flex: 1 },
  prodName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  prodSales: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  prodRevenue: { fontSize: 15, fontWeight: '800', color: COLORS.success },
  shgSummary: { borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.greenLight + '40' },
  shgSummaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.green, marginBottom: 16 },
  shgStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  shgStatItem: { width: '45%', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', ...SHADOWS.small },
  shgStatValue: { fontSize: 20, fontWeight: '800', color: COLORS.green },
  shgStatLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  splitSubtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 14 },
  splitRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  splitEmoji: { fontSize: 22 },
  splitInfo: { flex: 1 },
  splitLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  splitLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  splitPct: { fontSize: 14, fontWeight: '800' },
  splitBarBg: { height: 8, backgroundColor: COLORS.darkCard, borderRadius: 4, overflow: 'hidden' },
  splitBarFill: { height: 8, borderRadius: 4 },
  splitNote: { marginTop: 4, backgroundColor: COLORS.primary + '12', borderRadius: 12, padding: 10 },
  splitNoteText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 }
});