import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const REPORT_TEMPLATES = [
{
  id: 'r1', name: 'NABARD SHG Quarterly Report', scheme: 'NABARD',
  description: 'Quarterly report of SHG activities, production volumes, revenue, and employment for NABARD refinance review.',
  lastGenerated: '2025-04-01', format: 'PDF + Excel',
  data: { shgCount: 214, activeMembers: 3842, productsSold: 1240, revenue: 824000, employment: 512, training: 18 }
},
{
  id: 'r2', name: 'NRLM Livelihood Progress Report', scheme: 'NRLM',
  description: 'National Rural Livelihood Mission progress report showing income generation and community upliftment metrics.',
  lastGenerated: '2025-03-15', format: 'PDF',
  data: { households: 1280, incomePerHH: 4800, microEnterprises: 214, loanRepayment: 96 }
},
{
  id: 'r3', name: 'PMFME Scheme Report', scheme: 'PMFME',
  description: 'PM Formalisation of Micro Food Processing Enterprises — food product compliance, FSSAI status, and formalisation progress.',
  lastGenerated: '2025-04-15', format: 'Excel',
  data: { foodSHGs: 89, fssaiLicensed: 67, formalized: 156, foodRevenue: 320000 }
},
{
  id: 'r4', name: 'MSME Handloom & Handicraft Report', scheme: 'MSME',
  description: 'Ministry of MSME report for handloom and handicraft clusters — artisan count, GI products, and weaver welfare.',
  lastGenerated: '2025-02-01', format: 'PDF + Excel',
  data: { artisans: 1640, giProducts: 6, handloomRevenue: 420000, weavers: 380 }
},
{
  id: 'r5', name: 'Tribal Welfare Scheme Report', scheme: 'Tribal',
  description: 'West Bengal Tribal Welfare Department report on tribal artisan income, craft preservation, and community empowerment.',
  lastGenerated: '2025-01-15', format: 'PDF',
  data: { tribalSHGs: 62, crafts: 34, tribalRevenue: 180000, events: 8 }
},
{
  id: 'r6', name: 'Warehouse Refinance – NABARD', scheme: 'NABARD',
  description: 'Warehouse utilisation report for NABARD Rural Infrastructure Development Fund (RIDF) refinance claim.',
  lastGenerated: '2025-05-01', format: 'Excel',
  data: { capacityUsed: 68, productsStored: 423, coldStorage: 'Phase 2', dispatchVolume: 1240 }
}];


const QUICK_METRICS = [
{ label: 'Total SHGs', value: '214', color: COLORS.primary },
{ label: 'Active Members', value: '3,842', color: COLORS.success },
{ label: 'Revenue (Monthly)', value: '₹8.24L', color: COLORS.purple },
{ label: 'Employment Created', value: '512', color: COLORS.teal },
{ label: 'FSSAI Licensed', value: '67', color: COLORS.warning },
{ label: 'GI Products', value: '6', color: COLORS.bengalRed }];


const SCHEME_COLORS = {
  NABARD: COLORS.success,
  NRLM: COLORS.primary,
  PMFME: COLORS.warning,
  MSME: COLORS.purple,
  Tribal: COLORS.teal
};



