import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  TouchableOpacity } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: COLORS.warning, bg: COLORS.warning + '20', emoji: '🕐' },
  confirmed: { label: 'Confirmed', color: COLORS.info, bg: COLORS.info + '20', emoji: '✅' },
  processing: { label: 'Processing', color: COLORS.purple, bg: COLORS.purple + '20', emoji: '⚙️' },
  packed: { label: 'Packed', color: COLORS.teal, bg: COLORS.teal + '20', emoji: '📦' },
  sent_to_logistics: { label: 'With Logistics', color: COLORS.warning, bg: COLORS.warning + '20', emoji: '🏭' },
  shipped: { label: 'Shipped', color: COLORS.green, bg: COLORS.green + '20', emoji: '🚚' },
  delivered: { label: 'Delivered', color: COLORS.success, bg: COLORS.success + '20', emoji: '🎉' }
};

const FILTER_TABS = ['All', 'Active', 'Logistics', 'Shipped', 'Delivered'];

export default function OrdersScreen({ navigation }) {const lang = useAppLanguage();

  const { vendorOrders, orders, user, getTotalOrders, loadAdminOrders } = useStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    loadAdminOrders().catch(() => {});
  }, [loadAdminOrders]);

  // Merge consumer orders + vendor orders for admin view
  const allOrders = [
  ...orders.map((o) => ({
    id: o.id,
    buyer: user?.name || 'Consumer',
    items: o.items?.length ?? 1,
    amount: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    date: o.date,
    address: o.address,
    tracking: o.tracking,
    source: 'consumer'
  })),
  ...vendorOrders.map((o) => ({
    id: o.id,
    buyer: o.buyer,
    items: o.qty,
    amount: o.amount,
    status: o.status,
    paymentStatus: o.paymentStatus,
    date: o.date,
    address: '—',
    tracking: o.tracking,
    source: 'vendor',
    item: o.item,
    consumerOrderId: o.consumerOrderId
  }))].
  sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = allOrders.filter((o) => {
    const matchSearch = !search ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' ||
    (activeFilter === 'Active' && ['pending', 'confirmed', 'processing', 'packed'].includes(o.status)) ||
    (activeFilter === 'Logistics' && o.status === 'sent_to_logistics') ||
    o.status.toLowerCase() === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const summary = {
    total: allOrders.length,
    pending: allOrders.filter((o) => ['pending', 'confirmed', 'processing', 'packed', 'sent_to_logistics'].includes(o.status)).length,
    shipped: allOrders.filter((o) => o.status === 'shipped').length,
    delivered: allOrders.filter((o) => o.status === 'delivered').length
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Orders"}</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{getTotalOrders().toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Stats Bar */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBar}>
          {[
          { label: 'Total', value: summary.total, color: COLORS.gold },
          { label: 'Active', value: summary.pending, color: COLORS.warning },
          { label: 'Shipped', value: summary.shipped, color: COLORS.green },
          { label: 'Delivered', value: summary.delivered, color: COLORS.success }].
          map((s, i) =>
          <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={"Search by order ID or buyer..."}
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch} />
          
          {search.length > 0 &&
          <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          }
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          
          {FILTER_TABS.map((tab) =>
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveFilter(tab)}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}>
            
              <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Order List */}
        <View style={styles.list}>
          <Text style={styles.listMeta}>
            Showing {filtered.length} of {allOrders.length} orders
          </Text>
          {filtered.length === 0 ?
          <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>{"No orders found"}</Text>
            </View> :

          filtered.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <TouchableOpacity
                key={`${order.source}_${order.id}`}
                style={[styles.card, i > 0 && { marginTop: 10 }]}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('AdminOrderDetail', { orderId: order.id, source: order.source })}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.orderId}>#{order.id}</Text>
                      <Text style={styles.buyer}>👤 {order.buyer}</Text>
                      <Text style={styles.date}>📅 {order.date}</Text>
                      {order.address !== '—' &&
                    <Text style={styles.address} numberOfLines={1}>📍 {order.address}</Text>
                    }
                      <View style={styles.sourceBadge}>
                        <Text style={styles.sourceText}>
                          {order.source === 'consumer' ? '🛒 Consumer Order' : '🏪 Vendor Order'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.amount}>₹{order.amount.toLocaleString()}</Text>
                      <Text style={styles.items}>{order.items} item{order.items !== 1 ? 's' : ''}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={styles.statusEmoji}>{cfg.emoji}</Text>
                        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                    </View>
                  </View>
                  {order.tracking &&
                <View style={styles.trackingBar}>
                      <Text style={styles.trackingText}>🚦 {order.tracking}</Text>
                    </View>
                }
                  <Text style={styles.openText}>{"Open Details →"}</Text>
                </TouchableOpacity>);

          })
          }
        </View>

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
  totalBadge: { backgroundColor: COLORS.saffron, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  totalBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 20, paddingHorizontal: 8
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: 'rgba(200,208,228,0.6)', marginTop: 3 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, margin: 16, marginBottom: 8,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    ...SHADOWS.small
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  clearSearch: { fontSize: 16, color: COLORS.textMuted, paddingHorizontal: 4 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder
  },
  filterTabActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  filterTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterTabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  listMeta: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  cardLeft: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, fontFamily: 'monospace' },
  buyer: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  date: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  address: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  sourceBadge: {
    marginTop: 8, alignSelf: 'flex-start',
    backgroundColor: COLORS.darkCard, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3
  },
  sourceText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
  items: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4
  },
  statusEmoji: { fontSize: 12 },
  statusText: { fontSize: 11, fontWeight: '700' },
  trackingBar: {
    marginTop: 10, backgroundColor: COLORS.darkCard,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7
  },
  trackingText: { fontSize: 12, color: COLORS.textSecondary },
  openText: { marginTop: 10, fontSize: 12, color: COLORS.purple, fontWeight: '800', textAlign: 'right' }
});
