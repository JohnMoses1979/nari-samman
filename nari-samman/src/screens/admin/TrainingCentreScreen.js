import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const TRAINING_SESSIONS = [
{
  id: 't1', title: 'Natural Dyeing Techniques for Tant Weavers',
  trainer: 'Ms. Kalyani Mukherjee', category: 'Textiles',
  date: '2025-06-05', time: '10:00 AM – 1:00 PM',
  location: 'Nari Samman Warehouse, Sandeshkhali', seats: 30, enrolled: 24,
  status: 'upcoming', emoji: '🧵',
  description: 'Hands-on training on eco-friendly natural dye preparation using indigo, turmeric, and madder root. For Tant and Jamdani weavers.',
  enrolledSHGs: ['Sandeshkhali Weavers SHG', 'Minakhan Craft Collective', 'Hingalganj Textile Group']
},
{
  id: 't2', title: 'FSSAI Food Safety & Packaging Workshop',
  trainer: 'Mr. Subir Bhattacharya (FSSAI Officer)',
  category: 'Food', date: '2025-06-10', time: '9:00 AM – 12:00 PM',
  location: 'Nari Samman Warehouse, Sandeshkhali', seats: 40, enrolled: 38,
  status: 'upcoming', emoji: '🍯',
  description: 'FSSAI compliance, food labelling regulations, packaging norms for honey, jaggery, and spices. Certificate issued on completion.',
  enrolledSHGs: ['Sundarbans Honey Collective', 'Gosaba Food SHG', 'Basanti Spices Group']
},
{
  id: 't3', title: 'WhatsApp Commerce & Social Selling for Agents',
  trainer: 'Digital Sakhi Team, IS&SF',
  category: 'Digital', date: '2025-05-20', time: '2:00 PM – 5:00 PM',
  location: 'Online (Zoom) + Sandeshkhali Hub', seats: 50, enrolled: 47,
  status: 'completed', emoji: '📱',
  description: 'Training on using WhatsApp Business, creating product catalogues, handling orders via chat, and using Nari Samman agent portal.',
  enrolledSHGs: ['All Distribution Agents — Batch 1']
},
{
  id: 't4', title: 'Dokra Metal Casting — Advanced Techniques',
  trainer: 'Guru Lakshmi Karan, Bankura',
  category: 'Crafts', date: '2025-05-15', time: '10:00 AM – 4:00 PM',
  location: 'Nari Samman Warehouse, Sandeshkhali', seats: 20, enrolled: 18,
  status: 'completed', emoji: '🏺',
  description: 'Advanced lost-wax Dokra casting for tribal artisans. Covers design, mould-making, metal composition, and finishing for export-quality pieces.',
  enrolledSHGs: ['Bankura Dokra Artisans SHG', 'Bishnupur Tribal Craft Group']
},
{
  id: 't5', title: 'Bamboo Craft Product Design for Urban Markets',
  trainer: 'Mr. Arijit Gupta, NID Kolkata',
  category: 'Crafts', date: '2025-07-01', time: '10:00 AM – 3:00 PM',
  location: 'Nari Samman Warehouse, Sandeshkhali', seats: 25, enrolled: 8,
  status: 'upcoming', emoji: '🌿',
  description: 'Modern product design using traditional bamboo craft techniques. Focus on creating sustainable home decor and eco-utility items for urban export.',
  enrolledSHGs: ['Hingalganj Bamboo SHG']
},
{
  id: 't6', title: 'NABARD SHG Financial Management',
  trainer: 'NABARD WB Regional Office',
  category: 'Finance', date: '2025-07-15', time: '10:00 AM – 1:00 PM',
  location: 'Sandeshkhali Panchayat Hall', seats: 60, enrolled: 0,
  status: 'planned', emoji: '🏦',
  description: 'Group savings, bank-linkage, micro-loan utilisation, and NABARD SHG grading criteria. Mandatory for SHGs seeking refinance.',
  enrolledSHGs: []
}];


