// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Linking,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore from '../../store/useStore';
// import { imgSrc } from '../../utils/imageSource';
// import Text from '../../autoTranslation/AutoText';

// const TRACEABILITY = {
//   village: 'Sandeshkhali, North 24 Parganas',
//   district: 'North 24 Parganas, West Bengal',
//   harvestDate: 'February 2025',
//   giTag: 'West Bengal GI Certified',
//   fssai: 'FSSAI: 10020042013283',
//   certifications: ['GI Tag', 'FSSAI Licensed', 'NABARD SHG Verified'],
//   supplyChain: [
//     { step: '🌾 Harvest / Weave', detail: 'Artisan SHG, Sandeshkhali' },
//     { step: '🏭 Quality Check', detail: 'Nari Samman Warehouse, N24PGS' },
//     { step: '📦 Pack & Dispatch', detail: 'Warehouse Hub → Courier' },
//     { step: '🏠 Delivered', detail: 'Direct to your doorstep' },
//   ],
// };

// export default function ProductDetailScreen({ route, navigation }) {
//   const { product } = route.params;
//   const { addToCart, toggleWishlist, isWishlisted, artisans } = useStore();

//   const [qty, setQty] = useState(1);
//   const [cartToast, setCartToast] = useState(false);
//   const [showTrace, setShowTrace] = useState(false);

//   const artisan = artisans.find((a) => a.id === product.artisanId);
//   const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
//   const productImage = imgSrc(product.image);

//   const handleWhatsApp = () => {
//     const msg = `*Nari Samman* — Artisan Products\n\n*${product.name}*\nPrice: ₹${product.price}${product.mrp ? ` (MRP ₹${product.mrp})` : ''}\n${artisan ? `Made by: ${artisan.name}, ${artisan.shg}` : ''}\n\nI want to order this product.`;
//     const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;

//     Linking.canOpenURL(url)
//       .then((ok) => (ok ? Linking.openURL(url) : Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.')))
//       .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
//   };

//   const goToCart = () => {
//     navigation.navigate('ConsumerTabs', { screen: 'Cart' });
//   };

//   const handleAddToCart = () => {
//     addToCart(product, qty);
//     goToCart();
//   };

//   const handleBuyNow = () => {
//     addToCart(product, qty);
//     navigation.navigate('Checkout');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         <LinearGradient colors={[COLORS.darkDeep, COLORS.dark, COLORS.darkCard]} style={styles.hero}>
//           <View style={styles.topBar}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} activeOpacity={0.85}>
//               <Text style={styles.iconText}>←</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.iconBtn} activeOpacity={0.85}>
//               <Text style={styles.heartText}>{isWishlisted(product.id) ? '❤️' : '🤍'}</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.imageFrame}>
//             {productImage ? (
//               <Image source={productImage} style={styles.productImage} resizeMode="contain" />
//             ) : (
//               <Text style={styles.productEmoji}>{product.emoji || '🛍️'}</Text>
//             )}
//           </View>

//           {product.badge ? (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{product.badge}</Text>
//             </View>
//           ) : null}
//         </LinearGradient>

//         <View style={styles.content}>
//           <Text style={styles.name}>{product.name}</Text>
//           <Text style={styles.unit}>Per {product.unit}</Text>

//           <View style={styles.ratingRow}>
//             <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
//             <Text style={styles.ratingNum}>{product.rating}</Text>
//             <Text style={styles.reviews}>({product.reviews} reviews)</Text>
//             <View style={styles.stockBadge}>
//               <Text style={styles.stockText}>✓ In Stock ({product.stock})</Text>
//             </View>
//           </View>

//           <View style={styles.priceBox}>
//             <View>
//               <Text style={styles.price}>₹{product.price}</Text>
//               <Text style={styles.taxText}>Inclusive of all taxes</Text>
//             </View>
//             <View style={styles.priceRight}>
//               {product.mrp ? <Text style={styles.mrp}>MRP ₹{product.mrp}</Text> : null}
//               {discount > 0 ? (
//                 <View style={styles.discBadge}>
//                   <Text style={styles.discText}>{discount}% OFF</Text>
//                 </View>
//               ) : null}
//             </View>
//           </View>

