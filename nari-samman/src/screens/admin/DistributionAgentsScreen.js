import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

const INITIAL_AGENTS = [
{
  id: 'ag1', name: 'Sunita Devi', zone: 'Salt Lake, Kolkata', state: 'West Bengal',
  phone: '+91 98111 11001', joined: '2024-03-01', status: 'active',
  salesThisMonth: 48600, totalSales: 182000, commissionEarned: 27300,
  customersServed: 34, ordersDelivered: 87, rating: 4.8,
  type: 'doorstep', channels: ['doorstep', 'whatsapp'],
  bio: 'Former SHG member, now empowered as a distribution agent across Salt Lake. Runs weekly product demonstrations at homes.'
},
{
  id: 'ag2', name: 'Mamoni Sarkar', zone: 'Barasat, N24PGS', state: 'West Bengal',
  phone: '+91 98111 11002', joined: '2024-03-15', status: 'active',
  salesThisMonth: 36200, totalSales: 145000, commissionEarned: 21750,
  customersServed: 28, ordersDelivered: 63, rating: 4.9,
  type: 'community_retail', channels: ['community_retail', 'whatsapp'],
  bio: 'Runs a community retail outlet from her home. Stocks and sells Nari Samman products to neighbours and local businesses.'
},
{
  id: 'ag3', name: 'Rupa Mahato', zone: 'Siliguri, Darjeeling', state: 'West Bengal',
  phone: '+91 97001 11003', joined: '2024-04-01', status: 'active',
  salesThisMonth: 52000, totalSales: 198000, commissionEarned: 29700,
  customersServed: 45, ordersDelivered: 104, rating: 4.7,
  type: 'social_commerce', channels: ['social_commerce', 'doorstep'],
  bio: 'Social media savvy agent running a WhatsApp community of 200+ women buyers. Creates reels showing artisan stories.'
},
{
  id: 'ag4', name: 'Preethi Nair', zone: 'Kochi, Ernakulam', state: 'Kerala',
  phone: '+91 94400 11004', joined: '2024-05-01', status: 'active',
  salesThisMonth: 67000, totalSales: 221000, commissionEarned: 33150,
  customersServed: 52, ordersDelivered: 118, rating: 4.9,
  type: 'doorstep', channels: ['doorstep', 'social_commerce'],
  bio: 'Serves Bengali community in Kochi. Specializes in sarees and textiles for Onam and Durga Puja seasons.'
},
{
  id: 'ag5', name: 'Anita Sharma', zone: 'Lajpat Nagar, Delhi', state: 'Delhi',
  phone: '+91 98701 11005', joined: '2024-05-15', status: 'active',
  salesThisMonth: 89000, totalSales: 267000, commissionEarned: 40050,
  customersServed: 61, ordersDelivered: 142, rating: 4.8,
  type: 'community_retail', channels: ['community_retail', 'whatsapp', 'doorstep'],
  bio: 'Top performing agent. Serves a dense Bengali community around Lajpat Nagar. Runs a boutique corner for Nari Samman.'
},
{
  id: 'ag6', name: 'Lalitha Reddy', zone: 'Madhapur, Hyderabad', state: 'Telangana',
  phone: '+91 90000 11006', joined: '2024-06-01', status: 'pending',
  salesThisMonth: 0, totalSales: 0, commissionEarned: 0,
  customersServed: 0, ordersDelivered: 0, rating: 0,
  type: 'social_commerce', channels: ['social_commerce'],
  bio: 'New agent in Hyderabad. Plans to use social commerce to reach Telugu Bengali communities in IT hubs.'
}];


const CHANNEL_ICONS = {
  doorstep: '🚶‍♀️',
  whatsapp: '💬',
  community_retail: '🏪',
  social_commerce: '📱'
};
const CHANNEL_LABELS = {
  doorstep: 'Doorstep',
  whatsapp: 'WhatsApp',
  community_retail: 'Community Retail',
  social_commerce: 'Social Commerce'
};

