


















// ─── screens/consumer/ExploreScreen.js ───────────────────────────────────────
//
//  CHANGES FROM PREVIOUS VERSION:
//  • Removed import for AIAssistantFAB
//  • Removed <AIAssistantFAB> JSX usage
//  • AIAssistantFAB is now rendered once in ConsumerTabs
//
//  NOTHING ELSE CHANGED:
//  • Search, filter, sort logic — untouched.
//  • useStore(), loadApprovedProducts(), wishlist, cart — untouched.
//  • ProductCard and all sub-components — untouched.
//  • All StyleSheet entries — untouched.
//  • Multilingual AutoText / AutoTextInput / useAppLanguage — untouched.
//  • Category chip and sort dropdown behavior — untouched.
//  • Navigation to ProductDetail — untouched.
//
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from "../../autoTranslation/AutoText";
import TextInput from "../../autoTranslation/AutoTextInput";
import useAppLanguage from "../../autoTranslation/useAppLanguage";
import { getAutoCategoryLabel, getAutoCategoryTag, getAutoSortLabel, CATEGORY_LABELS, SORT_LABELS } from "../../autoTranslation/staticLabels";

// AIAssistantFAB is now rendered in ConsumerTabs — no import needed here.

const { width } = Dimensions.get('window');

const CATEGORY_IDS = ['all', 'food', 'textiles', 'crafts'];
const SORT_KEYS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];
const CAT_EMOJIS = { all: '✨', food: '🍯', textiles: '🧵', crafts: '🏺' };

function ProductCard({ product, navigation, isWishlisted, onWishlist }) {
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const localName = product.name;
  const catTag = getAutoCategoryTag(product.category);
  const catColor = product.category === 'food' ? COLORS.goldDark : product.category === 'textiles' ? COLORS.green : COLORS.purple;
  const catBg = product.category === 'food' ? COLORS.gold + '25' : product.category === 'textiles' ? COLORS.green + '25' : COLORS.purple + '25';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product })}
      activeOpacity={0.9}
    >
      <View style={styles.imgBox}>
        {imgSrc(product.image) ? (
          <Image source={imgSrc(product.image)} style={styles.img} resizeMode="cover" />
        ) : (
          <Text style={styles.imgEmoji}>{product.emoji}</Text>
        )}

        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.heartBtn} onPress={() => onWishlist(product)}>
          <Text style={{ fontSize: 18 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{localName}</Text>
        <Text style={styles.unit}>{product.unit}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
          <Text style={styles.off}>{discount}% {"off"}</Text>
        </View>

        <View style={styles.rRow}>
          <Text style={styles.star}>⭐ {product.rating}</Text>
          <Text style={styles.rev}>({product.reviews})</Text>
        </View>

        <View style={[styles.catTag, { backgroundColor: catBg }]}>
          <Text style={[styles.catTagText, { color: catColor }]}>{catTag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreScreen({ navigation }) {
  const { products, toggleWishlist, isWishlisted, loadApprovedProducts } = useStore();

  useEffect(() => {
    if (typeof loadApprovedProducts === 'function') {
      loadApprovedProducts().catch(() => { });
    }
  }, []);

  const lang = useAppLanguage();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('Relevance');
  const [showSort, setShowSort] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    const q = search.toLowerCase();
    const localName = p.name.toLowerCase();
    const matchSearch =
      !q ||
      localName.includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (p.tags || []).some((tg) => tg.toLowerCase().includes(q));

    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sort === 'Price: Low to High') return a.price - b.price;
    if (sort === 'Price: High to Low') return b.price - a.price;
    if (sort === 'Rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"Browse Products"}</Text>
        <Text style={styles.headerSub}>{filtered.length} {"products found"}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder={"Search products, artisans, tags..."}
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ fontSize: 18, color: COLORS.textMuted }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {CATEGORY_IDS.map((id) => {
            const label = CATEGORY_LABELS[id] || id;

            return (
              <TouchableOpacity
                key={id}
                onPress={() => setCategory(id)}
                style={[styles.filterChip, category === id && styles.filterChipActive]}
              >
                <Text style={styles.filterEmoji}>{CAT_EMOJIS[id]}</Text>
                <Text style={[styles.filterLabel, category === id && styles.filterLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={() => setShowSort(!showSort)} style={styles.sortBtn}>
          <Text style={styles.sortBtnText}>⇅ {"Sort by"}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_KEYS.map((key) => {
            const label = SORT_LABELS[key] || key;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSort(key);
                  setShowSort(false);
                }}
                style={styles.sortOption}
              >
                <Text style={[styles.sortOptionText, sort === key && styles.sortOptionActive]}>
                  {label}
                </Text>

                {sort === key && <Text style={{ color: COLORS.saffron }}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Product Grid */}
      <ScrollView
        style={styles.flatList}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>{"No products found"}</Text>
          </View>
        ) : (
          Array.from({ length: Math.ceil(filtered.length / 2) }, (_, i) => (
            <View key={i} style={styles.row}>
              {filtered.slice(i * 2, i * 2 + 2).map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  navigation={navigation}
                  isWishlisted={isWishlisted(item.id)}
                  onWishlist={toggleWishlist}
                />
              ))}

              {filtered.slice(i * 2, i * 2 + 2).length === 1 && <View style={styles.cardFiller} />}
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* AIAssistantFAB is rendered in ConsumerTabs — no instance needed here */}

    </View>
  );
}

const cardW = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

  flatList: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },

  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...SHADOWS.small,
  },

  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },

  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: COLORS.darkCard,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
  },

  filterChipActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  filterEmoji: { fontSize: 14 },
  filterLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterLabelActive: { color: '#fff' },

  sortBtn: {
    marginRight: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.darkCard,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
  },

  sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },

  sortDropdown: {
    position: 'absolute',
    top: 155,
    right: 16,
    zIndex: 999,
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    paddingVertical: 8,
    ...SHADOWS.large,
    width: 200,
  },

  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sortOptionText: { fontSize: 13, color: COLORS.textSecondary },
  sortOptionActive: { color: COLORS.saffron, fontWeight: '700' },

  grid: {
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'web' ? 40 : 20,
    flexGrow: 1,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  card: {
    width: cardW,
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },

  cardFiller: { width: cardW },

  imgBox: {
    height: 140,
    backgroundColor: COLORS.darkCard,
    overflow: 'hidden',
    position: 'relative',
  },

  img: { width: '100%', height: 140 },
  imgEmoji: { fontSize: 56, textAlign: 'center', lineHeight: 140 },

  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.bengalRed,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  badgeText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  heartBtn: { position: 'absolute', top: 8, right: 8 },

  info: { padding: 10 },
  name: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 17 },
  unit: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  price: { fontSize: 14, fontWeight: '700', color: COLORS.saffron },
  mrp: { fontSize: 10, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  off: { fontSize: 10, fontWeight: '700', color: COLORS.success },

  rRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },

  star: { fontSize: 11, color: COLORS.textSecondary },
  rev: { fontSize: 10, color: COLORS.textMuted },

  catTag: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  catTagText: { fontSize: 9, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
});