// import React, { useState } from 'react';
// import {
//   View, StyleSheet, ScrollView, TouchableOpacity, Linking } from
// 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

// const FAQ_ITEMS = [
// {
//   q: 'How long does delivery take?',
//   a: 'Standard delivery takes 5–7 business days. All orders are dispatched from our Sandeshkhali Warehouse in North 24 Parganas, West Bengal.'
// },
// {
//   q: 'What is the return policy?',
//   a: 'We accept returns within 7 days of delivery for defective or incorrect items. Contact support with your order ID and photos of the issue.'
// },
// {
//   q: 'Is free delivery available?',
//   a: 'Yes! Orders above ₹500 get free delivery. Below that, a flat ₹60 delivery charge applies.'
// },
// {
//   q: 'How do I track my order?',
//   a: 'Go to My Orders → Select your order → View the tracking status. Updates are reflected in real time.'
// },
// {
//   q: 'Are all products authentic?',
//   a: 'Yes! Every product is verified and sourced directly from SHG women and tribal artisans. Many carry GI or UNESCO certifications.'
// },
// {
//   q: 'Can I cancel my order?',
//   a: 'Orders can be cancelled before they are shipped. Open the order in My Orders and tap Cancel Order.'
// }];




// export default function HelpSupportScreen({ navigation }) {const lang = useAppLanguage();

//   const [expanded, setExpanded] = useState(null);

//   const goBack = () => {
//     if (navigation.canGoBack()) navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
//         <TouchableOpacity onPress={goBack} style={styles.backBtn}>
//           <Text style={styles.backText}>{"← Back"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{"Help & Support"} ❓</Text>
//         <Text style={styles.headerSub}>{"How can we help you?"}</Text>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}>
        
//         {/* Contact Options */}
//         <Text style={styles.sectionTitle}>{"Contact Us"}</Text>
//         <View style={styles.contactGrid}>
//           <TouchableOpacity
//             style={styles.contactCard}
//             onPress={() => Linking.openURL('mailto:support@narisamman.in')}>
            
//             <Text style={styles.contactEmoji}>📧</Text>
//             <Text style={styles.contactLabel}>{"Email Support"}</Text>
//             <Text style={styles.contactValue}>support@narisamman.in</Text>
//             <Text style={styles.contactTime}>{"Replies 24hr"}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.contactCard}
//             onPress={() => Linking.openURL('tel:+919876500000')}>
            
//             <Text style={styles.contactEmoji}>📞</Text>
//             <Text style={styles.contactLabel}>{"Call Us"}</Text>
//             <Text style={styles.contactValue}>+91 98765 00000</Text>
//             <Text style={styles.contactTime}>{"Call Hours"}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* WhatsApp Button */}
//         <TouchableOpacity
//           style={styles.whatsappBtn}
//           onPress={() => Linking.openURL('https://wa.me/919876500000')}>
          
//           <Text style={styles.whatsappEmoji}>💬</Text>
//           <View>
//             <Text style={styles.whatsappTitle}>{"Chat Whatsapp"}</Text>
//             <Text style={styles.whatsappSub}>{"Whatsapp Fast"}</Text>
//           </View>
//           <Text style={styles.whatsappArrow}>›</Text>
//         </TouchableOpacity>

//         {/* FAQ Section */}
//         <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{"Faq Title"}</Text>
//         {FAQ_ITEMS.map((item, i) =>
//         <TouchableOpacity
//           key={i}
//           style={styles.faqCard}
//           onPress={() => setExpanded(expanded === i ? null : i)}
//           activeOpacity={0.8}>
          
//             <View style={styles.faqHeader}>
//               <Text style={styles.faqQ}>{item.q}</Text>
//               <Text style={styles.faqArrow}>{expanded === i ? '▲' : '▼'}</Text>
//             </View>
//             {expanded === i &&
//           <Text style={styles.faqA}>{item.a}</Text>
//           }
//           </TouchableOpacity>
//         )}

//         {/* About Section */}
//         <LinearGradient colors={[COLORS.green + '20', COLORS.greenLight + '10']} style={styles.aboutCard}>
//           <Text style={styles.aboutTitle}>{"About Nari"}</Text>
//           <Text style={styles.aboutText}>
//             Nari Samman is an initiative by IS&SF (Innovation, Skill & Social Foundation) to empower rural women {"Artisans"} and tribal communities of West Bengal by providing them a direct digital marketplace — eliminating exploitation by middlemen.
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
//   headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.6)', marginTop: 4 },
//   scroll: { flex: 1, minHeight: 0 },
//   scrollContent: { padding: 16 },
//   sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },

//   contactGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
//   contactCard: {
//     flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 18,
//     padding: 16, alignItems: 'center', ...SHADOWS.small,
//     borderWidth: 1, borderColor: COLORS.darkBorder
//   },
//   contactEmoji: { fontSize: 30, marginBottom: 8 },
//   contactLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
//   contactValue: { fontSize: 11, color: COLORS.saffron, fontWeight: '600', marginTop: 4, textAlign: 'center' },
//   contactTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },

//   whatsappBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 14,
//     backgroundColor: '#25D366' + '15',
//     borderWidth: 1.5, borderColor: '#25D366' + '60',
//     borderRadius: 18, padding: 16, marginBottom: 8
//   },
//   whatsappEmoji: { fontSize: 28 },
//   whatsappTitle: { fontSize: 14, fontWeight: '700', color: '#128C7E' },
//   whatsappSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
//   whatsappArrow: { marginLeft: 'auto', fontSize: 22, color: '#128C7E' },

