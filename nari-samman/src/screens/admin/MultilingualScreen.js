import React from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";


const LANGUAGES = [
{
  code: 'en',
  name: 'English',
  nativeName: 'English',
  flag: '🇬🇧',
  greeting: 'Welcome to Nari Samman',
  desc: 'Default language for all portals and screens.',
  sample: [
  { key: 'Home', val: 'Home' },
  { key: 'Add to Cart', val: 'Add to Cart' },
  { key: 'My Orders', val: 'My Orders' },
  { key: 'Checkout', val: 'Checkout' },
  { key: 'Total Earnings', val: 'Total Earnings' }]

},
{
  code: 'bn',
  name: 'Bengali',
  nativeName: 'বাংলা',
  flag: '🇮🇳',
  greeting: 'নারী সম্মানে স্বাগতম',
  desc: 'Priority language for Sandeshkhali and West Bengal SHG communities.',
  sample: [
  { key: 'Home', val: 'হোম' },
  { key: 'Add to Cart', val: 'কার্টে যোগ করুন' },
  { key: 'My Orders', val: 'আমার অর্ডার' },
  { key: 'Checkout', val: 'চেকআউট' },
  { key: 'Total Earnings', val: 'মোট আয়' }]

},
{
  code: 'hi',
  name: 'Hindi',
  nativeName: 'हिन्दी',
  flag: '🇮🇳',
  greeting: 'नारी सम्मान में आपका स्वागत है',
  desc: 'For North India consumers, Distribution Agents and SHG partners.',
  sample: [
  { key: 'Home', val: 'होम' },
  { key: 'Add to Cart', val: 'कार्ट में जोड़ें' },
  { key: 'My Orders', val: 'मेरे ऑर्डर' },
  { key: 'Checkout', val: 'चेकआउट' },
  { key: 'Total Earnings', val: 'कुल कमाई' }]

}];


export default function MultilingualScreen({ navigation }) {
  const { language, setLanguage } = useStore();const lang = useAppLanguage();


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🌐 {"Select Language"}</Text>
          <Text style={styles.headerSub}>{"Changes apply instantly across all roles & screens"}</Text>
        </LinearGradient>

        {/* Active language banner */}
        <View style={styles.activeBanner}>
          <Text style={styles.activeBannerLabel}>{"Currently active:"}</Text>
          <Text style={styles.activeBannerLang}>
            {LANGUAGES.find((l) => l.code === language)?.flag}{' '}
            {LANGUAGES.find((l) => l.code === language)?.name} ({LANGUAGES.find((l) => l.code === language)?.nativeName})
          </Text>
        </View>

        {/* Language cards */}
        <View style={styles.section}>
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.card, isActive && styles.cardActive]}
                onPress={() => setLanguage(lang.code)}
                activeOpacity={0.85}>
                
                {/* Top row */}
                <View style={styles.cardTop}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardNameRow}>
                      <Text style={styles.langName}>{lang.name}</Text>
                      <Text style={[styles.nativeName, isActive && { color: COLORS.primary }]}>
                        {lang.nativeName}
                      </Text>
                    </View>
                    <Text style={styles.greeting}>{lang.greeting}</Text>
                    <Text style={styles.desc}>{lang.desc}</Text>
                  </View>
                  {/* Active indicator */}
                  <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                    {isActive && <View style={styles.radioInner} />}
                  </View>
                </View>

                {/* Sample translations */}
                {isActive &&
                <View style={styles.sampleBox}>
                    <Text style={styles.sampleTitle}>{"Sample translations:"}</Text>
                    {lang.sample.map((s) =>
                  <View key={s.key} style={styles.sampleRow}>
                        <Text style={styles.sampleKey}>{s.key}</Text>
                        <Text style={styles.sampleArrow}>→</Text>
                        <Text style={[styles.sampleVal, lang.code !== 'en' && { color: COLORS.primary }]}>
                          {s.val}
                        </Text>
                      </View>
                  )}
                  </View>
                }

                {/* Select button */}
                {!isActive &&
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => setLanguage(lang.code)}
                  activeOpacity={0.8}>
                  
                    <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark || '#C0392B']}
                    style={styles.selectBtnGrad}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    
                      <Text style={styles.selectBtnText}>
                        Select {lang.name} ({lang.nativeName})
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                }

                {isActive &&
                <View style={styles.activeChip}>
                    <Text style={styles.activeChipText}>{"✓ Active — Applied to all screens"}</Text>
                  </View>
                }
              </TouchableOpacity>);

          })}
        </View>

        {/* Coverage note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>{"ℹ️ About Language Support"}</Text>
          <Text style={styles.noteText}>
            All three languages are fully implemented across every screen in the app — Consumer, Vendor, and Admin portals. Switching language here updates all UI text instantly, no restart required.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flexGrow: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 14 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },

  activeBanner: {
    margin: 16,
    marginBottom: 4,
    backgroundColor: COLORS.primary + '18',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '40'
  },
  activeBannerLabel: { fontSize: 12, color: COLORS.textSecondary },
  activeBannerLang: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  section: { padding: 16 },

  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder
  },
  cardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08'
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  flag: { fontSize: 36 },
  cardInfo: { flex: 1 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  langName: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  nativeName: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  greeting: { fontSize: 13, color: COLORS.textPrimary, marginBottom: 4, fontStyle: 'italic' },
  desc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 17 },

  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.darkBorder,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.primary
  },

  sampleBox: {
    marginTop: 14,
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    padding: 12
  },
  sampleTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sampleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder + '80', gap: 8 },
  sampleKey: { flex: 1, fontSize: 12, color: COLORS.textSecondary },
  sampleArrow: { fontSize: 12, color: COLORS.textMuted },
  sampleVal: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },

  selectBtn: { marginTop: 14, borderRadius: 12, overflow: 'hidden' },
  selectBtnGrad: { paddingVertical: 12, alignItems: 'center' },
  selectBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  activeChip: {
    marginTop: 12,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '40'
  },
  activeChipText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  noteCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary
  },
  noteTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  noteText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 }
});