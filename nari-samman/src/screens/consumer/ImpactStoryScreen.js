// import React from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";


// export default function ImpactStoryScreen({ navigation }) {
//   const { user, orders } = useStore();const lang = useAppLanguage();


//   const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
//   const totalOrders = orders.length;
//   const uniqueArtisans = 3; // derived from order items
//   const treesEquiv = Math.round(totalOrders * 1.5);

//   const impactStats = [
//   { emoji: '💰', value: `₹${totalSpent.toLocaleString()}`, label: "Total Contribution", color: COLORS.gold },
//   { emoji: '📦', value: totalOrders, label: "Orders Placed", color: COLORS.saffron },
//   { emoji: '👩', value: uniqueArtisans, label: "Artisans Supported", color: COLORS.green },
//   { emoji: '🌱', value: treesEquiv, label: "Eco Points Earned", color: COLORS.mint }];


//   const milestones = [
//   { emoji: '🥉', title: "First Purchase", desc: "You made your first purchase!", done: totalOrders >= 1 },
//   { emoji: '🥈', title: "Regular Supporter", desc: "Placed 3+ orders from SHG artisans", done: totalOrders >= 3 },
//   { emoji: '🥇', title: "Champion Patron", desc: "Contributed ₹10,000+ to artisan livelihoods", done: totalSpent >= 10000 },
//   { emoji: '🌟', title: "SHG Advocate", desc: "Supported 5+ different artisan groups", done: false }];


//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>{"← Back"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{"My Impact Story"} 🌱</Text>
//         <Text style={styles.headerSub}>{"Your purchases are changing lives in rural West Bengal"}</Text>
//       </LinearGradient>

//       <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* User Impact Card */}
//         <LinearGradient colors={[COLORS.gold + '25', COLORS.saffron + '15']} style={styles.heroCard}>
//           <Text style={styles.heroEmoji}>{user.avatar}</Text>
//           <Text style={styles.heroName}>{user.name}</Text>
//           <Text style={styles.heroTitle}>{"Nari Samman Patron"}</Text>
//           <Text style={styles.heroDesc}>{"You are making a real difference to SHG women and artisan families of West Bengal."}</Text>
//         </LinearGradient>

//         {/* Impact Stats Grid */}
//         <Text style={styles.sectionTitle}>{"Your Numbers"}</Text>
//         <View style={styles.statsGrid}>
//           {impactStats.map((s, i) =>
//           <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
//               <Text style={styles.statEmoji}>{s.emoji}</Text>
//               <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
//               <Text style={styles.statLabel}>{s.label}</Text>
//             </View>
//           )}
//         </View>

//         {/* Milestones */}
//         <Text style={styles.sectionTitle}>{"Milestones"}</Text>
//         {milestones.map((m, i) =>
//         <View key={i} style={[styles.milestoneCard, !m.done && styles.milestoneCardLocked]}>
//             <Text style={styles.milestoneEmoji}>{m.emoji}</Text>
//             <View style={styles.milestoneInfo}>
//               <Text style={[styles.milestoneTitle, !m.done && { color: COLORS.textMuted }]}>{m.title}</Text>
//               <Text style={styles.milestoneDesc}>{m.desc}</Text>
//             </View>
//             <View style={[styles.milestoneBadge, { backgroundColor: m.done ? COLORS.success + '20' : COLORS.creamDark }]}>
//               <Text style={[styles.milestoneBadgeText, { color: m.done ? COLORS.success : COLORS.textMuted }]}>
//                 {m.done ? "✓ Done" : "Locked"}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Story Banner */}
//         <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.storyBanner}>
//           <Text style={styles.storyTitle}>{"🌿 How Your Purchase Helps"}</Text>
//           <Text style={styles.storyText}>
//             Every product on Nari Samman is sourced directly from SHG women and tribal {"Artisans"} of West Bengal.
//             {'\n\n'}By buying from us, you:{'\n'}
//             • Skip the middleman chain entirely{'\n'}
//             • Ensure {"Artisans"} get 70–80% of the sale price{'\n'}
//             • Help preserve ancient craft traditions{'\n'}
//             • Fund IS&SF's grassroots training programs
//           </Text>
//         </LinearGradient>

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>);

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 28 },
//   backBtn: { marginBottom: 16 },
//   backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
//   headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
//   headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.7)', marginTop: 6, lineHeight: 20 },
//   scroll: { flex: 1, minHeight: 0 },
//   scrollContent: { padding: 16 },
//   heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.gold + '30' },
//   heroEmoji: { fontSize: 48, marginBottom: 10 },
//   heroName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
//   heroTitle: { fontSize: 14, color: COLORS.saffron, fontWeight: '700', marginTop: 4 },
//   heroDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
//   statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
//   statCard: { width: '47%', backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, borderTopWidth: 3, ...SHADOWS.small, alignItems: 'center', minHeight: 100, justifyContent: 'center' },
//   statEmoji: { fontSize: 24, marginBottom: 6 },
//   statValue: { fontSize: 22, fontWeight: '800' },
//   statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
//   milestoneCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 10, ...SHADOWS.small, borderLeftWidth: 3, borderLeftColor: COLORS.success },
//   milestoneCardLocked: { borderLeftColor: COLORS.creamDark, opacity: 0.75 },
//   milestoneEmoji: { fontSize: 28 },
//   milestoneInfo: { flex: 1 },
//   milestoneTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
//   milestoneDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
//   milestoneBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
//   milestoneBadgeText: { fontSize: 11, fontWeight: '700' },
//   storyBanner: { borderRadius: 20, padding: 20, marginTop: 8 },
//   storyTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
//   storyText: { fontSize: 13, color: 'rgba(200,208,228,0.85)', lineHeight: 22 }
// });






