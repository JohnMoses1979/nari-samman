import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';import Text from "../autoTranslation/AutoText";import useAppLanguage from "../autoTranslation/useAppLanguage";
import NariLogoIcon from '../components/NariLogoIcon';


const { width } = Dimensions.get('window');



export default function RoleSelectScreen({ navigation }) {const lang = useAppLanguage();


  const ROLES = [
  {
    id: 'consumer',
    title: "Shop as Consumer",
    subtitle: "Shop authentic rural products",
    emoji: '🛒',
    gradient: [COLORS.saffron, COLORS.gold],
    highlights: ["Handloom sarees & textiles", "Pure Sundarbans honey", "Tribal crafts & art", "Organic food products"]
  },
  {
    id: 'vendor',
    title: "Join as Artisan/SHG",
    subtitle: "Sell your handmade products",
    emoji: '🧵',
    gradient: [COLORS.green, COLORS.greenLight],
    highlights: ["No middlemen", "Fair prices for your craft", "Warehouse & logistics support", "Digital payments"]
  },
  {
    id: 'admin',
    title: "Admin / Manager",
    subtitle: "Manage platform operations",
    emoji: '⚙️',
    gradient: [COLORS.primaryDark, COLORS.primary],
    highlights: ["Product approval queue", "SHG management", "Order & dispatch control", "Revenue reports"]
  }];


  const handleSelect = (roleId) => {
    if (roleId === 'consumer') navigation.navigate('ConsumerLogin');else
    if (roleId === 'vendor') navigation.navigate('SHGLogin');else
    navigation.navigate('AdminLogin');
  };

  return (
    <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <NariLogoIcon size={34} />
          <Text style={styles.logo}>{"Nari Samman"}</Text>
        </View>
        <Text style={styles.title}>{"How would you like to participate?"}</Text>
        <Text style={styles.subtitle}>{"Choose your role to get started"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
        {ROLES.map((role) =>
        <TouchableOpacity key={role.id} onPress={() => handleSelect(role.id)} activeOpacity={0.88} style={styles.cardWrapper}>
            <LinearGradient colors={['rgba(200,208,228,0.06)', 'rgba(200,208,228,0.02)']} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.emojiBox, { borderColor: role.gradient[0] + '60' }]}>
                  <Text style={styles.emoji}>{role.emoji}</Text>
                </View>
                <View style={styles.cardTitleGroup}>
                  <Text style={styles.cardTitle}>{role.title}</Text>
                  <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.highlights}>
                {role.highlights.map((h, i) =>
              <View key={i} style={styles.highlightRow}>
                    <LinearGradient colors={role.gradient} style={styles.dot} />
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
              )}
              </View>
              <LinearGradient colors={[...role.gradient, 'transparent']} style={styles.cardAccentBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.footer}>{"IS&SF Initiative · Empowering Rural West Bengal"}</Text>
    </LinearGradient>);

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logo: { fontSize: 14, color: COLORS.gold, fontWeight: '600', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.cream, lineHeight: 36 },
  subtitle: { fontSize: 14, color: 'rgba(200,208,228,0.5)', marginTop: 6 },
  cards: { paddingHorizontal: 16, paddingBottom: 20 },
  cardWrapper: { marginBottom: 14, borderRadius: 20, overflow: 'hidden' },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(200,208,228,0.1)',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emojiBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center'
  },
  emoji: { fontSize: 26 },
  cardTitleGroup: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  cardSubtitle: { fontSize: 12, color: 'rgba(200,208,228,0.5)', marginTop: 2 },
  arrow: { fontSize: 20, color: 'rgba(200,208,228,0.3)' },
  divider: { height: 1, backgroundColor: 'rgba(200,208,228,0.08)', marginVertical: 14 },
  highlights: { gap: 8 },
  highlightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  highlightText: { fontSize: 13, color: 'rgba(200,208,228,0.7)' },
  cardAccentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.25)', paddingBottom: 30 }
});