//           <View style={styles.tags}>
//             {(product.tags || []).map((tag) => (
//               <View key={tag} style={styles.tag}>
//                 <Text style={styles.tagText}># {tag}</Text>
//               </View>
//             ))}
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>About This Product</Text>
//             <Text style={styles.description}>{product.description}</Text>
//           </View>

//           {artisan ? (
//             <LinearGradient colors={[COLORS.green + '18', COLORS.greenLight + '08']} style={styles.artisanCard}>
//               <View style={styles.artisanHeader}>
//                 <Text style={styles.artisanEmoji}>{artisan.avatar}</Text>
//                 <View style={styles.artisanInfo}>
//                   <Text style={styles.artisanName}>{artisan.name}</Text>
//                   <Text style={styles.artisanShg}>{artisan.shg}</Text>
//                   <Text style={styles.artisanLoc}>📍 {artisan.location}</Text>
//                 </View>
//                 <View style={styles.artisanRating}>
//                   <Text style={styles.artisanRatingNum}>⭐ {artisan.rating}</Text>
//                   <Text style={styles.artisanMembers}>{artisan.members} members</Text>
//                 </View>
//               </View>
//               <Text style={styles.artisanStory}>“{artisan.story}”</Text>
//               <View style={styles.impactTag}>
//                 <Text style={styles.impactTagText}>🌱 Your purchase directly empowers this SHG</Text>
//               </View>
//             </LinearGradient>
//           ) : null}

//           <TouchableOpacity onPress={() => setShowTrace(!showTrace)} style={styles.traceHeader} activeOpacity={0.85}>
//             <View style={styles.traceHeaderLeft}>
//               <Text style={styles.traceIcon}>🌱</Text>
//               <View style={styles.traceTitleBox}>
//                 <Text style={styles.traceTitle}>Product Traceability</Text>
//                 <Text style={styles.traceSub}>See exactly where this product comes from</Text>
//               </View>
//             </View>
//             <Text style={styles.traceToggle}>{showTrace ? '▲' : '▼'}</Text>
//           </TouchableOpacity>

//           {showTrace ? (
//             <View style={styles.traceBox}>
//               <View style={styles.traceCerts}>
//                 {TRACEABILITY.certifications.map((cert) => (
//                   <View key={cert} style={styles.certBadge}>
//                     <Text style={styles.certText}>✓ {cert}</Text>
//                   </View>
//                 ))}
//               </View>

//               {[
//                 ['📍 Village', TRACEABILITY.village],
//                 ['🗺️ District', TRACEABILITY.district],
//                 ['📅 Harvest / Made', TRACEABILITY.harvestDate],
//                 ['🏷️ GI Tag', TRACEABILITY.giTag],
//                 ['🍽️ FSSAI', TRACEABILITY.fssai],
//               ].map(([label, value]) => (
//                 <View key={label} style={styles.traceRow}>
//                   <Text style={styles.traceLbl}>{label}</Text>
//                   <Text style={styles.traceVal}>{value}</Text>
//                 </View>
//               ))}

//               <Text style={styles.traceChainTitle}>Supply Chain Journey</Text>
//               {TRACEABILITY.supplyChain.map((step, index) => (
//                 <View key={step.step} style={styles.chainStep}>
//                   <View style={styles.chainDot} />
//                   {index < TRACEABILITY.supplyChain.length - 1 ? <View style={styles.chainLine} /> : null}
//                   <View style={styles.chainInfo}>
//                     <Text style={styles.chainStepText}>{step.step}</Text>
//                     <Text style={styles.chainDetail}>{step.detail}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           ) : null}

//           <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappBtn} activeOpacity={0.85}>
//             <Text style={styles.whatsappIcon}>💬</Text>
//             <Text style={styles.whatsappText}>Order via WhatsApp</Text>
//           </TouchableOpacity>