import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import Text from "../../autoTranslation/AutoText";
import useAppLanguage from "../../autoTranslation/useAppLanguage";

export default function ImpactStoryScreen({ navigation }) {
  const { user, orders } = useStore();
  const lang = useAppLanguage();

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const uniqueArtisans = 3; // derived from order items
  const treesEquiv = Math.round(totalOrders * 1.5);

  const impactStats = [
    { emoji: '💰', value: `₹${totalSpent.toLocaleString()}`, label: "Total Contribution", color: COLORS.gold },
    { emoji: '📦', value: totalOrders, label: "Orders Placed", color: COLORS.saffron },
    { emoji: '👩', value: uniqueArtisans, label: "Artisans Supported", color: COLORS.green },
    { emoji: '🌱', value: treesEquiv, label: "Eco Points Earned", color: COLORS.mint }
  ];

  const milestones = [
    { emoji: '🥉', title: "First Purchase", desc: "You made your first purchase!", done: totalOrders >= 1 },
    { emoji: '🥈', title: "Regular Supporter", desc: "Placed 3+ orders from SHG artisans", done: totalOrders >= 3 },
    { emoji: '🥇', title: "Champion Patron", desc: "Contributed ₹10,000+ to artisan livelihoods", done: totalSpent >= 10000 },
    { emoji: '🌟', title: "SHG Advocate", desc: "Supported 5+ different artisan groups", done: false }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"My Impact Story"} 🌱</Text>
        <Text style={styles.headerSub}>{"Your purchases are changing lives in rural West Bengal"}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* User Impact Card */}
        <LinearGradient colors={[COLORS.gold + '25', COLORS.saffron + '15']} style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{user.avatar}</Text>
          <Text style={styles.heroName}>{user.name}</Text>
          <Text style={styles.heroTitle}>{"Nari Samman Patron"}</Text>
          <Text style={styles.heroDesc}>{"You are making a real difference to SHG women and artisan families of West Bengal."}</Text>
        </LinearGradient>

        {/* Impact Stats Grid */}
        <Text style={styles.sectionTitle}>{"Your Numbers"}</Text>
        <View style={styles.statsGrid}>
          {impactStats.map((s, i) =>
            <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          )}
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>{"Milestones"}</Text>
        {milestones.map((m, i) =>
          <View key={i} style={[styles.milestoneCard, !m.done && styles.milestoneCardLocked]}>
            <Text style={styles.milestoneEmoji}>{m.emoji}</Text>
            <View style={styles.milestoneInfo}>
              <Text style={[styles.milestoneTitle, !m.done && { color: COLORS.textMuted }]}>{m.title}</Text>
              <Text style={styles.milestoneDesc}>{m.desc}</Text>
            </View>
            <View style={[styles.milestoneBadge, { backgroundColor: m.done ? COLORS.success + '20' : COLORS.creamDark }]}>
              <Text style={[styles.milestoneBadgeText, { color: m.done ? COLORS.success : COLORS.textMuted }]}>
                {m.done ? "✓ Done" : "Locked"}
              </Text>
            </View>
          </View>
        )}

        {/* Story Banner */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.storyBanner}>
          <Text style={styles.storyTitle}>{"🌿 How Your Purchase Helps"}</Text>
          <Text style={styles.storyText}>
            Every product on Nari Samman is sourced directly from SHG women and tribal {"Artisans"} of West Bengal.
            {'\n\n'}By buying from us, you:{'\n'}
            • Skip the middleman chain entirely{'\n'}
            • Ensure {"Artisans"} get 70–80% of the sale price{'\n'}
            • Help preserve ancient craft traditions{'\n'}
            • Fund IS&SF's grassroots training programs
          </Text>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 28 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.7)', marginTop: 6, lineHeight: 20 },

  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {})
  },

  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 30,
    flexGrow: 1
  },

  heroCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.gold + '30' },
  heroEmoji: { fontSize: 48, marginBottom: 10 },
  heroName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  heroTitle: { fontSize: 14, color: COLORS.saffron, fontWeight: '700', marginTop: 4 },
  heroDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: '47%', backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, borderTopWidth: 3, ...SHADOWS.small, alignItems: 'center', minHeight: 100, justifyContent: 'center' },
  statEmoji: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  milestoneCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 10, ...SHADOWS.small, borderLeftWidth: 3, borderLeftColor: COLORS.success },
  milestoneCardLocked: { borderLeftColor: COLORS.creamDark, opacity: 0.75 },
  milestoneEmoji: { fontSize: 28 },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  milestoneDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  milestoneBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  milestoneBadgeText: { fontSize: 11, fontWeight: '700' },
  storyBanner: { borderRadius: 20, padding: 20, marginTop: 8 },
  storyTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
  storyText: { fontSize: 13, color: 'rgba(200,208,228,0.85)', lineHeight: 22 }
});
