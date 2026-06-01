import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

const INITIAL_ENTREPRENEURS = [
{
  id: 'en1', name: 'Adv. Anil Kodachadri', type: 'working', role: 'Vice President, IS&SF',
  focus: 'Strategy & Operations', equityPct: 12, invested: 600000, status: 'active',
  phone: '+91 98765 00001', email: 'anil@issf.org', joinedDate: '2024-01-01',
  description: 'Architect of the entrepreneurship model. Oversees procurement, marketing, and distribution.'
},
{
  id: 'en2', name: 'Devanjan Bose', type: 'working', role: 'Founder Sewak',
  focus: 'Platform & Technology', equityPct: 10, invested: 500000, status: 'active',
  phone: '+91 98765 00000', email: 'devanjan@issf.org', joinedDate: '2024-01-01',
  description: 'Platform architect. Manages e-commerce, digital marketing, and supply chain technology.'
},
{
  id: 'en3', name: 'Mr. Piyush Sharma', type: 'working', role: 'E-Commerce Lead',
  focus: 'Digital Marketplace', equityPct: 8, invested: 400000, status: 'active',
  phone: '+91 90001 23456', email: 'piyush@narisamman.in', joinedDate: '2024-03-01',
  description: 'Manages e-commerce partnerships, marketplace integrations, and digital sales channels.'
},
{
  id: 'en4', name: 'Kalamandalam Swarnadeepa', type: 'working', role: 'Textile Quality Lead',
  focus: 'Silk & Weaving QC', equityPct: 6, invested: 300000, status: 'active',
  phone: '+91 94501 67890', email: 'swarnadeepa@narisamman.in', joinedDate: '2024-02-15',
  description: 'Expert in silk saree quality assessment and weaving standards. Ensures GI-certified products.'
},
{
  id: 'en5', name: 'Mr. Vikas Gupta', type: 'working', role: 'SHG & Food Ecosystem',
  focus: 'FSSAI Compliance', equityPct: 5, invested: 250000, status: 'active',
  phone: '+91 99001 34567', email: 'vikas@narisamman.in', joinedDate: '2024-04-01',
  description: 'Grassroots SHG network and FSSAI compliance. Manages food product certification pipeline.'
},
{
  id: 'en6', name: 'Ms. Anamika Joshi', type: 'working', role: 'Food Processing Lead',
  focus: 'Namkeen & Processed Foods', equityPct: 4, invested: 200000, status: 'active',
  phone: '+91 88001 45678', email: 'anamika@narisamman.in', joinedDate: '2024-04-15',
  description: 'Indore-based namkeen and food processing expert. Manages production partnerships in MP.'
},
{
  id: 'en7', name: 'NABARD Regional Fund', type: 'silent', role: 'Institutional Investor',
  focus: 'Rural Infrastructure Refinance', equityPct: 20, invested: 2000000, status: 'active',
  phone: 'N/A', email: 'nabard@nabard.org', joinedDate: '2024-06-01',
  description: 'Provides warehouse refinance, rural infrastructure support, and SHG scheme financing.'
},
{
  id: 'en8', name: 'SIDBI SME Fund', type: 'silent', role: 'Silent Equity Investor',
  focus: 'Working Capital', equityPct: 15, invested: 1500000, status: 'active',
  phone: 'N/A', email: 'sidbi@sidbi.in', joinedDate: '2024-07-01',
  description: 'Provides MSME working capital and long-term strategic investment.'
},
{
  id: 'en9', name: 'West Bengal Tribal Welfare Fund', type: 'silent', role: 'Government Scheme',
  focus: 'Tribal Community Equity', equityPct: 10, invested: 1000000, status: 'active',
  phone: 'N/A', email: 'twf@wb.gov.in', joinedDate: '2024-08-01',
  description: 'State government support for tribal producer communities via NRLM convergence.'
},
{
  id: 'en10', name: 'Impact Investor (SHG Pool)', type: 'silent', role: 'Community Equity',
  focus: 'SHG Producer Ownership', equityPct: 10, invested: 500000, status: 'active',
  phone: 'N/A', email: 'shgpool@narisamman.in', joinedDate: '2024-09-01',
  description: 'Pooled equity stake held by SHG member representatives ensuring producer ownership.'
}];