export default function NABARDReportsScreen({ navigation }) {const lang = useAppLanguage();

  const [generating, setGenerating] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? REPORT_TEMPLATES : REPORT_TEMPLATES.filter((r) => r.scheme === filter);

  const handleGenerate = (report) => {
    setGenerating(report.id);
    setTimeout(() => {
      setGenerating(null);
      Alert.alert(
        `✅ ${"Export Report"}`,
        `${report.name} — ${"Report export initiated. Check your downloads folder."}`,
        [{ text: "OK" }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NABARD & Scheme {"Reports"}</Text>
          <Text style={styles.headerSub}>{"PDF/CSV Export for NABARD, NRLM, PMFME, MSME, Tribal"}</Text>
        </LinearGradient>

        {/* Quick Metrics */}
        <View style={styles.metricsBox}>
          <Text style={styles.metricsTitle}>{"Live Platform Metrics"}</Text>
          <View style={styles.metricsGrid}>
            {QUICK_METRICS.map((m) =>
            <View key={m.label} style={styles.metricCard}>
                <Text style={[styles.metricVal, { color: m.color }]}>{m.value}</Text>
                <Text style={styles.metricLbl}>{m.label}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {['all', 'NABARD', 'NRLM', 'PMFME', 'MSME', 'Tribal'].map((f) =>
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterActive]}>
              <Text style={[styles.filterTxt, filter === f && { color: SCHEME_COLORS[f] || COLORS.primary }]}>{f}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Report Cards */}
        {filtered.map((report) =>
        <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportTop}>
              <View style={[styles.schemeBadge, { backgroundColor: (SCHEME_COLORS[report.scheme] || COLORS.primary) + '20' }]}>
                <Text style={[styles.schemeTxt, { color: SCHEME_COLORS[report.scheme] || COLORS.primary }]}>{report.scheme}</Text>
              </View>
              <Text style={styles.reportFormat}>{report.format}</Text>
            </View>
            <Text style={styles.reportName}>{report.name}</Text>
            <Text style={styles.reportDesc}>{report.description}</Text>

            {/* Data Preview */}
            <View style={styles.dataGrid}>
              {Object.entries(report.data).map(([key, val]) =>
            <View key={key} style={styles.dataItem}>
                  <Text style={styles.dataVal}>{typeof val === 'number' ? val.toLocaleString() : val}</Text>
                  <Text style={styles.dataKey}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                </View>
            )}
            </View>

            <View style={styles.reportFooter}>
              <Text style={styles.lastGenerated}>Last: {report.lastGenerated}</Text>
              <View style={styles.reportBtns}>
                <TouchableOpacity
                onPress={() => handleGenerate(report)}
                style={[styles.generateBtn, generating === report.id && styles.generatingBtn]}
                disabled={generating === report.id}>
                
                  <Text style={styles.generateTxt}>
                    {generating === report.id ? '⏳ Generating...' : `📄 Generate ${report.format.split(' ')[0]}`}
                  </Text>
                </TouchableOpacity>
                {report.format.includes('Excel') &&
              <TouchableOpacity onPress={() => handleGenerate({ ...report, name: report.name + ' (CSV)' })} style={styles.csvBtn}>
                    <Text style={styles.csvTxt}>{"📊 CSV"}</Text>
                  </TouchableOpacity>
              }
              </View>
            </View>
          </View>
        )}

        {/* Scheduled Reports */}
        <View style={styles.scheduleBox}>
          <Text style={styles.scheduleTitle}>📅 Scheduled Auto-{"Reports"}</Text>
          {[
          { freq: 'Monthly', report: 'NABARD SHG Report', nextRun: '2025-06-01', recipient: 'nabard.wb@nabard.org' },
          { freq: 'Quarterly', report: 'PMFME Progress Report', nextRun: '2025-07-01', recipient: 'pmfme.wb@msme.gov.in' },
          { freq: 'Annual', report: 'MSME Artisan Report', nextRun: '2026-01-01', recipient: 'handicraft@msme.gov.in' }].
          map((s) =>
          <View key={s.report} style={styles.scheduleRow}>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleReport}>{s.report}</Text>
                <Text style={styles.scheduleRecipient}>{s.recipient}</Text>
              </View>
              <View style={styles.scheduleRight}>
                <Text style={styles.scheduleFreq}>{s.freq}</Text>
                <Text style={styles.scheduleNext}>{s.nextRun}</Text>
              </View>
            </View>
          )}
        </View>

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
  metricsBox: { margin: 16, backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16, ...SHADOWS.medium },
  metricsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { flex: 1, minWidth: 90, backgroundColor: COLORS.dark, borderRadius: 12, padding: 10, alignItems: 'center' },
  metricVal: { fontSize: 16, fontWeight: '800' },
  metricLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  filterScroll: { marginBottom: 14 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.darkCard, borderWidth: 1, borderColor: COLORS.darkBorder },
  filterActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  filterTxt: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  reportCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small },
  reportTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  schemeBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  schemeTxt: { fontSize: 11, fontWeight: '700' },
  reportFormat: { fontSize: 11, color: COLORS.textMuted, backgroundColor: COLORS.dark, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reportName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  reportDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  dataItem: { flex: 1, minWidth: 80, backgroundColor: COLORS.dark, borderRadius: 10, padding: 8, alignItems: 'center' },
  dataVal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  dataKey: { fontSize: 9, color: COLORS.textMuted, marginTop: 3, textAlign: 'center', textTransform: 'capitalize' },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.darkBorder, paddingTop: 12 },
  lastGenerated: { fontSize: 11, color: COLORS.textMuted },
  reportBtns: { flexDirection: 'row', gap: 8 },
  generateBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  generatingBtn: { backgroundColor: COLORS.darkBorder },
  generateTxt: { fontSize: 12, fontWeight: '700', color: COLORS.darkDeep },
  csvBtn: { backgroundColor: COLORS.success + '20', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.success + '40' },
  csvTxt: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  scheduleBox: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16 },
  scheduleTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  scheduleInfo: { flex: 1 },
  scheduleReport: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  scheduleRecipient: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  scheduleRight: { alignItems: 'flex-end' },
  scheduleFreq: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  scheduleNext: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 }
});