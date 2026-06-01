// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   Dimensions,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore from '../../store/useStore';
// import { imgSrc } from '../../utils/imageSource';
// import Text from '../../autoTranslation/AutoText';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2;

// function WishlistCard({ item, onAddToCart, onRemove, onPress }) {
//   const [added, setAdded] = useState(false);
//   const discount = item.mrp ? Math.round((1 - item.price / item.mrp) * 100) : 0;

//   const handleAddToCart = () => {
//     onAddToCart(item);
//     setAdded(true);
//     setTimeout(() => setAdded(false), 1600);
//   };

//   return (
//     <View style={styles.card}>
//       <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.9}>
//         <View style={styles.imgBox}>
//           {imgSrc(item.image) ? (
//             <Image source={imgSrc(item.image)} style={styles.img} resizeMode="cover" />
//           ) : (
//             <Text style={styles.imgEmoji}>{item.emoji || '🛍️'}</Text>
//           )}
//           {discount > 0 && (
//             <View style={styles.discountBadge}>
//               <Text style={styles.discountText}>{discount}% off</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.info}>
//           <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
//           <Text style={styles.unit}>{item.unit}</Text>
//           <View style={styles.priceRow}>
//             <Text style={styles.price}>₹{item.price}</Text>
//             {item.mrp ? <Text style={styles.mrp}>₹{item.mrp}</Text> : null}
//           </View>
//         </View>
//       </TouchableOpacity>

//       <View style={styles.actions}>
//         <TouchableOpacity
//           onPress={handleAddToCart}
//           style={[styles.addBtn, added && styles.addBtnAdded]}
//           activeOpacity={0.85}>
//           <Text style={styles.addBtnText}>{added ? '✓ Added' : 'Add to Cart'}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onRemove(item)} style={styles.removeBtn} activeOpacity={0.85}>
//           <Text style={styles.removeText}>×</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// export default function WishlistScreen({ navigation }) {
//   const { wishlist, toggleWishlist, addToCart } = useStore();

//   const goBack = () => {
//     if (navigation.canGoBack()) navigation.goBack();
//     else navigation.navigate('Home');
//   };

//   const addAllToCart = () => {
//     wishlist.forEach((item) => addToCart(item));
//     navigation.navigate('Cart');
//   };

//   if (wishlist.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={goBack} style={styles.backBtn}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Wishlist</Text>
//           <View style={{ width: 72 }} />
//         </View>

//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyCard}>
//             <Text style={styles.emptyEmoji}>🤍</Text>
//             <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
//             <Text style={styles.emptySubtitle}>Save artisan products you love and add them to cart anytime.</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={styles.exploreBtn} activeOpacity={0.9}>
//               <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.exploreBtnGrad}>
//                 <Text style={styles.exploreBtnText}>Browse Products →</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const rows = [];
//   for (let i = 0; i < wishlist.length; i += 2) rows.push(wishlist.slice(i, i + 2));

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={goBack} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>My Wishlist</Text>
//           <Text style={styles.headerSub}>{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved</Text>
//         </View>
//         <Text style={styles.count}>{wishlist.length}</Text>
//       </View>

//       <TouchableOpacity style={styles.moveAllBtn} onPress={addAllToCart} activeOpacity={0.85}>
//         <Text style={styles.moveAllText}>🛒 Add All To Cart</Text>
//       </TouchableOpacity>

//       <ScrollView style={styles.scroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
//         {rows.map((row, rowIdx) => (
//           <View key={rowIdx} style={styles.row}>
//             {row.map((item) => (
//               <WishlistCard
//                 key={item.id}
//                 item={item}
//                 onAddToCart={(product) => { addToCart(product); navigation.navigate('Cart'); }}
//                 onRemove={toggleWishlist}
//                 onPress={(product) => navigation.navigate('ProductDetail', { product })}
//               />
//             ))}
//             {row.length === 1 && <View style={styles.cardFiller} />}
//           </View>
//         ))}
//         <View style={{ height: 28 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 42,
//     paddingHorizontal: 18,
//     paddingBottom: 16,
//     backgroundColor: COLORS.darkCard,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   backBtn: { paddingVertical: 6, paddingRight: 8, minWidth: 72 },
//   backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '800' },
//   headerCenter: { alignItems: 'center', flex: 1 },
//   headerTitle: { fontSize: 21, fontWeight: '900', color: COLORS.textPrimary },
//   headerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
//   count: {
//     minWidth: 72,
//     textAlign: 'right',
//     fontSize: 14,
//     color: COLORS.textMuted,
//     fontWeight: '800',
//   },

//   moveAllBtn: {
//     marginHorizontal: 18,
//     marginTop: 14,
//     marginBottom: 4,
//     backgroundColor: COLORS.saffron + '14',
//     borderWidth: 1.5,
//     borderColor: COLORS.saffron + '55',
//     borderRadius: 18,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   moveAllText: { fontSize: 16, fontWeight: '900', color: COLORS.saffron },

//   scroll: { flex: 1, minHeight: 0 },
//   listContent: { paddingHorizontal: 16, paddingTop: 16, flexGrow: 1 },
//   row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },

