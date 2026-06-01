import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const MOCK_ANNOUNCEMENTS = [
{
  id: 'ann1', title: 'New Quality Standards for Food Products',
  body: 'All food products must now include FSSAI certification number on packaging before listing. Products without certification will not be approved.',
  target: 'All Vendors', date: '2025-05-10', priority: 'high', emoji: '⚠️'
},
{
  id: 'ann2', title: 'Festive Season Sale – June 2025',
  body: 'Prepare your best products! We are running a national marketing campaign for Eid and Bengali New Year. Discount up to 20% encouraged.',
  target: 'All', date: '2025-05-08', priority: 'normal', emoji: '🎉'
},
{
  id: 'ann3', title: 'Silk Weavers Collective Registration Open',
  body: 'New registration open for Murshidabad and Bishnupur silk weavers. Interested SHGs can apply through the portal by May 20.',
  target: 'Textile Vendors', date: '2025-05-05', priority: 'normal', emoji: '🧵'
},
{
  id: 'ann4', title: 'Logistics Update – Extended North Bengal Coverage',
  body: 'We now serve Cooch Behar, Jalpaiguri, and Darjeeling districts. Artisans in these areas can now register with the platform.',
  target: 'All', date: '2025-05-01', priority: 'low', emoji: '🚚'
}];


const PRIORITY_COLORS = {
  high: { bg: COLORS.error + '20', text: COLORS.error, label: '🔴 High' },
  normal: { bg: COLORS.info + '20', text: COLORS.info, label: '🔵 Normal' },
  low: { bg: COLORS.success + '20', text: COLORS.success, label: '🟢 Low' }
};

const TARGETS = [
'All',
'All Vendors',
'Food SHGs',
'Textile SHGs',
'Craft SHGs',
'Distribution Agents',
'NABARD Partners'];




export default function AnnouncementsScreen({ navigation }) {const lang = useAppLanguage();

  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', target: 'All', priority: 'normal' });

  const handleSend = () => {
    if (!form.title || !form.body) {
      Alert.alert('Missing Info', 'Please fill in title and message.');
      return;
    }
    const newAnn = {
      id: `ann${Date.now()}`,
      title: form.title, body: form.body,
      target: form.target, priority: form.priority,
      date: new Date().toISOString().split('T')[0],
      emoji: '📢'
    };
    setAnnouncements([newAnn, ...announcements]);
    setForm({ title: '', body: '', target: 'All', priority: 'normal' });
    setShowCompose(false);
    Alert.alert('✅ Sent!', `Announcement sent to ${form.target}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Announcements"}</Text>
        <TouchableOpacity onPress={() => setShowCompose(!showCompose)} style={styles.composeBtn}>
          <Text style={styles.composeBtnText}>{showCompose ? '✕ Close' : '+ New'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Compose Panel */}
        {showCompose &&
        <View style={styles.composeCard}>
            <Text style={styles.composeTitle}>{"📢 New Announcement"}</Text>

            <Text style={styles.fieldLabel}>{"Title *"}</Text>
            <TextInput
            style={styles.input}
            placeholder={"Announcement title..."}
            placeholderTextColor={COLORS.textMuted}
            value={form.title}
            onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
          

            <Text style={styles.fieldLabel}>{"Message *"}</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={"Write your announcement here..."}
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            value={form.body}
            onChangeText={(v) => setForm((f) => ({ ...f, body: v }))} />
          

            <Text style={styles.fieldLabel}>{"Target Audience"}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
              {TARGETS.map((t) =>
            <TouchableOpacity
              key={t}
              onPress={() => setForm((f) => ({ ...f, target: t }))}
              style={[styles.chip, form.target === t && styles.chipActive]}>
              
                  <Text style={[styles.chipText, form.target === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
            )}
            </ScrollView>

            <Text style={styles.fieldLabel}>{"Priority"}</Text>
            <View style={styles.priorityRow}>
              {['high', 'normal', 'low'].map((p) =>
            <TouchableOpacity
              key={p}
              onPress={() => setForm((f) => ({ ...f, priority: p }))}
              style={[styles.priorityChip, { backgroundColor: PRIORITY_COLORS[p].bg }, form.priority === p && { borderWidth: 2, borderColor: PRIORITY_COLORS[p].text }]}>
              
                  <Text style={[styles.priorityText, { color: PRIORITY_COLORS[p].text }]}>{PRIORITY_COLORS[p].label}</Text>
                </TouchableOpacity>
            )}
            </View>

            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <LinearGradient colors={[COLORS.purple, '#9B59B6']} style={styles.sendGrad}>
                <Text style={styles.sendText}>{"📢 Send Announcement"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }

        {/* announcements List */}
        <View style={styles.list}>
          <Text style={styles.listTitle}>Recent announcements ({announcements.length})</Text>
          {announcements.map((ann) => {
            const p = PRIORITY_COLORS[ann.priority];
            return (
              <View key={ann.id} style={[styles.annCard, { borderLeftColor: p.text }]}>
                <View style={styles.annHeader}>
                  <Text style={styles.annEmoji}>{ann.emoji}</Text>
                  <View style={styles.annHeaderRight}>
                    <View style={[styles.priorityBadge, { backgroundColor: p.bg }]}>
                      <Text style={[styles.priorityBadgeText, { color: p.text }]}>{p.label}</Text>
                    </View>
                    <Text style={styles.annDate}>{ann.date}</Text>
                  </View>
                </View>
                <Text style={styles.annTitle}>{ann.title}</Text>
                <Text style={styles.annBody} numberOfLines={3}>{ann.body}</Text>
                <View style={styles.annFooter}>
                  <View style={styles.targetBadge}>
                    <Text style={styles.targetText}>📣 {ann.target}</Text>
                  </View>
                </View>
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small
  },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  composeBtn: { backgroundColor: COLORS.purple, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  composeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  composeCard: { backgroundColor: COLORS.darkCard, margin: 16, borderRadius: 20, padding: 20, ...SHADOWS.medium },
  composeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.purple, marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.darkCard, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: 'transparent',
    marginBottom: 14
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder },
  chipActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: '#fff' },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  priorityChip: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  priorityText: { fontSize: 12, fontWeight: '700' },
  sendBtn: { borderRadius: 50, overflow: 'hidden' },
  sendGrad: { paddingVertical: 14, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { padding: 16 },
  listTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  annCard: {
    backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16,
    marginBottom: 12, ...SHADOWS.small, borderLeftWidth: 4
  },
  annHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  annEmoji: { fontSize: 24 },
  annHeaderRight: { alignItems: 'flex-end', gap: 4 },
  priorityBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  priorityBadgeText: { fontSize: 10, fontWeight: '700' },
  annDate: { fontSize: 10, color: COLORS.textMuted },
  annTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  annBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  annFooter: { marginTop: 10 },
  targetBadge: { backgroundColor: COLORS.purple + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  targetText: { fontSize: 11, color: COLORS.purple, fontWeight: '600' }
});