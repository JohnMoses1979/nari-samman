import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from "../../autoTranslation/AutoText";
import useAppLanguage from "../../autoTranslation/useAppLanguage";
import { adminGetAllKyc } from '../../services/api';


const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }) {
  const { adminStats, pendingProducts, allVendors, payoutRequests, getTotalOrders, pendingSHGRegistrations } = useStore();
  const lang = useAppLanguage();

  const [pendingKycCount, setPendingKycCount] = useState(0);
  const liveTotalOrders = getTotalOrders();
  useEffect(() => {
    adminGetAllKyc('PENDING')
      .then((res) => {
        if (res?.success) {
          setPendingKycCount(res.count || 0);
        }
      })
      .catch(() => { });
  }, []);
  const pendingPayoutCount = (payoutRequests || []).filter((r) => r.status === 'requested').length;
  const pendingSHGCount = (pendingSHGRegistrations || []).filter((r) => r.status === 'pending').length;
  const adminUnread =
    (pendingProducts || []).length +
    pendingPayoutCount +
    pendingSHGCount +
    pendingKycCount;

  const kpiCards = [
    { label: "Total Orders", value: liveTotalOrders.toLocaleString(), emoji: '📦', color: COLORS.saffron, gradient: [COLORS.saffron + '20', COLORS.gold + '10'], route: 'Orders' },
    { label: "Revenue", value: `₹${(adminStats.totalRevenue / 100000).toFixed(1)}L`, emoji: '💰', color: COLORS.success, gradient: [COLORS.success + '20', COLORS.mint + '10'], route: 'Revenue' },
    { label: "Active SHGs", value: adminStats.activeSHGs, emoji: '👩', color: COLORS.green, gradient: [COLORS.green + '20', COLORS.greenLight + '10'], route: 'SHGManagement' },
    { label: "Pending Approvals", value: adminStats.pendingApprovals, emoji: '⚙️', color: COLORS.warning, gradient: [COLORS.warning + '20', COLORS.gold + '10'], route: 'ProductApproval' },
    { label: "Total Artisans", value: `${(adminStats.totalArtisans / 1000).toFixed(0)}K+`, emoji: '👩‍🌾', color: COLORS.purple, gradient: [COLORS.purple + '20', '#C39BD3' + '10'], route: 'Artisans' },
    { label: "Products Listed", value: adminStats.productsListed, emoji: '🏷️', color: COLORS.teal, gradient: [COLORS.teal + '20', '#48C9B0' + '10'], route: 'ProductsList' }];


  const quickActions = [
    { emoji: '✅', label: "Approve Products", onPress: () => navigation.navigate('ProductApproval'), badge: adminStats.pendingApprovals },
    { emoji: '💸', label: "Payout Requests", onPress: () => navigation.navigate('PayoutRequests'), badge: pendingPayoutCount },
    { emoji: '👩‍🦱', label: "SHG Management", onPress: () => navigation.navigate('SHGManagement'), badge: pendingSHGCount },
    { emoji: '🪪', label: "KYC Review", onPress: () => navigation.navigate('AdminKycReview'), badge: pendingKycCount },
    { emoji: '🚚', label: "Logistics", onPress: () => navigation.navigate('Logistics') },
    { emoji: '📊', label: "Reports", onPress: () => navigation.navigate('Reports') },
    { emoji: '⚙️', label: "Settings", onPress: () => navigation.navigate('AdminSettings') },
    { emoji: '🏛️', label: "Entrepreneurs", onPress: () => navigation.navigate('Entrepreneurs') },
    { emoji: '🤝', label: "Distribution Agents", onPress: () => navigation.navigate('DistributionAgents') },
    { emoji: '🌍', label: "Export Market", onPress: () => navigation.navigate('ExportMarket') },
    { emoji: '🌐', label: "Multilingual UI", onPress: () => navigation.navigate('Multilingual') },
    { emoji: '📋', label: "NABARD Reports", onPress: () => navigation.navigate('NABARDReports') },
    { emoji: '🎓', label: "Training Centre", onPress: () => navigation.navigate('TrainingCentre') }];


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient colors={['#0F1822', '#1C2437', '#0F1822']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{"Admin Portal"} 🏛️</Text>
            <Text style={styles.title}>{"Nari Samman"}</Text>
            <Text style={styles.subtitle}>{"Warehouse & Operations Manager"}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications', { role: 'admin' })}
              style={styles.iconBtn}>
              <Text style={styles.iconText}>🔔</Text>
              {adminUnread > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{adminUnread > 9 ? '9+' : adminUnread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Growth Banner */}
        <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} style={styles.growthBanner}>
          <Text style={styles.growthEmoji}>📈</Text>
          <View>
            <Text style={styles.growthLabel}>{"Monthly Growth"}</Text>
            <Text style={styles.growthValue}>+{adminStats.monthlyGrowth}%</Text>
          </View>
          <View style={styles.growthRight}>
            <Text style={styles.growthLabel}>{"Happy Customers"}</Text>
            <Text style={styles.growthValue}>{(adminStats.happyCustomers / 1000).toFixed(1)}K</Text>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* KPI Grid — each card navigates to its dedicated screen */}
      <View style={styles.kpiGrid}>
        {kpiCards.map((k, i) =>
          <TouchableOpacity
            key={i}
            onPress={() => k.route && navigation.navigate(k.route)}
            activeOpacity={0.8}
            style={styles.kpiCardWrapper}>

            <LinearGradient colors={k.gradient} style={styles.kpiCard}>
              <Text style={styles.kpiEmoji}>{k.emoji}</Text>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={[styles.kpiArrow, { color: k.color }]}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* ── SHG Registration Alert Banner (shows only when pending regs exist) ── */}
      {pendingSHGCount > 0 &&
        <TouchableOpacity
          onPress={() => navigation.navigate('SHGManagement')}
          activeOpacity={0.85}
          style={styles.shgAlertBanner}>

          <LinearGradient
            colors={['rgba(255,152,0,0.18)', 'rgba(255,152,0,0.08)']}
            style={styles.shgAlertInner}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>

            <View style={styles.shgAlertLeft}>
              <Text style={styles.shgAlertEmoji}>🆕</Text>
              <View>
                <Text style={styles.shgAlertTitle}>
                  {pendingSHGCount} New SHG Registration{pendingSHGCount > 1 ? 's' : ''} Pending
                </Text>
                <Text style={styles.shgAlertSub}>{"Tap to review and approve applications"}</Text>
              </View>
            </View>
            <Text style={styles.shgAlertArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      }

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{"Quick Actions"}</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((a, i) =>
            <TouchableOpacity key={i} onPress={a.onPress} style={styles.actionCard}>
              <View style={styles.actionIconBox}>
                <Text style={styles.actionIcon}>{a.emoji}</Text>
                {a.badge > 0 &&
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{a.badge}</Text>
                  </View>
                }
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pending Approvals Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚠️ {"Pending Approvals"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProductApproval')}>
            <Text style={styles.seeAll}>{"View All →"}</Text>
          </TouchableOpacity>
        </View>
        {pendingProducts.slice(0, 3).map((p) =>
          <View key={p.id} style={styles.pendingCard}>
            <View style={styles.pendingImgBox}>
              {imgSrc(p.image) ?
                <Image source={imgSrc(p.image)} style={styles.pendingImg} resizeMode="cover" /> :

                <Text style={styles.pendingEmoji}>{p.emoji}</Text>
              }
            </View>
            <View style={styles.pendingInfo}>
              <Text style={styles.pendingName}>{p.name}</Text>
              <Text style={styles.pendingCat}>{p.category}</Text>
            </View>
            <View style={styles.pendingActions}>
              <Text style={styles.pendingPrice}>₹{p.price}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>{"Pending"}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Top SHGs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{"Top Performing SHGs"}</Text>
        {allVendors.slice(0, 3).map((v) =>
          <View key={v.id} style={styles.shgCard}>
            <Text style={styles.shgEmoji}>{v.avatar}</Text>
            <View style={styles.shgInfo}>
              <Text style={styles.shgName}>{v.name}</Text>
              <Text style={styles.shgSHGName}>{v.shg}</Text>
              <Text style={styles.shgLoc}>📍 {v.location}</Text>
            </View>
            <View style={styles.shgStats}>
              <Text style={styles.shgRating}>⭐ {v.rating}</Text>
              <Text style={styles.shgProducts}>{v.products} products</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(200,208,228,0.12)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconText: { fontSize: 18 },
  notifBadge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  greeting: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.gold },
  subtitle: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginTop: 4 },
  growthBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  growthEmoji: { fontSize: 28 },
  growthLabel: { fontSize: 11, color: 'rgba(200,208,228,0.5)' },
  growthValue: { fontSize: 20, fontWeight: '800', color: COLORS.gold },
  growthRight: { marginLeft: 'auto' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16 },
  kpiCardWrapper: { width: (width - 52) / 2 },
  kpiCard: { borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  kpiEmoji: { fontSize: 26, marginBottom: 4 },
  kpiValue: { fontSize: 22, fontWeight: '800' },
  kpiLabel: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  kpiArrow: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, color: COLORS.purple, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: (width - 64) / 3, alignItems: 'center', gap: 6 },
  actionIconBox: { width: 56, height: 56, borderRadius: 18, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small, position: 'relative' },
  actionIcon: { fontSize: 24 },
  actionBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.bengalRed, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  actionBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  actionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },
  pendingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, marginBottom: 8, gap: 12, ...SHADOWS.small, borderLeftWidth: 3, borderLeftColor: COLORS.warning },
  pendingEmoji: { fontSize: 32 },
  pendingImgBox: { width: 48, height: 48, borderRadius: 10, overflow: 'hidden', backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  pendingImg: { width: 48, height: 48, borderRadius: 10 },
  pendingInfo: { flex: 1 },
  pendingName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  pendingCat: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, textTransform: 'capitalize' },
  pendingActions: { alignItems: 'flex-end', gap: 6 },
  pendingPrice: { fontSize: 14, fontWeight: '700', color: COLORS.saffron },
  pendingBadge: { backgroundColor: COLORS.warning + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  pendingBadgeText: { fontSize: 10, color: COLORS.warning, fontWeight: '700' },
  shgCard: { flexDirection: 'row', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 8, gap: 12, ...SHADOWS.small },
  shgEmoji: { fontSize: 34 },
  shgInfo: { flex: 1 },
  shgName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  shgSHGName: { fontSize: 12, color: COLORS.green, marginTop: 2 },
  shgLoc: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  shgStats: { alignItems: 'flex-end' },
  shgRating: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  shgProducts: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },

  // ── SHG Pending Registration Alert Banner ──────────────────────────────────
  shgAlertBanner: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  shgAlertInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18,
    borderWidth: 1.5, borderColor: COLORS.warning + '50'
  },
  shgAlertLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  shgAlertEmoji: { fontSize: 28 },
  shgAlertTitle: { fontSize: 14, fontWeight: '800', color: COLORS.warning, marginBottom: 3 },
  shgAlertSub: { fontSize: 12, color: 'rgba(200,208,228,0.6)' },
  shgAlertArrow: { fontSize: 20, color: COLORS.warning, fontWeight: '700' }
});