export default function DistributionAgentsScreen({ navigation }) {const lang = useAppLanguage();

  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', zone: '', state: '', phone: '', type: 'doorstep', bio: '' });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelected(null);
      setShowAdd(false);
    });

    return unsubscribe;
  }, [navigation]);

  const activeAgents = agents.filter((a) => a.status === 'active');
  const totalSales = activeAgents.reduce((s, a) => s + a.totalSales, 0);
  const totalCommission = activeAgents.reduce((s, a) => s + a.commissionEarned, 0);
  const totalOrders = activeAgents.reduce((s, a) => s + a.ordersDelivered, 0);

  const filtered = filter === 'all' ? agents : agents.filter((a) => a.type === filter);

  const approveAgent = (id) => {
    setAgents((prev) => prev.map((a) => a.id === id ? { ...a, status: 'active' } : a));
    Alert.alert('Agent Activated', 'Distribution agent is now active and can start selling.');
  };

  const handleAdd = () => {
    if (!form.name || !form.zone) return Alert.alert('Error', 'Name and zone are required');
    const newAgent = {
      id: `ag${Date.now()}`,
      ...form,
      joined: new Date().toISOString().split('T')[0],
      status: 'pending',
      salesThisMonth: 0, totalSales: 0, commissionEarned: 0,
      customersServed: 0, ordersDelivered: 0, rating: 0,
      channels: [form.type]
    };
    setAgents((prev) => [...prev, newAgent]);
    setShowAdd(false);
    setForm({ name: '', zone: '', state: '', phone: '', type: 'doorstep', bio: '' });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"Distribution Agents"}</Text>
          <Text style={styles.headerSub}>{"Shakti Amma Model · Destination Empowerment"}</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statVal}>{activeAgents.length}</Text><Text style={styles.statLbl}>{"Active Agents"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.primary }]}>₹{(totalSales / 100000).toFixed(1)}L</Text><Text style={styles.statLbl}>{"Total Sales"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.success }]}>₹{(totalCommission / 1000).toFixed(0)}K</Text><Text style={styles.statLbl}>{"Commission Paid"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.purple }]}>{totalOrders}</Text><Text style={styles.statLbl}>{"Orders Delivered"}</Text></View>
        </View>

        {/* How it works */}
        <View style={styles.modelBox}>
          <Text style={styles.modelTitle}>{"🌟 Destination Empowerment Model"}</Text>
          <Text style={styles.modelDesc}>
            Inspired by HUL's Shakti Amma — women agents earn 15% commission on every sale.
            They serve as doorstep distributors, community retailers, WhatsApp commerce nodes,
            and social commerce influencers in their local areas.
          </Text>
          <View style={styles.channelGrid}>
            {Object.entries(CHANNEL_ICONS).map(([key, icon]) =>
            <View key={key} style={styles.channelChip}>
                <Text style={styles.channelIcon}>{icon}</Text>
                <Text style={styles.channelLbl}>{CHANNEL_LABELS[key]}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Filter + Add */}
        <View style={styles.filterRow}>
          {['all', 'doorstep', 'community_retail', 'social_commerce'].map((f) =>
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterActive]}>
              <Text style={[styles.filterTxt, filter === f && styles.filterTxtActive]}>
                {f === 'all' ? 'All' : CHANNEL_LABELS[f]}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addBtn}>
          <Text style={styles.addBtnTxt}>{"+ Enroll New Agent"}</Text>
        </TouchableOpacity>

        {/* Agent Cards */}
        {filtered.map((agent) =>
        <TouchableOpacity key={agent.id} onPress={() => setSelected(agent)} style={styles.agentCard}>
            <View style={styles.agentTop}>
              <View style={styles.agentAvatar}>
                <Text style={styles.agentAvatarTxt}>{agent.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={styles.agentInfo}>
                <View style={styles.agentNameRow}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: agent.status === 'active' ? COLORS.success + '25' : COLORS.warning + '25' }]}>
                    <Text style={[styles.statusTxt, { color: agent.status === 'active' ? COLORS.success : COLORS.warning }]}>
                      {agent.status === 'active' ? '● Active' : '⏳ Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.agentZone}>📍 {agent.zone}, {agent.state}</Text>
                <View style={styles.agentChannels}>
                  {agent.channels.map((c) =>
                <Text key={c} style={styles.channelTag}>{CHANNEL_ICONS[c]} {CHANNEL_LABELS[c]}</Text>
                )}
                </View>
              </View>
            </View>
            {agent.status === 'active' &&
          <View style={styles.agentStats}>
                <View style={styles.agentStat}><Text style={styles.agentStatVal}>₹{(agent.salesThisMonth / 1000).toFixed(0)}K</Text><Text style={styles.agentStatLbl}>{"This Month"}</Text></View>
                <View style={styles.agentStat}><Text style={[styles.agentStatVal, { color: COLORS.success }]}>₹{(agent.commissionEarned / 1000).toFixed(0)}K</Text><Text style={styles.agentStatLbl}>{"Commission"}</Text></View>
                <View style={styles.agentStat}><Text style={[styles.agentStatVal, { color: COLORS.purple }]}>{agent.ordersDelivered}</Text><Text style={styles.agentStatLbl}>{"Delivered"}</Text></View>
                {agent.rating > 0 && <View style={styles.agentStat}><Text style={[styles.agentStatVal, { color: COLORS.warning }]}>⭐ {agent.rating}</Text><Text style={styles.agentStatLbl}>{"Rating"}</Text></View>}
              </View>
          }
            {agent.status === 'pending' &&
          <TouchableOpacity onPress={() => approveAgent(agent.id)} style={styles.approveBtn}>
                <Text style={styles.approveTxt}>{"✓ Approve & Activate Agent"}</Text>
              </TouchableOpacity>
          }
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal transparent animationType="slide" visible={!!selected} onRequestClose={() => setSelected(null)}>
          <View style={styles.overlay}>
            <View style={styles.detailModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selected ? (
                <>
                <View style={styles.detailTop}>
                  <View style={styles.detailAvatar}>
                    <Text style={styles.detailAvatarTxt}>{selected.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailName}>{selected.name}</Text>
                    <Text style={styles.detailZone}>📍 {selected.zone}, {selected.state}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
                </View>
                <Text style={styles.detailBio}>{selected.bio}</Text>
                <View style={styles.detailGrid}>
                  {[
                ['Phone', selected.phone],
                ['Joined', selected.joined],
                ['Status', selected.status === 'active' ? '✅ Active' : '⏳ Pending'],
                ['Total Sales', `₹${selected.totalSales.toLocaleString()}`],
                ['Commission', `₹${selected.commissionEarned.toLocaleString()}`],
                ['Customers', selected.customersServed.toString()],
                ['Orders Delivered', selected.ordersDelivered.toString()],
                ['Rating', selected.rating > 0 ? `⭐ ${selected.rating}` : 'N/A']].
                map(([lbl, val]) =>
                <View key={lbl} style={styles.detailRow}>
                      <Text style={styles.detailLbl}>{lbl}</Text>
                      <Text style={styles.detailVal}>{val}</Text>
                    </View>
                )}
                </View>
                <View style={styles.channelSection}>
                  <Text style={styles.channelTitle}>{"Sales Channels"}</Text>
                  <View style={styles.channelPills}>
                    {selected.channels.map((c) =>
                  <View key={c} style={styles.channelPill}>
                        <Text style={styles.channelPillTxt}>{CHANNEL_ICONS[c]} {CHANNEL_LABELS[c]}</Text>
                      </View>
                  )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnTxt}>{"Close"}</Text>
                </TouchableOpacity>
                </>) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>

      {/* Add Agent Modal */}
      <Modal transparent animationType="slide" visible={showAdd} onRequestClose={() => setShowAdd(false)}>
          <View style={styles.overlay}>
            <View style={styles.addModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.addTitle}>{"Enroll Distribution Agent"}</Text>
                {[['name', 'Full Name *'], ['zone', 'Zone / Area *'], ['state', 'State'], ['phone', 'Phone Number']].map(([k, l]) =>
              <TextInput key={k} placeholder={l} placeholderTextColor={COLORS.textMuted} value={form[k]}
              onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))} style={styles.input} />
              )}
                <Text style={styles.typeLabel}>{"Primary Channel"}</Text>
                <View style={styles.typeRow}>
                  {['doorstep', 'community_retail', 'social_commerce'].map((t) =>
                <TouchableOpacity key={t} onPress={() => setForm((f) => ({ ...f, type: t }))} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}>
                      <Text style={styles.typeIcon}>{CHANNEL_ICONS[t]}</Text>
                      <Text style={[styles.typeTxt, form.type === t && { color: COLORS.primary }]}>{CHANNEL_LABELS[t]}</Text>
                    </TouchableOpacity>
                )}
                </View>
                <TextInput placeholder={"Short bio / notes"} placeholderTextColor={COLORS.textMuted} value={form.bio}
              onChangeText={(v) => setForm((f) => ({ ...f, bio: v }))} style={[styles.input, { height: 60 }]} multiline />
                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={() => setShowAdd(false)} style={styles.cancelBtn}><Text style={styles.cancelTxt}>{"Cancel"}</Text></TouchableOpacity>
                  <TouchableOpacity onPress={handleAdd} style={styles.saveBtn}><Text style={styles.saveTxt}>{"Enroll Agent"}</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flexGrow: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { marginBottom: 12 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', ...SHADOWS.small },
  statVal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  statLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  modelBox: { marginHorizontal: 16, marginBottom: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  modelTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  modelDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  channelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  channelChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.dark, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  channelIcon: { fontSize: 14 },
  channelLbl: { fontSize: 11, color: COLORS.textSecondary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: COLORS.darkBorder },
  filterActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  filterTxt: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  filterTxtActive: { color: COLORS.primary },
  addBtn: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  addBtnTxt: { fontSize: 14, fontWeight: '700', color: COLORS.darkDeep },
  agentCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, ...SHADOWS.small },
  agentTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  agentAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.teal + '30', alignItems: 'center', justifyContent: 'center' },
  agentAvatarTxt: { fontSize: 14, fontWeight: '800', color: COLORS.teal },
  agentInfo: { flex: 1 },
  agentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  agentName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  agentZone: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  agentChannels: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  channelTag: { fontSize: 10, color: COLORS.teal, backgroundColor: COLORS.teal + '15', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  agentStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.darkBorder, paddingTop: 10, gap: 8 },
  agentStat: { flex: 1, alignItems: 'center' },
  agentStatVal: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  agentStatLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  approveBtn: { marginTop: 8, backgroundColor: COLORS.success + '20', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.success + '40' },
  approveTxt: { fontSize: 13, fontWeight: '700', color: COLORS.success },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  detailModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  detailAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.teal + '30', alignItems: 'center', justifyContent: 'center' },
  detailAvatarTxt: { fontSize: 16, fontWeight: '800', color: COLORS.teal },
  detailName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  detailZone: { fontSize: 12, color: COLORS.textMuted },
  closeX: { fontSize: 20, color: COLORS.textMuted },
  detailBio: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 14, fontStyle: 'italic' },
  detailGrid: { gap: 0 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  detailLbl: { fontSize: 12, color: COLORS.textMuted },
  detailVal: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  channelSection: { marginTop: 14 },
  channelTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  channelPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  channelPill: { backgroundColor: COLORS.teal + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  channelPillTxt: { fontSize: 12, color: COLORS.teal, fontWeight: '600' },
  closeBtn: { marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  closeBtnTxt: { fontSize: 15, fontWeight: '700', color: COLORS.darkDeep },
  addModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  addTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  input: { backgroundColor: COLORS.dark, borderRadius: 10, padding: 12, fontSize: 13, color: COLORS.textPrimary, marginBottom: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  typeLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { flex: 1, padding: 8, borderRadius: 10, backgroundColor: COLORS.dark, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  typeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  typeIcon: { fontSize: 18, marginBottom: 3 },
  typeTxt: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.dark, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  cancelTxt: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveTxt: { fontSize: 14, color: COLORS.darkDeep, fontWeight: '700' }
});