const CATEGORY_COLORS = {
  Textiles: COLORS.primary,
  Food: COLORS.saffron,
  Digital: '#25D366',
  Crafts: COLORS.purple,
  Finance: COLORS.teal
};

const STATUS_CONFIG = {
  upcoming: { color: COLORS.primary, label: '📅 Upcoming', bg: COLORS.primary + '20' },
  completed: { color: COLORS.success, label: '✅ Completed', bg: COLORS.success + '20' },
  planned: { color: COLORS.textMuted, label: '🗓 Planned', bg: COLORS.darkBorder + '40' }
};



export default function TrainingCentreScreen({ navigation }) {const lang = useAppLanguage();

  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ?
  TRAINING_SESSIONS :
  TRAINING_SESSIONS.filter((s) => s.status === filter);

  const upcoming = TRAINING_SESSIONS.filter((s) => s.status === 'upcoming');
  const completed = TRAINING_SESSIONS.filter((s) => s.status === 'completed');
  const totalEnrolled = TRAINING_SESSIONS.reduce((sum, s) => sum + s.enrolled, 0);

  const handleEnroll = (session) => {
    Alert.alert(
      `📝 ${"Enroll in Training"}`,
      `${"+ Enroll an SHG".replace('+ ', '')} "${session.title}" — ${"Seats Filled"}: ${session.seats - session.enrolled}`,
      [{ text: "SHG Management", onPress: () => navigation.navigate('SHGManagement') }, { text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"Training Centre"}</Text>
          <Text style={styles.headerSub}>{"Sandeshkhali Hub · Skill Development Programme"}</Text>
        </LinearGradient>

        {/* DPR note */}
        <View style={styles.dprNote}>
          <Text style={styles.dprIcon}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.dprTitle}>DPR Mandate: Rural Skill {"Training"}</Text>
            <Text style={styles.dprDesc}>
              The Nari Samman DPR requires regular skill training at the Sandeshkhali warehouse hub
              for SHG {"Artisans"} covering handloom, food safety, digital commerce, and financial literacy.
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.primary }]}>{upcoming.length}</Text><Text style={styles.statLbl}>{"Upcoming"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.success }]}>{completed.length}</Text><Text style={styles.statLbl}>{"Completed"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.saffron }]}>{totalEnrolled}</Text><Text style={styles.statLbl}>{"Enrolled"}</Text></View>
          <View style={styles.statCard}><Text style={styles.statVal}>{TRAINING_SESSIONS.length}</Text><Text style={styles.statLbl}>{"Total Sessions"}</Text></View>
        </View>

        {/* Category Legend */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) =>
          <View key={cat} style={[styles.catChip, { borderColor: color + '60', backgroundColor: color + '15' }]}>
              <Text style={[styles.catLabel, { color }]}>{cat}</Text>
            </View>
          )}
        </ScrollView>

        {/* Filter */}
        <View style={styles.filterRow}>
          {[['all', 'All Sessions'], ['upcoming', '📅 Upcoming'], ['completed', '✅ Completed'], ['planned', '🗓 Planned']].map(([key, label]) =>
          <TouchableOpacity key={key} onPress={() => setFilter(key)} style={[styles.filterBtn, filter === key && styles.filterActive]}>
              <Text style={[styles.filterTxt, filter === key && styles.filterTxtActive]}>{label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Session Cards */}
        {filtered.map((session) => {
          const st = STATUS_CONFIG[session.status];
          const catColor = CATEGORY_COLORS[session.category] || COLORS.textMuted;
          const seatPct = Math.round(session.enrolled / session.seats * 100);
          return (
            <TouchableOpacity key={session.id} onPress={() => setSelected(session)} style={styles.sessionCard}>
              <View style={styles.sessionTop}>
                <Text style={styles.sessionEmoji}>{session.emoji}</Text>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle} numberOfLines={2}>{session.title}</Text>
                  <View style={styles.sessionMeta}>
                    <View style={[styles.catTag, { backgroundColor: catColor + '20' }]}>
                      <Text style={[styles.catTagTxt, { color: catColor }]}>{session.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                      <Text style={[styles.statusTxt, { color: st.color }]}>{st.label}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.sessionDetails}>
                <Text style={styles.sessionDate}>📅 {session.date} · {session.time}</Text>
                <Text style={styles.sessionLoc}>📍 {session.location}</Text>
                <Text style={styles.sessionTrainer}>👩‍🏫 {session.trainer}</Text>
              </View>

              {session.status !== 'planned' &&
              <View style={styles.seatSection}>
                  <View style={styles.seatLabelRow}>
                    <Text style={styles.seatLabel}>{"Seats Filled"}</Text>
                    <Text style={[styles.seatPct, { color: seatPct > 85 ? COLORS.warning : COLORS.success }]}>{session.enrolled}/{session.seats}</Text>
                  </View>
                  <View style={styles.seatBar}>
                    <View style={[styles.seatFill, { width: `${seatPct}%`, backgroundColor: seatPct > 85 ? COLORS.warning : COLORS.success }]} />
                  </View>
                </View>
              }

              {session.status === 'upcoming' &&
              <TouchableOpacity onPress={() => handleEnroll(session)} style={styles.enrollBtn}>
                  <Text style={styles.enrollTxt}>{"+ Enroll an SHG"}</Text>
                </TouchableOpacity>
              }
            </TouchableOpacity>);

        })}

        {/* Session Detail Inline */}
        {selected &&
        <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailEmoji}>{selected.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailTitle}>{selected.title}</Text>
                <Text style={styles.detailTrainer}>👩‍🏫 {selected.trainer}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detailDesc}>{selected.description}</Text>
            {selected.enrolledSHGs.length > 0 &&
          <>
                <Text style={styles.enrolledTitle}>{"Enrolled SHGs:"}</Text>
                {selected.enrolledSHGs.map((shg) =>
            <Text key={shg} style={styles.enrolledSHG}>• {shg}</Text>
            )}
              </>
          }
          </View>
        }

        <View style={{ height: 30 }} />
      </ScrollView>
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
  dprNote: { margin: 16, backgroundColor: COLORS.primary + '15', borderRadius: 16, padding: 14, flexDirection: 'row', gap: 10, borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  dprIcon: { fontSize: 22 },
  dprTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  dprDesc: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 17 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', ...SHADOWS.small },
  statVal: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  catScroll: { marginBottom: 10 },
  catContent: { paddingHorizontal: 16, gap: 8 },
  catChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  catLabel: { fontSize: 11, fontWeight: '700' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: COLORS.darkBorder },
  filterActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  filterTxt: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  filterTxtActive: { color: COLORS.primary },
  sessionCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small },
  sessionTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  sessionEmoji: { fontSize: 32 },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 20, marginBottom: 6 },
  sessionMeta: { flexDirection: 'row', gap: 8 },
  catTag: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  catTagTxt: { fontSize: 10, fontWeight: '700' },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  sessionDetails: { gap: 4, marginBottom: 10 },
  sessionDate: { fontSize: 11, color: COLORS.textSecondary },
  sessionLoc: { fontSize: 11, color: COLORS.textMuted },
  sessionTrainer: { fontSize: 11, color: COLORS.primary },
  seatSection: { marginBottom: 10 },
  seatLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  seatLabel: { fontSize: 11, color: COLORS.textMuted },
  seatPct: { fontSize: 12, fontWeight: '700' },
  seatBar: { height: 6, backgroundColor: COLORS.dark, borderRadius: 3, overflow: 'hidden' },
  seatFill: { height: '100%', borderRadius: 3 },
  enrollBtn: { backgroundColor: COLORS.primary + '20', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary + '40' },
  enrollTxt: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  detailCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.primary + '40' },
  detailHeader: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  detailEmoji: { fontSize: 28 },
  detailTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 20 },
  detailTrainer: { fontSize: 11, color: COLORS.primary, marginTop: 3 },
  closeX: { fontSize: 20, color: COLORS.textMuted },
  detailDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 12 },
  enrolledTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  enrolledSHG: { fontSize: 12, color: COLORS.primary, paddingVertical: 2 }
});