//           <View style={styles.shippingBox}>
//             {[
//               { emoji: '🏭', label: 'Dispatched From', value: 'Nari Samman Warehouse, Sandeshkhali' },
//               { emoji: '🚚', label: 'Estimated Delivery', value: '5–7 working days' },
//               { emoji: '↩️', label: 'Returns', value: '7-day easy return for damaged goods' },
//             ].map((row) => (
//               <View key={row.label} style={styles.shippingRow}>
//                 <Text style={styles.shippingEmoji}>{row.emoji}</Text>
//                 <View style={styles.shippingInfo}>
//                   <Text style={styles.shippingLabel}>{row.label}</Text>
//                   <Text style={styles.shippingValue}>{row.value}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <View style={styles.qtySelector}>
//           <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn} activeOpacity={0.8}>
//             <Text style={styles.qtyBtnText}>−</Text>
//           </TouchableOpacity>
//           <Text style={styles.qtyNum}>{qty}</Text>
//           <TouchableOpacity onPress={() => setQty(Math.min(product.stock || 99, qty + 1))} style={styles.qtyBtn} activeOpacity={0.8}>
//             <Text style={styles.qtyBtnText}>+</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={handleAddToCart} style={styles.addCartBtn} activeOpacity={0.88}>
//           <Text style={styles.addCartText}>Add to Cart</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowBtn} activeOpacity={0.9}>
//           <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.buyNowGrad}>
//             <Text style={styles.buyNowText}>Buy Now</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       {cartToast ? (
//         <View style={styles.toast}>
//           <Text style={styles.toastText}>🛒 Added to cart</Text>
//           <TouchableOpacity onPress={goToCart}>
//             <Text style={styles.toastCta}>View Cart →</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   scrollContent: { flexGrow: 1, paddingBottom: 116 },
//   hero: {
//     minHeight: 390,
//     paddingTop: 42,
//     paddingHorizontal: 16,
//     paddingBottom: 18,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     overflow: 'hidden',
//   },
//   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   iconBtn: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: COLORS.darkCard,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   iconText: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 26 },
//   heartText: { fontSize: 23 },
//   imageFrame: {
//     flex: 1,
//     minHeight: 285,
//     backgroundColor: COLORS.darkDeep,
//     borderRadius: 26,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     padding: 12,
//   },
//   productImage: { width: '100%', height: '100%' },
//   productEmoji: { fontSize: 108 },
//   badge: {
//     position: 'absolute',
//     left: 28,
//     bottom: 30,
//     backgroundColor: COLORS.bengalRed,
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//   },
//   badgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },

//   content: { paddingHorizontal: 18, paddingTop: 22 },
//   name: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 34 },
//   unit: { fontSize: 14, color: COLORS.textMuted, marginTop: 5, fontWeight: '600' },
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12, flexWrap: 'wrap' },
//   stars: { fontSize: 14 },
//   ratingNum: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary },
//   reviews: { fontSize: 13, color: COLORS.textMuted },
//   stockBadge: { backgroundColor: COLORS.success + '20', borderRadius: 18, paddingHorizontal: 11, paddingVertical: 5 },
//   stockText: { fontSize: 12, color: COLORS.success, fontWeight: '800' },

//   priceBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 18,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 24,
//     padding: 18,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   price: { fontSize: 34, fontWeight: '900', color: COLORS.saffron },
//   taxText: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, fontWeight: '600' },
//   priceRight: { alignItems: 'flex-end', gap: 8 },
//   mrp: { fontSize: 15, color: COLORS.textMuted, textDecorationLine: 'line-through', fontWeight: '700' },
//   discBadge: { backgroundColor: COLORS.success + '22', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 6 },
//   discText: { fontSize: 13, fontWeight: '900', color: COLORS.success },

//   tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
//   tag: { backgroundColor: COLORS.saffron + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
//   tagText: { fontSize: 12, color: COLORS.saffron, fontWeight: '800' },

//   section: { marginTop: 24 },
//   sectionTitle: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 9 },
//   description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 23 },