export default function EntrepreneursScreen({ navigation }) {const lang = useAppLanguage();

  const [entrepreneurs, setEntrepreneurs] = useState(INITIAL_ENTREPRENEURS);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'working', role: '', focus: '', equityPct: '', invested: '', phone: '', email: '', description: '' });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelected(null);
      setShowModal(false);
    });

    return unsubscribe;
  }, [navigation]);

  const working = entrepreneurs.filter((e) => e.type === 'working');
  const silent = entrepreneurs.filter((e) => e.type === 'silent');
  const totalWorking = working.reduce((s, e) => s + e.equityPct, 0);
  const totalSilent = silent.reduce((s, e) => s + e.equityPct, 0);
  const totalInvested = entrepreneurs.reduce((s, e) => s + e.invested, 0);

  const filtered = filter === 'all' ? entrepreneurs : entrepreneurs.filter((e) => e.type === filter);

  const handleAdd = () => {
    if (!form.name || !form.role) return Alert.alert('Error', 'Name and role are required');
    const newE = {
      id: `en${Date.now()}`,
      ...form,
      equityPct: parseFloat(form.equityPct) || 0,
      invested: parseFloat(form.invested) || 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setEntrepreneurs((prev) => [...prev, newE]);
    setShowModal(false);
    setForm({ name: '', type: 'working', role: '', focus: '', equityPct: '', invested: '', phone: '', email: '', description: '' });
  };

  const getTypeColor = (type) => type === 'working' ? COLORS.primary : COLORS.purple;
  const getTypeLabel = (type) => type === 'working' ? 'Working' : 'Silent Investor';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"Entrepreneurs"}</Text>
          <Text style={styles.headerSub}>{"Anil Kodachadri Model · 50/50 Working & Silent"}</Text>
        </LinearGradient>

        {/* SPV Summary */}
        <View style={styles.spvBox}>
          <Text style={styles.spvTitle}>{"Special Purpose Vehicle (SPV) Overview"}</Text>
          <View style={styles.spvGrid}>
            <View style={styles.spvCard}>
              <Text style={styles.spvVal}>₹{(totalInvested / 100000).toFixed(1)}L</Text>
              <Text style={styles.spvLbl}>{"Total Capital"}</Text>
            </View>
            <View style={styles.spvCard}>
              <Text style={[styles.spvVal, { color: COLORS.primary }]}>{totalWorking}%</Text>
              <Text style={styles.spvLbl}>{"Working entrepreneurs"}</Text>
            </View>
            <View style={styles.spvCard}>
              <Text style={[styles.spvVal, { color: COLORS.purple }]}>{totalSilent}%</Text>
              <Text style={styles.spvLbl}>{"Silent Investors"}</Text>
            </View>
            <View style={styles.spvCard}>
              <Text style={styles.spvVal}>{entrepreneurs.length}</Text>
              <Text style={styles.spvLbl}>{"Stakeholders"}</Text>
            </View>
          </View>

          {/* Equity Bar */}
          <Text style={styles.equityLabel}>{"Equity Distribution"}</Text>
          <View style={styles.equityBar}>
            {entrepreneurs.map((e) =>
            <View
              key={e.id}
              style={[styles.equitySegment, {
                flex: e.equityPct,
                backgroundColor: e.type === 'working' ? COLORS.primary : COLORS.purple,
                opacity: 0.7 + e.equityPct / 30
              }]} />

            )}
          </View>
          <View style={styles.equityLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendTxt}>Working ({totalWorking}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.purple }]} />
              <Text style={styles.legendTxt}>Silent ({totalSilent}%)</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {['all', 'working', 'silent'].map((f) =>
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
              <Text style={[styles.filterTxt, filter === f && styles.filterTxtActive]}>
                {f === 'all' ? 'All' : f === 'working' ? '💼 Working' : '💰 Silent'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addBtn}>
            <Text style={styles.addBtnTxt}>{"+ Add"}</Text>
          </TouchableOpacity>
        </View>

        {/* Entrepreneur Cards */}
        {filtered.map((e) =>
        <TouchableOpacity key={e.id} onPress={() => setSelected(e)} style={styles.eCard}>
            <View style={styles.eCardTop}>
              <View style={styles.eAvatar}>
                <Text style={styles.eAvatarTxt}>{e.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={styles.eInfo}>
                <Text style={styles.eName}>{e.name}</Text>
                <Text style={styles.eRole}>{e.role}</Text>
                <Text style={styles.eFocus}>{e.focus}</Text>
              </View>
              <View style={styles.eRight}>
                <View style={[styles.eTypeBadge, { backgroundColor: getTypeColor(e.type) + '25', borderColor: getTypeColor(e.type) + '50' }]}>
                  <Text style={[styles.eTypeText, { color: getTypeColor(e.type) }]}>{getTypeLabel(e.type)}</Text>
                </View>
                <Text style={[styles.eEquity, { color: getTypeColor(e.type) }]}>{e.equityPct}%</Text>
                <Text style={styles.eInvested}>₹{(e.invested / 100000).toFixed(1)}L</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal transparent animationType="slide" visible={!!selected} onRequestClose={() => setSelected(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.detailModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selected ? (
                  <>
                    <View style={styles.detailHeader}>
                      <View style={styles.detailAvatar}>
                        <Text style={styles.detailAvatarTxt}>{selected.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.detailName}>{selected.name}</Text>
                        <Text style={styles.detailRole}>{selected.role}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelected(null)}>
                        <Text style={styles.closeX}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Type"}</Text><Text style={[styles.detailVal, { color: getTypeColor(selected.type) }]}>{getTypeLabel(selected.type)}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Focus Area"}</Text><Text style={styles.detailVal}>{selected.focus}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Equity Stake"}</Text><Text style={[styles.detailVal, { color: COLORS.primary }]}>{selected.equityPct}%</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Capital Invested"}</Text><Text style={[styles.detailVal, { color: COLORS.success }]}>₹{selected.invested.toLocaleString()}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Phone"}</Text><Text style={styles.detailVal}>{selected.phone}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Email"}</Text><Text style={styles.detailVal}>{selected.email}</Text></View>
                    <View style={styles.detailRow}><Text style={styles.detailLbl}>{"Joined"}</Text><Text style={styles.detailVal}>{selected.joinedDate}</Text></View>
                    <Text style={styles.detailDesc}>{selected.description}</Text>
                    <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                      <Text style={styles.closeBtnTxt}>{"Close"}</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>

      {/* Add Modal */}
      <Modal transparent animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.addModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.addModalTitle}>{"Add Entrepreneur / Investor"}</Text>
                {[
              ['name', 'Full Name *'],
              ['role', 'Role / Designation *'],
              ['focus', 'Focus Area'],
              ['equityPct', 'Equity % (e.g. 5)'],
              ['invested', 'Capital Invested (₹)'],
              ['phone', 'Phone'],
              ['email', 'Email']].
              map(([key, label]) =>
              <TextInput
                key={key}
                placeholder={label}
                placeholderTextColor={COLORS.textMuted}
                value={form[key]}
                onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                style={styles.input}
                keyboardType={['equityPct', 'invested'].includes(key) ? 'numeric' : 'default'} />

              )}
                <View style={styles.typeRow}>
                  {['working', 'silent'].map((t) =>
                <TouchableOpacity key={t} onPress={() => setForm((f) => ({ ...f, type: t }))} style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}>
                      <Text style={[styles.typeTxt, form.type === t && styles.typeTxtActive]}>{t === 'working' ? '💼 Working' : '💰 Silent'}</Text>
                    </TouchableOpacity>
                )}
                </View>
                <TextInput
                placeholder={"Description / Notes"}
                placeholderTextColor={COLORS.textMuted}
                value={form.description}
                onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                style={[styles.input, { height: 60 }]}
                multiline />
              
                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelBtn}><Text style={styles.cancelTxt}>{"Cancel"}</Text></TouchableOpacity>
                  <TouchableOpacity onPress={handleAdd} style={styles.saveBtn}><Text style={styles.saveTxt}>{"Add Stakeholder"}</Text></TouchableOpacity>
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
  spvBox: { margin: 16, backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.medium },
  spvTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  spvGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  spvCard: { flex: 1, minWidth: (width - 80) / 2, backgroundColor: COLORS.dark, borderRadius: 12, padding: 12, alignItems: 'center' },
  spvVal: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  spvLbl: { fontSize: 10, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  equityLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  equityBar: { height: 28, flexDirection: 'row', borderRadius: 14, overflow: 'hidden', marginBottom: 10 },
  equitySegment: { height: '100%' },
  equityLegend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 11, color: COLORS.textSecondary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14, alignItems: 'center' },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: COLORS.darkBorder },
  filterBtnActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  filterTxt: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  filterTxtActive: { color: COLORS.primary },
  addBtn: { marginLeft: 'auto', backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  addBtnTxt: { fontSize: 12, color: COLORS.darkDeep, fontWeight: '700' },
  eCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, ...SHADOWS.small },
  eCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  eAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary + '30', alignItems: 'center', justifyContent: 'center' },
  eAvatarTxt: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  eInfo: { flex: 1 },
  eName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  eRole: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  eFocus: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  eRight: { alignItems: 'flex-end', gap: 4 },
  eTypeBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  eTypeText: { fontSize: 10, fontWeight: '700' },
  eEquity: { fontSize: 18, fontWeight: '800' },
  eInvested: { fontSize: 11, color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  detailModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  detailAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary + '30', alignItems: 'center', justifyContent: 'center' },
  detailAvatarTxt: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  detailName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  detailRole: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  closeX: { fontSize: 20, color: COLORS.textMuted, padding: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  detailLbl: { fontSize: 12, color: COLORS.textMuted },
  detailVal: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  detailDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 14, lineHeight: 20 },
  closeBtn: { marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  closeBtnTxt: { fontSize: 15, fontWeight: '700', color: COLORS.darkDeep },
  addModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  addModalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  input: { backgroundColor: COLORS.dark, borderRadius: 10, padding: 12, fontSize: 13, color: COLORS.textPrimary, marginBottom: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.dark, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  typeBtnActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  typeTxt: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  typeTxtActive: { color: COLORS.primary },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.dark, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  cancelTxt: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveTxt: { fontSize: 14, color: COLORS.darkDeep, fontWeight: '700' }
});