//   faqCard: {
//     backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, marginBottom: 8, ...SHADOWS.small
//   },
//   faqHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 20 },
//   faqArrow: { fontSize: 12, color: COLORS.textMuted },
//   faqA: {
//     fontSize: 13, color: COLORS.textSecondary, lineHeight: 20,
//     marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.creamDark
//   },

//   aboutCard: { borderRadius: 20, padding: 20, marginTop: 8, borderWidth: 1, borderColor: COLORS.greenLight + '40' },
//   aboutTitle: { fontSize: 15, fontWeight: '700', color: COLORS.green, marginBottom: 10 },
//   aboutText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 }
// });







import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import Text from "../../autoTranslation/AutoText";
import TextInput from "../../autoTranslation/AutoTextInput";
import useAppLanguage from "../../autoTranslation/useAppLanguage";

const FAQ_ITEMS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days. All orders are dispatched from our Sandeshkhali Warehouse in North 24 Parganas, West Bengal.'
  },
  {
    q: 'What is the return policy?',
    a: 'We accept returns within 7 days of delivery for defective or incorrect items. Contact support with your order ID and photos of the issue.'
  },
  {
    q: 'Is free delivery available?',
    a: 'Yes! Orders above ₹500 get free delivery. Below that, a flat ₹60 delivery charge applies.'
  },
  {
    q: 'How do I track my order?',
    a: 'Go to My Orders → Select your order → View the tracking status. Updates are reflected in real time.'
  },
  {
    q: 'Are all products authentic?',
    a: 'Yes! Every product is verified and sourced directly from SHG women and tribal artisans. Many carry GI or UNESCO certifications.'
  },
  {
    q: 'Can I cancel my order?',
    a: 'Orders can be cancelled before they are shipped. Open the order in My Orders and tap Cancel Order.'
  }
];

export default function HelpSupportScreen({ navigation }) {
  const lang = useAppLanguage();

  const [expanded, setExpanded] = useState(null);

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>{"← Back"}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{"Help & Support"} ❓</Text>
        <Text style={styles.headerSub}>{"How can we help you?"}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Contact Options */}
        <Text style={styles.sectionTitle}>{"Contact Us"}</Text>

        <View style={styles.contactGrid}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL('mailto:support@narisamman.in')}
          >
            <Text style={styles.contactEmoji}>📧</Text>
            <Text style={styles.contactLabel}>{"Email Support"}</Text>
            <Text style={styles.contactValue}>support@narisamman.in</Text>
            <Text style={styles.contactTime}>{"Replies 24hr"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL('tel:+919876500000')}
          >
            <Text style={styles.contactEmoji}>📞</Text>
            <Text style={styles.contactLabel}>{"Call Us"}</Text>
            <Text style={styles.contactValue}>+91 98765 00000</Text>
            <Text style={styles.contactTime}>{"Call Hours"}</Text>
          </TouchableOpacity>
        </View>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => Linking.openURL('https://wa.me/919876500000')}
        >
          <Text style={styles.whatsappEmoji}>💬</Text>

          <View>
            <Text style={styles.whatsappTitle}>{"Chat Whatsapp"}</Text>
            <Text style={styles.whatsappSub}>{"Whatsapp Fast"}</Text>
          </View>

          <Text style={styles.whatsappArrow}>›</Text>
        </TouchableOpacity>

        {/* FAQ Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>{"Faq Title"}</Text>

        {FAQ_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setExpanded(expanded === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{item.q}</Text>
              <Text style={styles.faqArrow}>{expanded === i ? '▲' : '▼'}</Text>
            </View>

            {expanded === i && (
              <Text style={styles.faqA}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* About Section */}
        <LinearGradient
          colors={[COLORS.green + '20', COLORS.greenLight + '10']}
          style={styles.aboutCard}
        >
          <Text style={styles.aboutTitle}>{"About Nari"}</Text>

          <Text style={styles.aboutText}>
            Nari Samman is an initiative by IS&SF (Innovation, Skill & Social Foundation) to empower rural women {"Artisans"} and tribal communities of West Bengal by providing them a direct digital marketplace — eliminating exploitation by middlemen.
          </Text>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.dark
  },

  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 28
  },

  backBtn: {
    marginBottom: 16
  },

  backText: {
    fontSize: 14,
    color: 'rgba(200,208,228,0.7)',
    fontWeight: '600'
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff'
  },

  headerSub: {
    fontSize: 13,
    color: 'rgba(200,208,228,0.6)',
    marginTop: 4
  },

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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12
  },

  contactGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },

  contactCard: {
    flex: 1,
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.darkBorder
  },

  contactEmoji: {
    fontSize: 30,
    marginBottom: 8
  },

  contactLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },

  contactValue: {
    fontSize: 11,
    color: COLORS.saffron,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center'
  },

  contactTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center'
  },

  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#25D366' + '15',
    borderWidth: 1.5,
    borderColor: '#25D366' + '60',
    borderRadius: 18,
    padding: 16,
    marginBottom: 8
  },

  whatsappEmoji: {
    fontSize: 28
  },

  whatsappTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#128C7E'
  },

  whatsappSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },

  whatsappArrow: {
    marginLeft: 'auto',
    fontSize: 22,
    color: '#128C7E'
  },

  faqCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.small
  },

  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20
  },

  faqArrow: {
    fontSize: 12,
    color: COLORS.textMuted
  },

  faqA: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.creamDark
  },

  aboutCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.greenLight + '40'
  },

  aboutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.green,
    marginBottom: 10
  },

  aboutText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 22
  }
});