//   artisanCard: {
//     marginTop: 22,
//     borderRadius: 24,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: COLORS.greenLight + '45',
//   },
//   artisanHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
//   artisanEmoji: { fontSize: 42 },
//   artisanInfo: { flex: 1 },
//   artisanName: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
//   artisanShg: { fontSize: 13, color: COLORS.greenLight, marginTop: 2, fontWeight: '700' },
//   artisanLoc: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
//   artisanRating: { alignItems: 'flex-end' },
//   artisanRatingNum: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
//   artisanMembers: { fontSize: 10, color: COLORS.textMuted, marginTop: 3 },
//   artisanStory: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },
//   impactTag: { marginTop: 12, backgroundColor: COLORS.green + '22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start' },
//   impactTagText: { fontSize: 12, color: COLORS.greenLight, fontWeight: '800' },

//   traceHeader: {
//     marginTop: 22,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 22,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderLeftWidth: 4,
//     borderLeftColor: COLORS.success,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   traceHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
//   traceIcon: { fontSize: 27 },
//   traceTitleBox: { flex: 1 },
//   traceTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
//   traceSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
//   traceToggle: { fontSize: 16, color: COLORS.success, fontWeight: '900', marginLeft: 8 },
//   traceBox: {
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 22,
//     padding: 16,
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//   },
//   traceCerts: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
//   certBadge: { backgroundColor: COLORS.success + '20', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 5 },
//   certText: { fontSize: 11, color: COLORS.success, fontWeight: '900' },
//   traceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
//   traceLbl: { fontSize: 12, color: COLORS.textMuted, flex: 1 },
//   traceVal: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary, flex: 1.6, textAlign: 'right', lineHeight: 17 },
//   traceChainTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textSecondary, marginTop: 14, marginBottom: 10 },
//   chainStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 7, position: 'relative' },
//   chainDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginTop: 5 },
//   chainLine: { position: 'absolute', left: 4, top: 14, width: 2, height: 31, backgroundColor: COLORS.success + '45' },
//   chainInfo: { flex: 1 },
//   chainStepText: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary },
//   chainDetail: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

//   whatsappBtn: {
//     marginTop: 16,
//     backgroundColor: '#25D36622',
//     borderRadius: 18,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     borderWidth: 1,
//     borderColor: '#25D36655',
//   },
//   whatsappIcon: { fontSize: 20 },
//   whatsappText: { fontSize: 15, fontWeight: '900', color: '#25D366' },
//   shippingBox: {
//     marginTop: 16,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 22,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     gap: 15,
//     ...SHADOWS.small,
//   },
//   shippingRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
//   shippingEmoji: { fontSize: 22, marginTop: 2 },
//   shippingInfo: { flex: 1 },
//   shippingLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700' },
//   shippingValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700', marginTop: 3, lineHeight: 19 },

//   bottomBar: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: COLORS.darkCard,
//     paddingHorizontal: 14,
//     paddingTop: 12,
//     paddingBottom: 22,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.darkBorder,
//     ...SHADOWS.large,
//   },
//   qtySelector: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.darkDeep, borderRadius: 16, paddingHorizontal: 7, paddingVertical: 7 },
//   qtyBtn: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
//   qtyBtnText: { fontSize: 19, fontWeight: '900', color: COLORS.saffron },
//   qtyNum: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, minWidth: 22, textAlign: 'center' },
//   addCartBtn: { flex: 1, backgroundColor: COLORS.saffron + '18', borderWidth: 1.5, borderColor: COLORS.saffron, borderRadius: 17, paddingVertical: 14, alignItems: 'center' },
//   addCartText: { color: COLORS.saffron, fontWeight: '900', fontSize: 13 },
//   buyNowBtn: { flex: 1, borderRadius: 17, overflow: 'hidden' },
//   buyNowGrad: { paddingVertical: 15, alignItems: 'center' },
//   buyNowText: { color: '#fff', fontWeight: '900', fontSize: 14 },

//   toast: {
//     position: 'absolute',
//     bottom: 98,
//     left: 16,
//     right: 16,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     zIndex: 999,
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.large,
//   },
//   toastText: { flex: 1, fontSize: 14, color: '#fff', fontWeight: '800' },
//   toastCta: { fontSize: 14, color: COLORS.gold, fontWeight: '900', marginLeft: 12 },
// });







import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';