//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 22,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   cardFiller: { width: CARD_WIDTH },
//   imgBox: {
//     height: 160,
//     backgroundColor: COLORS.darkDeep,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   img: { width: '100%', height: '100%' },
//   imgEmoji: { fontSize: 58 },
//   discountBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: COLORS.bengalRed,
//     borderRadius: 12,
//     paddingHorizontal: 9,
//     paddingVertical: 5,
//   },
//   discountText: { color: '#fff', fontSize: 10, fontWeight: '900' },
//   info: { padding: 12 },
//   name: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 19, minHeight: 38 },
//   unit: { fontSize: 11, color: COLORS.textMuted, marginTop: 5 },
//   priceRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8 },
//   price: { fontSize: 18, fontWeight: '900', color: COLORS.saffron },
//   mrp: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
//   actions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingBottom: 12 },
//   addBtn: { flex: 1, backgroundColor: COLORS.saffron, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
//   addBtnAdded: { backgroundColor: COLORS.success },
//   addBtnText: { color: '#fff', fontWeight: '900', fontSize: 12 },
//   removeBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 14,
//     backgroundColor: COLORS.darkDeep,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   removeText: { fontSize: 28, color: COLORS.bengalRed, fontWeight: '800', lineHeight: 30 },

//   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
//   emptyCard: {
//     width: '100%',
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 28,
//     padding: 28,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.medium,
//   },
//   emptyEmoji: { fontSize: 72, marginBottom: 16 },
//   emptyTitle: { fontSize: 23, fontWeight: '900', color: COLORS.textPrimary, textAlign: 'center' },
//   emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 21 },
//   exploreBtn: { marginTop: 24, borderRadius: 50, overflow: 'hidden' },
//   exploreBtnGrad: { paddingHorizontal: 32, paddingVertical: 14 },
//   exploreBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
// });








import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function WishlistCard({ item, onAddToCart, onRemove, onPress }) {
  const [added, setAdded] = useState(false);
  const discount = item.mrp ? Math.round((1 - item.price / item.mrp) * 100) : 0;

  const handleAddToCart = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.9}>
        <View style={styles.imgBox}>
          {imgSrc(item.image) ? (
            <Image source={imgSrc(item.image)} style={styles.img} resizeMode="cover" />
          ) : (
            <Text style={styles.imgEmoji}>{item.emoji || '🛍️'}</Text>
          )}

          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% off</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.unit}>{item.unit}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.mrp ? <Text style={styles.mrp}>₹{item.mrp}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={[styles.addBtn, added && styles.addBtnAdded]}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>{added ? '✓ Added' : 'Add to Cart'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onRemove(item)} style={styles.removeBtn} activeOpacity={0.85}>
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function WishlistScreen({ navigation }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
  };

  const addAllToCart = () => {
    wishlist.forEach((item) => addToCart(item));
    navigation.navigate('Cart');
  };

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Wishlist</Text>

          <View style={{ width: 72 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.emptyScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🤍</Text>
              <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
              <Text style={styles.emptySubtitle}>Save artisan products you love and add them to cart anytime.</Text>

              <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={styles.exploreBtn} activeOpacity={0.9}>
                <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.exploreBtnGrad}>
                  <Text style={styles.exploreBtnText}>Browse Products →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const rows = [];
  for (let i = 0; i < wishlist.length; i += 2) rows.push(wishlist.slice(i, i + 2));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerSub}>{wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved</Text>
        </View>

        <Text style={styles.count}>{wishlist.length}</Text>
      </View>

      <TouchableOpacity style={styles.moveAllBtn} onPress={addAllToCart} activeOpacity={0.85}>
        <Text style={styles.moveAllText}>🛒 Add All To Cart</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onAddToCart={(product) => {
                  addToCart(product);
                  navigation.navigate('Cart');
                }}
                onRemove={toggleWishlist}
                onPress={(product) => navigation.navigate('ProductDetail', { product })}
              />
            ))}

            {row.length === 1 && <View style={styles.cardFiller} />}
          </View>
        ))}

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.dark,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 16,
    backgroundColor: COLORS.darkCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },

  backBtn: {
    paddingVertical: 6,
    paddingRight: 8,
    minWidth: 72,
  },

  backText: {
    fontSize: 15,
    color: COLORS.saffron,
    fontWeight: '800',
  },

  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },

  headerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  count: {
    minWidth: 72,
    textAlign: 'right',
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '800',
  },

  moveAllBtn: {
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: COLORS.saffron + '14',
    borderWidth: 1.5,
    borderColor: COLORS.saffron + '55',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },

  moveAllText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.saffron,
  },

  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 28,
    flexGrow: 1,
  },

  emptyScrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 40 : 28,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },

  cardFiller: {
    width: CARD_WIDTH,
  },

  imgBox: {
    height: 160,
    backgroundColor: COLORS.darkDeep,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  img: {
    width: '100%',
    height: '100%',
  },

  imgEmoji: {
    fontSize: 58,
  },

  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.bengalRed,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 19,
    minHeight: 38,
  },

  unit: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 5,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.saffron,
  },

  mrp: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  addBtn: {
    flex: 1,
    backgroundColor: COLORS.saffron,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  addBtnAdded: {
    backgroundColor: COLORS.success,
  },

  addBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },

  removeBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.darkDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeText: {
    fontSize: 28,
    color: COLORS.bengalRed,
    fontWeight: '800',
    lineHeight: 30,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  emptyCard: {
    width: '100%',
    backgroundColor: COLORS.darkCard,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.medium,
  },

  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21,
  },

  exploreBtn: {
    marginTop: 24,
    borderRadius: 50,
    overflow: 'hidden',
  },

  exploreBtnGrad: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },

  exploreBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});
