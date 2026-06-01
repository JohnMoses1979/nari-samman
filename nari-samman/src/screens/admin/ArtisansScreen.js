import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import useAppLanguage from '../../autoTranslation/useAppLanguage';
import { adminListVendors } from '../../services/api';

const CATEGORY_FILTER = ['All', 'Food', 'Textiles', 'Crafts'];

export default function ArtisansScreen({ navigation }) {
  useAppLanguage();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError('');
    try {
      const res = await adminListVendors();
      if (res?.success) setVendors(res.vendors || []);
      else setError(res?.message || 'Failed to load vendors');
    } catch (e) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors(true);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (vendors || []).filter((v) => {
      const matchSearch = !q
        || v.leaderName?.toLowerCase().includes(q)
        || v.shgName?.toLowerCase().includes(q)
        || v.email?.toLowerCase().includes(q)
        || v.village?.toLowerCase().includes(q)
        || v.district?.toLowerCase().includes(q);

      const matchCategory = filter === 'All'
        || (v.category || '').toLowerCase() === filter.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [vendors, search, filter]);

  const totalCount = vendors?.length || 0;
  const approvedCount = vendors.filter((v) => (v.approvalStatus || '').toLowerCase() === 'approved').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'← Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{'Vendors'}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{totalCount.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchVendors(false); }}
            tintColor={COLORS.purple}
          />
        }
      >
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBanner}>
          {[
            { label: 'Total Vendors', value: `${totalCount}`, color: COLORS.gold },
            { label: 'Approved', value: `${approvedCount}`, color: COLORS.green },
            { label: 'Pending', value: `${Math.max(0, totalCount - approvedCount)}`, color: COLORS.warning },
            { label: 'Updated', value: 'Live', color: COLORS.teal },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </LinearGradient>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={'Search vendors...'}
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {CATEGORY_FILTER.map((c) => {
            const active = filter === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setFilter(c)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          <Text style={styles.listMeta}>Showing {filtered.length} vendors</Text>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={COLORS.purple} />
              <Text style={styles.loadingText}>Loading vendors...</Text>
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchVendors(true)} style={styles.retryBtn}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map((v) => {
              const isExpanded = expanded === v.id;
              const location = [v.village, v.district, v.state].filter(Boolean).join(', ');
              const status = (v.approvalStatus || 'pending').toUpperCase();
              const statusColor = status === 'APPROVED' ? COLORS.success : status === 'REJECTED' ? COLORS.error : COLORS.warning;

              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setExpanded(isExpanded ? null : v.id)}
                  activeOpacity={0.86}
                  style={[styles.card, { marginBottom: 12 }]}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.avatarBox}>
                      <Text style={styles.avatar}>👩‍🌾</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name}>{v.leaderName || `Vendor #${v.id}`}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                        </View>
                      </View>
                      {v.shgName ? <Text style={styles.shgName}>{v.shgName}</Text> : null}
                      {location ? <Text style={styles.location}>{location}</Text> : null}
                      {v.email ? <Text style={styles.location}>{v.email}</Text> : null}
                      <Text style={styles.expandArrow}>{isExpanded ? '▲ Hide' : '▼ Details'}</Text>
                    </View>
                  </View>

                  {isExpanded ? (
                    <View style={styles.expandedSection}>
                      <View style={styles.expandDivider} />
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vendor ID</Text>
                        <Text style={styles.detailValue}>{String(v.id)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Mobile</Text>
                        <Text style={styles.detailValue}>{v.mobileNumber || '-'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Category</Text>
                        <Text style={styles.detailValue}>{v.category || '-'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Created</Text>
                        <Text style={styles.detailValue}>{v.createdAt || '-'}</Text>
                      </View>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.darkCard,
    ...SHADOWS.small,
  },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  countBadge: { backgroundColor: COLORS.purple, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  statsBanner: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: 'rgba(200,208,228,0.6)', marginTop: 3 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.darkCard,
    margin: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.small,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  clearSearch: { fontSize: 16, color: COLORS.textMuted },

  filterRow: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  filterChip: { borderRadius: 18, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingHorizontal: 12, paddingVertical: 7 },
  filterChipActive: { backgroundColor: COLORS.purple + '20', borderColor: COLORS.purple + '55' },
  filterText: { color: COLORS.textMuted, fontWeight: '700', fontSize: 12 },
  filterTextActive: { color: COLORS.purple },

  list: { paddingHorizontal: 16, paddingTop: 6 },
  listMeta: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },

  centered: { paddingVertical: 30, alignItems: 'center' },
  loadingText: { color: COLORS.textMuted, marginTop: 10 },
  errorText: { color: COLORS.error, fontWeight: '700', textAlign: 'center' },
  retryBtn: { marginTop: 12, backgroundColor: COLORS.purple, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  retryText: { color: '#fff', fontWeight: '800' },

  card: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.medium },
  cardTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatarBox: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center' },
  avatar: { fontSize: 28 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  statusBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '800' },
  shgName: { fontSize: 12, color: COLORS.green, fontWeight: '600', marginTop: 3 },
  location: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  expandArrow: { fontSize: 12, color: COLORS.textMuted, marginTop: 8, fontWeight: '700' },

  expandedSection: { marginTop: 12 },
  expandDivider: { height: 1, backgroundColor: COLORS.darkBorder, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { color: COLORS.textMuted, fontWeight: '700', fontSize: 12 },
  detailValue: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 12 },
});