const TRACEABILITY = {
  village: 'Sandeshkhali, North 24 Parganas',
  district: 'North 24 Parganas, West Bengal',
  harvestDate: 'February 2025',
  giTag: 'West Bengal GI Certified',
  fssai: 'FSSAI: 10020042013283',
  certifications: ['GI Tag', 'FSSAI Licensed', 'NABARD SHG Verified'],
  supplyChain: [
    { step: '🌾 Harvest / Weave', detail: 'Artisan SHG, Sandeshkhali' },
    { step: '🏭 Quality Check', detail: 'Nari Samman Warehouse, N24PGS' },
    { step: '📦 Pack & Dispatch', detail: 'Warehouse Hub → Courier' },
    { step: '🏠 Delivered', detail: 'Direct to your doorstep' },
  ],
};

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, toggleWishlist, isWishlisted, artisans } = useStore();

  const [qty, setQty] = useState(1);
  const [cartToast, setCartToast] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const productImage = imgSrc(product.image);

  const handleWhatsApp = () => {
    const msg = `*Nari Samman* — Artisan Products\n\n*${product.name}*\nPrice: ₹${product.price}${product.mrp ? ` (MRP ₹${product.mrp})` : ''}\n${artisan ? `Made by: ${artisan.name}, ${artisan.shg}` : ''}\n\nI want to order this product.`;
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;

    Linking.canOpenURL(url)
      .then((ok) => (ok ? Linking.openURL(url) : Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.')))
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  const goToCart = () => {
    navigation.navigate('ConsumerTabs', { screen: 'Cart' });
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    goToCart();
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <LinearGradient colors={[COLORS.darkDeep, COLORS.dark, COLORS.darkCard]} style={styles.hero}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} activeOpacity={0.85}>
              <Text style={styles.iconText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.iconBtn} activeOpacity={0.85}>
              <Text style={styles.heartText}>{isWishlisted(product.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageFrame}>
            {productImage ? (
              <Image source={productImage} style={styles.productImage} resizeMode="contain" />
            ) : (
              <Text style={styles.productEmoji}>{product.emoji || '🛍️'}</Text>
            )}
          </View>

          {product.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          ) : null}
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>Per {product.unit}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingNum}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>✓ In Stock ({product.stock})</Text>
            </View>
          </View>

          <View style={styles.priceBox}>
            <View>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.taxText}>Inclusive of all taxes</Text>
            </View>
            <View style={styles.priceRight}>
              {product.mrp ? <Text style={styles.mrp}>MRP ₹{product.mrp}</Text> : null}
              {discount > 0 ? (
                <View style={styles.discBadge}>
                  <Text style={styles.discText}>{discount}% OFF</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.tags}>
            {(product.tags || []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Product</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {artisan ? (
            <LinearGradient colors={[COLORS.green + '18', COLORS.greenLight + '08']} style={styles.artisanCard}>
              <View style={styles.artisanHeader}>
                <Text style={styles.artisanEmoji}>{artisan.avatar}</Text>
                <View style={styles.artisanInfo}>
                  <Text style={styles.artisanName}>{artisan.name}</Text>
                  <Text style={styles.artisanShg}>{artisan.shg}</Text>
                  <Text style={styles.artisanLoc}>📍 {artisan.location}</Text>
                </View>
                <View style={styles.artisanRating}>
                  <Text style={styles.artisanRatingNum}>⭐ {artisan.rating}</Text>
                  <Text style={styles.artisanMembers}>{artisan.members} members</Text>
                </View>
              </View>
              <Text style={styles.artisanStory}>“{artisan.story}”</Text>
              <View style={styles.impactTag}>
                <Text style={styles.impactTagText}>🌱 Your purchase directly empowers this SHG</Text>
              </View>
            </LinearGradient>
          ) : null}

          <TouchableOpacity onPress={() => setShowTrace(!showTrace)} style={styles.traceHeader} activeOpacity={0.85}>
            <View style={styles.traceHeaderLeft}>
              <Text style={styles.traceIcon}>🌱</Text>
              <View style={styles.traceTitleBox}>
                <Text style={styles.traceTitle}>Product Traceability</Text>
                <Text style={styles.traceSub}>See exactly where this product comes from</Text>
              </View>
            </View>
            <Text style={styles.traceToggle}>{showTrace ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showTrace ? (
            <View style={styles.traceBox}>
              <View style={styles.traceCerts}>
                {TRACEABILITY.certifications.map((cert) => (
                  <View key={cert} style={styles.certBadge}>
                    <Text style={styles.certText}>✓ {cert}</Text>
                  </View>
                ))}
              </View>

              {[
                ['📍 Village', TRACEABILITY.village],
                ['🗺️ District', TRACEABILITY.district],
                ['📅 Harvest / Made', TRACEABILITY.harvestDate],
                ['🏷️ GI Tag', TRACEABILITY.giTag],
                ['🍽️ FSSAI', TRACEABILITY.fssai],
              ].map(([label, value]) => (
                <View key={label} style={styles.traceRow}>
                  <Text style={styles.traceLbl}>{label}</Text>
                  <Text style={styles.traceVal}>{value}</Text>
                </View>
              ))}

              <Text style={styles.traceChainTitle}>Supply Chain Journey</Text>
              {TRACEABILITY.supplyChain.map((step, index) => (
                <View key={step.step} style={styles.chainStep}>
                  <View style={styles.chainDot} />
                  {index < TRACEABILITY.supplyChain.length - 1 ? <View style={styles.chainLine} /> : null}
                  <View style={styles.chainInfo}>
                    <Text style={styles.chainStepText}>{step.step}</Text>
                    <Text style={styles.chainDetail}>{step.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappBtn} activeOpacity={0.85}>
            <Text style={styles.whatsappIcon}>💬</Text>
            <Text style={styles.whatsappText}>Order via WhatsApp</Text>
          </TouchableOpacity>

          <View style={styles.shippingBox}>
            {[
              { emoji: '🏭', label: 'Dispatched From', value: 'Nari Samman Warehouse, Sandeshkhali' },
              { emoji: '🚚', label: 'Estimated Delivery', value: '5–7 working days' },
              { emoji: '↩️', label: 'Returns', value: '7-day easy return for damaged goods' },
            ].map((row) => (
              <View key={row.label} style={styles.shippingRow}>
                <Text style={styles.shippingEmoji}>{row.emoji}</Text>
                <View style={styles.shippingInfo}>
                  <Text style={styles.shippingLabel}>{row.label}</Text>
                  <Text style={styles.shippingValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.qtySelector}>
          <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn} activeOpacity={0.8}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty(Math.min(product.stock || 99, qty + 1))} style={styles.qtyBtn} activeOpacity={0.8}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleAddToCart} style={styles.addCartBtn} activeOpacity={0.88}>
          <Text style={styles.addCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBuyNow} style={styles.buyNowBtn} activeOpacity={0.9}>
          <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.buyNowGrad}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {cartToast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>🛒 Added to cart</Text>
          <TouchableOpacity onPress={goToCart}>
            <Text style={styles.toastCta}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },
  scrollContent: { flexGrow: 1, paddingBottom: 116 },
  hero: {
    minHeight: 390,
    paddingTop: 42,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  iconText: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 26 },
  heartText: { fontSize: 23 },
  imageFrame: {
    flex: 1,
    minHeight: 285,
    backgroundColor: COLORS.darkDeep,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    padding: 12,
  },
  productImage: { width: '100%', height: '100%' },
  productEmoji: { fontSize: 108 },
  badge: {
    position: 'absolute',
    left: 28,
    bottom: 30,
    backgroundColor: COLORS.bengalRed,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  content: { paddingHorizontal: 18, paddingTop: 22 },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 34 },
  unit: { fontSize: 14, color: COLORS.textMuted, marginTop: 5, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12, flexWrap: 'wrap' },
  stars: { fontSize: 14 },
  ratingNum: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary },
  reviews: { fontSize: 13, color: COLORS.textMuted },
  stockBadge: { backgroundColor: COLORS.success + '20', borderRadius: 18, paddingHorizontal: 11, paddingVertical: 5 },
  stockText: { fontSize: 12, color: COLORS.success, fontWeight: '800' },

  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    backgroundColor: COLORS.darkCard,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  price: { fontSize: 34, fontWeight: '900', color: COLORS.saffron },
  taxText: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, fontWeight: '600' },
  priceRight: { alignItems: 'flex-end', gap: 8 },
  mrp: { fontSize: 15, color: COLORS.textMuted, textDecorationLine: 'line-through', fontWeight: '700' },
  discBadge: { backgroundColor: COLORS.success + '22', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 6 },
  discText: { fontSize: 13, fontWeight: '900', color: COLORS.success },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: { backgroundColor: COLORS.saffron + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  tagText: { fontSize: 12, color: COLORS.saffron, fontWeight: '800' },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 9 },
  description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 23 },

  artisanCard: {
    marginTop: 22,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.greenLight + '45',
  },
  artisanHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  artisanEmoji: { fontSize: 42 },
  artisanInfo: { flex: 1 },
  artisanName: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  artisanShg: { fontSize: 13, color: COLORS.greenLight, marginTop: 2, fontWeight: '700' },
  artisanLoc: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  artisanRating: { alignItems: 'flex-end' },
  artisanRatingNum: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  artisanMembers: { fontSize: 10, color: COLORS.textMuted, marginTop: 3 },
  artisanStory: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 20 },
  impactTag: { marginTop: 12, backgroundColor: COLORS.green + '22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start' },
  impactTagText: { fontSize: 12, color: COLORS.greenLight, fontWeight: '800' },

  traceHeader: {
    marginTop: 22,
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  traceHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  traceIcon: { fontSize: 27 },
  traceTitleBox: { flex: 1 },
  traceTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  traceSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  traceToggle: { fontSize: 16, color: COLORS.success, fontWeight: '900', marginLeft: 8 },
  traceBox: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  traceCerts: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  certBadge: { backgroundColor: COLORS.success + '20', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 5 },
  certText: { fontSize: 11, color: COLORS.success, fontWeight: '900' },
  traceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  traceLbl: { fontSize: 12, color: COLORS.textMuted, flex: 1 },
  traceVal: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary, flex: 1.6, textAlign: 'right', lineHeight: 17 },
  traceChainTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textSecondary, marginTop: 14, marginBottom: 10 },
  chainStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 7, position: 'relative' },
  chainDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginTop: 5 },
  chainLine: { position: 'absolute', left: 4, top: 14, width: 2, height: 31, backgroundColor: COLORS.success + '45' },
  chainInfo: { flex: 1 },
  chainStepText: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary },
  chainDetail: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  whatsappBtn: {
    marginTop: 16,
    backgroundColor: '#25D36622',
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#25D36655',
  },
  whatsappIcon: { fontSize: 20 },
  whatsappText: { fontSize: 15, fontWeight: '900', color: '#25D366' },
  shippingBox: {
    marginTop: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    gap: 15,
    ...SHADOWS.small,
  },
  shippingRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  shippingEmoji: { fontSize: 22, marginTop: 2 },
  shippingInfo: { flex: 1 },
  shippingLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700' },
  shippingValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700', marginTop: 3, lineHeight: 19 },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.darkCard,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkBorder,
    ...SHADOWS.large,
  },
  qtySelector: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.darkDeep, borderRadius: 16, paddingHorizontal: 7, paddingVertical: 7 },
  qtyBtn: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 19, fontWeight: '900', color: COLORS.saffron },
  qtyNum: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, minWidth: 22, textAlign: 'center' },
  addCartBtn: { flex: 1, backgroundColor: COLORS.saffron + '18', borderWidth: 1.5, borderColor: COLORS.saffron, borderRadius: 17, paddingVertical: 14, alignItems: 'center' },
  addCartText: { color: COLORS.saffron, fontWeight: '900', fontSize: 13 },
  buyNowBtn: { flex: 1, borderRadius: 17, overflow: 'hidden' },
  buyNowGrad: { paddingVertical: 15, alignItems: 'center' },
  buyNowText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  toast: {
    position: 'absolute',
    bottom: 98,
    left: 16,
    right: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 999,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.large,
  },
  toastText: { flex: 1, fontSize: 14, color: '#fff', fontWeight: '800' },
  toastCta: { fontSize: 14, color: COLORS.gold, fontWeight: '900', marginLeft: 12 },
});
