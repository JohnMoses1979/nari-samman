import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const KYC_STATUS = {
  verified: { label: 'KYC Verified', color: COLORS.green || '#4CAF50', emoji: '✅' },
  pending: { label: 'KYC Pending', color: COLORS.warning || '#FF9800', emoji: '⏳' },
  rejected: { label: 'KYC Rejected', color: COLORS.bengalRed, emoji: '❌' }
};

const CATEGORY_COLORS = {
  food: { bg: '#FF980020', text: '#FF9800' },
  textiles: { bg: '#9C27B020', text: '#9C27B0' },
  crafts: { bg: '#2196F320', text: '#2196F3' }
};

export default function SHGManagementScreen({ navigation }) {const lang = useAppLanguage();

  const { shgGroups, toggleSHGStatus, updateSHGKYC, pendingSHGRegistrations, approveSHGRegistration, rejectSHGRegistration } = useStore();

  const [search, setSearch] = useState('');
  const [filterKYC, setFilterKYC] = useState('all'); // all | verified | pending | rejected
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const KYC_FILTERS = ['all', 'verified', 'pending', 'rejected'];
  const CAT_FILTERS = ['all', 'food', 'textiles', 'crafts'];

  const filtered = (shgGroups || []).filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.shgName.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const matchKYC = filterKYC === 'all' || s.kycStatus === filterKYC;
    const matchCat = filterCategory === 'all' || s.category === filterCategory;
    return matchSearch && matchKYC && matchCat;
  });

  const stats = [
  { label: "Total", value: shgGroups?.length || 0, color: COLORS.textPrimary },
  { label: "Active", value: shgGroups?.filter((s) => s.isActive).length || 0, color: COLORS.green || '#4CAF50' },
  { label: "Verified", value: shgGroups?.filter((s) => s.kycStatus === 'verified').length || 0, color: COLORS.saffron },
  { label: "Pending", value: shgGroups?.filter((s) => s.kycStatus === 'pending').length || 0, color: COLORS.warning || '#FF9800' }];


  const handleKYCUpdate = (shg, newStatus) => {
    if (Platform.OS === 'web') {
      updateSHGKYC(shg.id, newStatus);
    } else {
      Alert.alert("KYC Status", `Set ${shg.shgName} KYC to "${newStatus}"?`, [
      { text: "Cancel", style: 'cancel' },
      { text: "Confirm", onPress: () => updateSHGKYC(shg.id, newStatus) }]
      );
    }
  };

  const handleApproveReg = (reg) => {
    if (Platform.OS === 'web') {
      approveSHGRegistration(reg.id);
    } else {
      Alert.alert("Approve SHG", `Approve and onboard "${reg.shgName}"?`, [
      { text: "Cancel", style: 'cancel' },
      { text: "Approve", onPress: () => approveSHGRegistration(reg.id) }]
      );
    }
  };

  const handleRejectReg = (reg) => {
    if (Platform.OS === 'web') {
      rejectSHGRegistration(reg.id, 'Rejected by admin');
    } else {
      Alert.alert("Reject SHG", `Reject registration for "${reg.shgName}"?`, [
      { text: "Cancel", style: 'cancel' },
      { text: "Reject", style: 'destructive', onPress: () => rejectSHGRegistration(reg.id, 'Rejected by admin') }]
      );
    }
  };

  const handleToggleActive = (shg) => {
    if (Platform.OS === 'web') {
      toggleSHGStatus(shg.id);
    } else {
      const action = shg.isActive ? "Inactive" : "Active";
      Alert.alert(`${action} SHG`, `${action} ${shg.shgName}?`, [
      { text: "Cancel", style: 'cancel' },
      { text: action, onPress: () => toggleSHGStatus(shg.id) }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"SHG Management"}</Text>
        <Text style={styles.headerCount}>{filtered.length}/{shgGroups?.length || 0}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Banner */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.statsBar}>
          {stats.map((s, i) =>
          <View key={i} style={styles.statItem}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── Pending SHG Registrations Queue ── */}
        {(pendingSHGRegistrations || []).filter((r) => r.status === 'pending').length > 0 &&
        <View style={styles.regSection}>
            <View style={styles.regHeader}>
              <Text style={styles.regHeaderText}>{"🆕 New Registration Requests"}</Text>
              <View style={styles.regBadge}>
                <Text style={styles.regBadgeText}>
                  {(pendingSHGRegistrations || []).filter((r) => r.status === 'pending').length}
                </Text>
              </View>
            </View>
            {(pendingSHGRegistrations || []).filter((r) => r.status === 'pending').map((reg) =>
          <View key={reg.id} style={styles.regCard}>
                <View style={styles.regTopRow}>
                  <View style={styles.regAvatar}>
                    <Text style={styles.regAvatarText}>{reg.leaderName?.charAt(0) || '?'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.regName}>{reg.leaderName}</Text>
                    <Text style={styles.regSHGName}>{reg.shgName}</Text>
                    <Text style={styles.regMeta}>📍 {reg.location}  ·  👥 {reg.members} members</Text>
                    <Text style={styles.regMeta}>🏷️ {reg.category}  ·  📅 {reg.submittedAt}</Text>
                  </View>
                  <View style={styles.pendingRegBadge}>
                    <Text style={styles.pendingRegBadgeText}>{"Pending"}</Text>
                  </View>
                </View>
                <View style={styles.regContact}>
                  <Text style={styles.regContactText}>✉️  {reg.email}</Text>
                  <Text style={styles.regContactText}>📞  {reg.phone}</Text>
                  <Text style={styles.regContactText}>🛍️ Products: {reg.productSummary?.totalProducts || 0} submitted</Text>
                  <Text style={styles.regContactText}>🪪 KYC: {reg.kycSubmitted ? 'Document photos submitted' : 'Pending'}</Text>
                  <Text style={styles.regContactText}>🏦 Bank: {reg.bankDetails?.bankName ? `${reg.bankDetails.bankName} · ${reg.bankDetails.ifsc || ''}` : 'Pending'}</Text>
                </View>
                <View style={styles.regActions}>
                  <TouchableOpacity
                onPress={() => handleApproveReg(reg)}
                style={styles.approveBtn}>
                
                    <Text style={styles.approveBtnText}>{"✅ Approve & Onboard"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                onPress={() => handleRejectReg(reg)}
                style={styles.rejectBtn}>
                
                    <Text style={styles.rejectBtnText}>❌ {"Reject"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
          )}
          </View>
        }

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={"Search SHGs, name, location..."}
              placeholderTextColor="rgba(200,208,228,0.35)" />
            
            {search ?
            <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>✕</Text>
              </TouchableOpacity> :
            null}
          </View>
        </View>

        {/* KYC Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
          {KYC_FILTERS.map((f) =>
          <TouchableOpacity key={f} onPress={() => setFilterKYC(f)}
          style={[styles.filterChip, filterKYC === f && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, filterKYC === f && styles.filterChipTextActive]}>
                {f === 'all' ? '🏷️ All KYC' : KYC_STATUS[f]?.emoji + ' ' + KYC_STATUS[f]?.label}
              </Text>
            </TouchableOpacity>
          )}
          {CAT_FILTERS.filter((f) => f !== 'all').map((f) =>
          <TouchableOpacity key={f} onPress={() => setFilterCategory((prev) => prev === f ? 'all' : f)}
          style={[styles.filterChip, filterCategory === f && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, filterCategory === f && styles.filterChipTextActive]}>
                {f === 'food' ? '🍯 Food' : f === 'textiles' ? '🧵 Textiles' : '🏺 Crafts'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* SHG List */}
        <View style={styles.list}>
          {filtered.length === 0 ?
          <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={styles.emptyText}>{"No SHGs found"}</Text>
            </View> :
          filtered.map((item) => {
            const kyc = KYC_STATUS[item.kycStatus] || KYC_STATUS.pending;
            const catColor = CATEGORY_COLORS[item.category] || { bg: '#fff1', text: '#fff' };
            const isExpanded = expandedId === item.id;
            return (
              <View key={item.id} style={[styles.card, !item.isActive && styles.cardInactive]}>
                {/* Card Header */}
                <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : item.id)} activeOpacity={0.8}>
                  <View style={styles.cardTop}>
                    <Text style={styles.avatar}>{item.avatar}</Text>
                    <View style={styles.cardInfo}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        {!item.isActive && <View style={styles.inactiveBadge}><Text style={styles.inactiveBadgeText}>{"Inactive"}</Text></View>}
                      </View>
                      <Text style={styles.shgName}>{item.shgName}</Text>
                      <Text style={styles.location}>📍 {item.location}</Text>
                      <View style={styles.cardBadgesRow}>
                        <View style={[styles.kycBadge, { backgroundColor: kyc.color + '20' }]}>
                          <Text style={[styles.kycBadgeText, { color: kyc.color }]}>{kyc.emoji} {kyc.label}</Text>
                        </View>
                        <View style={[styles.catBadge, { backgroundColor: catColor.bg }]}>
                          <Text style={[styles.catBadgeText, { color: catColor.text }]}>{item.category}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>

                  {/* Stats chips */}
                  <View style={styles.statsChips}>
                    <View style={styles.chip}><Text style={styles.chipText}>⭐ {item.rating}</Text></View>
                    <View style={[styles.chip, { backgroundColor: '#4CAF5020' }]}><Text style={[styles.chipText, { color: '#4CAF50' }]}>👥 {item.members} members</Text></View>
                    <View style={[styles.chip, { backgroundColor: COLORS.saffron + '20' }]}><Text style={[styles.chipText, { color: COLORS.saffron }]}>🛍️ {item.products} products</Text></View>
                    {item.bankLinked && <View style={[styles.chip, { backgroundColor: '#2196F320' }]}><Text style={[styles.chipText, { color: '#2196F3' }]}>{"✓ Bank Linked"}</Text></View>}
                  </View>
                </TouchableOpacity>

                {/* Expanded Details */}
                {isExpanded &&
                <View style={styles.expandedSection}>
                    <View style={styles.divider} />

                    {/* Contact Info */}
                    <Text style={styles.expandSectionTitle}>{"📋 Contact & Details"}</Text>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📞</Text>
                        <Text style={styles.detailLabel}>{"Phone"}</Text>
                        <Text style={styles.detailValue}>{item.phone || 'Not provided'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📧</Text>
                        <Text style={styles.detailLabel}>{"Email"}</Text>
                        <Text style={styles.detailValue}>{item.email || 'Not provided'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailLabel}>{"Joined"}</Text>
                        <Text style={styles.detailValue}>{item.joinedDate}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>💰</Text>
                        <Text style={styles.detailLabel}>{"Revenue"}</Text>
                        <Text style={styles.detailValue}>₹{(item.totalRevenue || 0).toLocaleString()}</Text>
                      </View>
                    </View>

                    {/* Story */}
                    <Text style={styles.expandSectionTitle}>{"SHG Story"}</Text>
                    <Text style={styles.storyText}>"{item.story}"</Text>

                    {/* KYC Actions */}
                    <Text style={styles.expandSectionTitle}>{"🔐 KYC Management"}</Text>
                    <View style={styles.actionRow}>
                      {['verified', 'pending', 'rejected'].filter((s) => s !== item.kycStatus).map((s) =>
                    <TouchableOpacity key={s} onPress={() => handleKYCUpdate(item, s)}
                    style={[styles.kycActionBtn, { backgroundColor: KYC_STATUS[s].color + '20', borderColor: KYC_STATUS[s].color + '40' }]}>
                          <Text style={[styles.kycActionText, { color: KYC_STATUS[s].color }]}>
                            {KYC_STATUS[s].emoji} Set {KYC_STATUS[s].label}
                          </Text>
                        </TouchableOpacity>
                    )}
                    </View>

                    {/* Activate / Deactivate */}
                    <Text style={styles.expandSectionTitle}>{"⚙️ Account Control"}</Text>
                    <TouchableOpacity
                    onPress={() => handleToggleActive(item)}
                    style={[styles.toggleBtn, item.isActive ? styles.deactivateBtn : styles.activateBtn]}>
                    
                      <Text style={[styles.toggleBtnText, { color: item.isActive ? COLORS.bengalRed : '#4CAF50' }]}>
                        {item.isActive ? '🚫 Deactivate SHG' : '✅ Activate SHG'}
                      </Text>
                    </TouchableOpacity>

                    {/* SHG Employees */}
                    {item.employees?.length > 0 &&
                  <>
                        <Text style={[styles.expandSectionTitle, { marginTop: 14 }]}>👥 SHG Members ({item.employees.length})</Text>
                        {item.employees.map((emp) =>
                    <View key={emp.id} style={styles.empRow}>
                            <View style={styles.empAvatar}>
                              <Text style={styles.empAvatarText}>{emp.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.empInfo}>
                              <Text style={styles.empName}>{emp.name}</Text>
                              <Text style={styles.empRole}>{emp.role}</Text>
                            </View>
                            <Text style={styles.empJoined}>Joined {emp.joinedDate?.slice(5)}</Text>
                          </View>
                    )}
                      </>
                  }
                  </View>
                }
              </View>);

          })}
        </View>
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
  headerCount: { fontSize: 13, color: COLORS.textMuted },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 11, color: 'rgba(200,208,228,0.6)', marginTop: 2 },
  searchRow: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.darkCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  filterBar: { marginTop: 10 },
  filterContent: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: COLORS.darkBorder },
  filterChipActive: { backgroundColor: COLORS.purple + '20', borderColor: COLORS.purple },
  filterChipText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  filterChipTextActive: { color: COLORS.purple },
  list: { padding: 16, gap: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 15, color: COLORS.textMuted },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.medium },
  cardInactive: { opacity: 0.6 },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: { fontSize: 40, marginTop: 4 },
  cardInfo: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  inactiveBadge: { backgroundColor: COLORS.bengalRed + '20', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  inactiveBadgeText: { fontSize: 9, color: COLORS.bengalRed, fontWeight: '800', letterSpacing: 0.5 },
  shgName: { fontSize: 13, color: COLORS.green || '#4CAF50', fontWeight: '600', marginTop: 2 },
  location: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  cardBadgesRow: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  kycBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  kycBadgeText: { fontSize: 11, fontWeight: '700' },
  catBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  catBadgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  expandArrow: { fontSize: 12, color: COLORS.textMuted, paddingTop: 6 },
  statsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip: { backgroundColor: COLORS.gold + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: COLORS.goldDark || COLORS.gold, fontWeight: '600' },
  expandedSection: { marginTop: 12 },
  divider: { height: 1, backgroundColor: COLORS.darkBorder, marginBottom: 14 },
  expandSectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailGrid: { gap: 8, marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 },
  detailIcon: { fontSize: 16, width: 22 },
  detailLabel: { fontSize: 12, color: COLORS.textMuted, width: 100 },
  detailValue: { flex: 1, fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  storyText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 12 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  kycActionBtn: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  kycActionText: { fontSize: 12, fontWeight: '700' },
  toggleBtn: { borderRadius: 14, paddingVertical: 12, alignItems: 'center', borderWidth: 1, marginTop: 4 },
  deactivateBtn: { backgroundColor: COLORS.bengalRed + '15', borderColor: COLORS.bengalRed + '40' },
  activateBtn: { backgroundColor: '#4CAF5015', borderColor: '#4CAF5040' },
  toggleBtnText: { fontSize: 14, fontWeight: '700' },

  // ── New SHG Registration Queue styles ──────────────────────────────────────
  regSection: { marginHorizontal: 16, marginBottom: 16, marginTop: 12 },
  regHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  regHeaderText: { fontSize: 15, fontWeight: '800', color: COLORS.warning },
  regBadge: { backgroundColor: COLORS.warning, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, minWidth: 26, alignItems: 'center' },
  regBadgeText: { fontSize: 12, fontWeight: '800', color: '#0F1822' },
  regCard: {
    backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: COLORS.warning + '40',
    borderLeftWidth: 4, borderLeftColor: COLORS.warning
  },
  regTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  regAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.warning + '25', alignItems: 'center', justifyContent: 'center'
  },
  regAvatarText: { fontSize: 18, fontWeight: '800', color: COLORS.warning },
  regName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  regSHGName: { fontSize: 12, color: COLORS.green || '#4CAF50', fontWeight: '600', marginTop: 2 },
  regMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, lineHeight: 17 },
  pendingRegBadge: { backgroundColor: COLORS.warning + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pendingRegBadgeText: { fontSize: 9, color: COLORS.warning, fontWeight: '800', letterSpacing: 0.5 },
  regContact: { flexDirection: 'row', gap: 16, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 },
  regContactText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  regActions: { flexDirection: 'row', gap: 10 },
  approveBtn: { flex: 1, backgroundColor: '#4CAF5020', borderRadius: 12, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF5050' },
  approveBtnText: { fontSize: 13, fontWeight: '700', color: '#4CAF50' },
  rejectBtn: { flex: 0.5, backgroundColor: COLORS.bengalRed + '15', borderRadius: 12, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: COLORS.bengalRed + '40' },
  rejectBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.bengalRed },

  // Employee rows
  empRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, marginBottom: 6 },
  empAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.saffron + '25', alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.saffron },
  empInfo: { flex: 1 },
  empName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  empRole: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  empJoined: { fontSize: 10, color: COLORS.textMuted }
});