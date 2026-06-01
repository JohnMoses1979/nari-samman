import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  TouchableOpacity, Image } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const CATEGORY_TABS = ['All', 'food', 'textiles', 'crafts'];
const STATUS_TABS = ['All', 'Live', 'Pending'];

export default function ProductsListScreen({ navigation }) {const lang = useAppLanguage();

  const { products, pendingProducts, adminStats, approveProduct, rejectProduct } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Merge live products + pending with status flag
  const allProducts = [
  ...products.map((p) => ({ ...p, listStatus: 'live' })),
  ...pendingProducts.map((p) => ({ ...p, listStatus: 'pending' }))];


  const filtered = allProducts.filter((p) => {
    const matchSearch = !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchStatus = statusFilter === 'All' ||
    statusFilter === 'Live' && p.listStatus === 'live' ||
    statusFilter === 'Pending' && p.listStatus === 'pending';
    return matchSearch && matchCat && matchStatus;
  });

  const liveCount = allProducts.filter((p) => p.listStatus === 'live').length;
  const pendingCount = pendingProducts.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Products"}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{adminStats.productsListed}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Stats Bar */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBar}>
          {[
          { label: 'Total Listed', value: adminStats.productsListed, color: COLORS.gold },
          { label: 'Live', value: liveCount, color: COLORS.success },
          { label: 'Pending', value: pendingCount, color: COLORS.warning },
          { label: 'Categories', value: 3, color: COLORS.teal }].
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
            placeholder={"Search products or tags..."}
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch} />
          
          {search.length > 0 &&
          <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          }
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {CATEGORY_TABS.map((tab) =>
          <TouchableOpacity
            key={tab}
            onPress={() => setCatFilter(tab)}
            style={[styles.filterTab, catFilter === tab && styles.filterTabActive]}>
            
              <Text style={[styles.filterTabText, catFilter === tab && styles.filterTabTextActive]}>
                {tab === 'All' ? '🛍️ All' : tab === 'food' ? '🍯 Food' : tab === 'textiles' ? '🧵 Textiles' : '🏺 Crafts'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Status Filter */}
        <View style={styles.statusRow}>
          {STATUS_TABS.map((tab) =>
          <TouchableOpacity
            key={tab}
            onPress={() => setStatusFilter(tab)}
            style={[styles.statusTab, statusFilter === tab && styles.statusTabActive,
            tab === 'Pending' && pendingCount > 0 && statusFilter !== 'Pending' && styles.statusTabAlert]}>
            
              <Text style={[styles.statusTabText, statusFilter === tab && styles.statusTabTextActive]}>
                {tab}{tab === 'Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Product List */}
        <View style={styles.list}>
          <Text style={styles.listMeta}>{filtered.length} products</Text>

          {filtered.length === 0 ?
          <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>{"No products found"}</Text>
            </View> :

          filtered.map((product, i) =>
          <View
            key={`${product.listStatus}-${product.id}-${i}`}
            style={[styles.card, i > 0 && { marginTop: 10 }]}>
                
            {/* Status stripe */}
                <View style={[
            styles.statusStripe,
            { backgroundColor: product.listStatus === 'live' ? COLORS.success : COLORS.warning }]
            } />

                <View style={styles.cardRow}>
                  <View style={styles.imgBox}>
                    {imgSrc(product.image) ?
                <Image source={imgSrc(product.image)} style={styles.productImg} resizeMode="cover" /> :

                <Text style={styles.emoji}>{product.emoji}</Text>
                }
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productCat}>
                      {product.category === 'food' ? '🍯' : product.category === 'textiles' ? '🧵' : '🏺'} {product.category} · {product.unit}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
                      {product.mrp > product.price &&
                  <Text style={styles.mrp}>MRP ₹{product.mrp.toLocaleString()}</Text>
                  }
                    </View>
                    <View style={styles.metaRow}>
                      {product.rating > 0 &&
                  <Text style={styles.rating}>⭐ {product.rating}</Text>
                  }
                      {product.stock !== undefined &&
                  <Text style={[styles.stock, product.stock < 10 && { color: COLORS.error }]}>
                          📦 {product.stock} in stock
                        </Text>
                  }
                    </View>
                    {(product.tags || []).length > 0 &&
                <View style={styles.tagsRow}>
                        {(product.tags || []).slice(0, 3).map((t) =>
                  <View key={t} style={styles.tag}>
                            <Text style={styles.tagText}>{t}</Text>
                          </View>
                  )}
                      </View>
                }
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[
                styles.listStatusBadge,
                {
                  backgroundColor: product.listStatus === 'live' ?
                  COLORS.success + '20' : COLORS.warning + '20'
                }]
                }>
                      <Text style={[
                  styles.listStatusText,
                  { color: product.listStatus === 'live' ? COLORS.success : COLORS.warning }]
                  }>
                        {product.listStatus === 'live' ? '● Live' : '⏳ Pending'}
                      </Text>
                    </View>
                    {product.badge &&
                <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{product.badge}</Text>
                      </View>
                }
                  </View>
                </View>

                {/* Quick actions for pending */}
                {product.listStatus === 'pending' &&
            <View style={styles.pendingActions}>
                    <TouchableOpacity
                onPress={() => rejectProduct(product.id)}
                style={styles.rejectBtn}>
                
                      <Text style={styles.rejectBtnText}>✗ {"Reject"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                onPress={() => approveProduct(product.id)}
                style={styles.approveBtn}>
                
                      <Text style={styles.approveBtnText}>✓ {"Approve & Go Live"}</Text>
                    </TouchableOpacity>
                  </View>
            }
              </View>
          )
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
  countBadge: { backgroundColor: COLORS.teal, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  statsBar: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: 'rgba(200,208,228,0.6)', marginTop: 3 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, margin: 16, marginBottom: 8,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    ...SHADOWS.small
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  clearSearch: { fontSize: 16, color: COLORS.textMuted },
  filterRow: { paddingHorizontal: 16, paddingVertical: 6, gap: 8 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder
  },
  filterTabActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  filterTabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTabTextActive: { color: '#fff' },
  statusRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 6 },
  statusTab: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: COLORS.darkCard
  },
  statusTabActive: { backgroundColor: COLORS.purple },
  statusTabAlert: { borderWidth: 1.5, borderColor: COLORS.warning },
  statusTabText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  statusTabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  listMeta: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
  card: {
    backgroundColor: COLORS.darkCard, borderRadius: 16, ...SHADOWS.small,
    overflow: 'hidden'
  },
  statusStripe: { height: 3, width: '100%' },
  cardRow: { flexDirection: 'row', gap: 12, padding: 14, alignItems: 'flex-start' },
  imgBox: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },
  productImg: { width: 64, height: 64, borderRadius: 12 },
  emoji: { fontSize: 36 },
  cardInfo: { flex: 1 },
  productName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  productCat: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, textTransform: 'capitalize' },
  priceRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.saffron },
  mrp: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  rating: { fontSize: 11, color: COLORS.textSecondary },
  stock: { fontSize: 11, color: COLORS.success },
  tagsRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginTop: 6 },
  tag: { backgroundColor: COLORS.purple + '15', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, color: COLORS.purple, fontWeight: '600' },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  listStatusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  listStatusText: { fontSize: 11, fontWeight: '700' },
  badgePill: { backgroundColor: COLORS.saffron + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, color: COLORS.saffron, fontWeight: '700' },
  pendingActions: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingBottom: 12
  },
  rejectBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.error,
    paddingVertical: 9, alignItems: 'center'
  },
  rejectBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.error },
  approveBtn: {
    flex: 1.8, borderRadius: 10, backgroundColor: COLORS.success,
    paddingVertical: 9, alignItems: 'center'
  },
  approveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' }
});