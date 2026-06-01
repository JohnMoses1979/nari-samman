



import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';

const FREE_DELIVERY_MINIMUM = 500;

function CartItem({ item, onUpdate, onRemove }) {
  const lineTotal = item.price * item.qty;

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemImgBox}>
        {imgSrc(item.image) ? (
          <Image source={imgSrc(item.image)} style={styles.itemImg} resizeMode="cover" />
        ) : (
          <Text style={styles.itemEmoji}>{item.emoji || '🛍️'}</Text>
        )}
      </View>

      <View style={styles.itemContent}>
        <View style={styles.itemTopRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemUnit}>{item.unit}</Text>
            <Text style={styles.itemPrice}>₹{item.price} each</Text>
          </View>

          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn} activeOpacity={0.8}>
            <Text style={styles.removeIcon}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemBottomRow}>
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => onUpdate(item.id, item.qty - 1)} style={styles.qtyBtn} activeOpacity={0.8}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{item.qty}</Text>
            <TouchableOpacity
              onPress={() => onUpdate(item.id, Math.min(item.stock || 99, item.qty + 1))}
              style={styles.qtyBtn}
              activeOpacity={0.8}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Item Total</Text>
            <Text style={styles.itemTotal}>₹{lineTotal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { cart, updateCartQty, removeFromCart, clearCart, getCartTotal, getCartCount } = useStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShowClearConfirm(false);
    });

    return unsubscribe;
  }, [navigation]);

  const total = getCartTotal();
  const itemCount = getCartCount();
  const delivery = total > 0 && total < FREE_DELIVERY_MINIMUM ? 60 : 0;
  const grandTotal = total + delivery;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_MINIMUM - total);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate('Checkout');
  };

  const handleClearAll = () => {
    if (Platform.OS === 'web') {
      setShowClearConfirm(true);
      return;
    }

    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add products from SHG artisans and continue checkout.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={styles.exploreBtn} activeOpacity={0.9}>
            <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.exploreBtnGrad}>
              <Text style={styles.exploreBtnText}>Start Shopping →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderSummary = () => (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</Text>
        <Text style={styles.summaryValue}>₹{total}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery</Text>
        <Text style={[styles.summaryValue, delivery === 0 && styles.freeValue]}>
          {delivery === 0 ? 'FREE' : `₹${delivery}`}
        </Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabelBig}>Grand Total</Text>
        <Text style={styles.totalValue}>₹{grandTotal}</Text>
      </View>

      <View style={styles.impactNote}>
        <Text style={styles.impactText}>🌱 Your order supports {cart.length} SHG artisan group{cart.length > 1 ? 's' : ''} in West Bengal</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Cart 🛒</Text>
          <Text style={styles.headerSub}>{itemCount} item{itemCount > 1 ? 's' : ''} ready for checkout</Text>
        </View>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn} activeOpacity={0.8}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.deliveryBanner, delivery === 0 && styles.freeBanner]}>
        <Text style={[styles.deliveryText, delivery === 0 && styles.freeText]}>
          {delivery === 0
            ? '🎉 You unlocked FREE delivery'
            : `Add ₹${remainingForFreeDelivery} more for FREE delivery`}
        </Text>
      </View>

      <ScrollView
        style={styles.flatList}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {cart.map((item, index) => (
          <React.Fragment key={item.id}>
            <CartItem item={item} onUpdate={updateCartQty} onRemove={removeFromCart} />
            {index !== cart.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}

        {renderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Payable</Text>
          <Text style={styles.footerTotal}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutBtn} activeOpacity={0.9}>
          <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.checkoutGrad}>
            <Text style={styles.checkoutText}>Checkout →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showClearConfirm && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmEmoji}>🛒</Text>
            <Text style={styles.confirmTitle}>Clear Cart?</Text>
            <Text style={styles.confirmMsg}>Remove all {cart.length} items from your cart?</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity onPress={() => setShowClearConfirm(false)} style={styles.keepBtn}>
                <Text style={styles.keepBtnText}>Keep Items</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                style={styles.clearConfirmBtn}>
                <Text style={styles.clearConfirmText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  flatList: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },

  emptyContainer: { flex: 1, backgroundColor: COLORS.dark, padding: 20, justifyContent: 'center' },
  emptyCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.medium,
  },
  emptyEmoji: { fontSize: 74, marginBottom: 14 },
  emptyTitle: { fontSize: 23, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  exploreBtn: { marginTop: 24, borderRadius: 50, overflow: 'hidden' },
  exploreBtnGrad: { paddingHorizontal: 32, paddingVertical: 14 },
  exploreBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 27, fontWeight: '900', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: COLORS.bengalRed + '15' },
  clearText: { fontSize: 13, color: COLORS.bengalRed, fontWeight: '800' },

  deliveryBanner: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: COLORS.saffron + '18',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.saffron + '35',
  },
  freeBanner: { backgroundColor: COLORS.success + '18', borderColor: COLORS.success + '35' },
  deliveryText: { fontSize: 14, color: COLORS.saffron, fontWeight: '800', textAlign: 'center' },
  freeText: { color: COLORS.success },

  list: { paddingHorizontal: 18, paddingTop: 2, paddingBottom: 120 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkCard,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  itemImgBox: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: COLORS.darkDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImg: { width: '100%', height: '100%' },
  itemEmoji: { fontSize: 38 },
  itemContent: { flex: 1, marginLeft: 12 },
  itemTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 19 },
  itemUnit: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  itemPrice: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, fontWeight: '600' },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bengalRed + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeIcon: { color: COLORS.bengalRed, fontSize: 21, fontWeight: '800', lineHeight: 22 },
  itemBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.darkDeep,
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  qtyBtn: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '900', color: COLORS.saffron },
  qtyNum: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  totalWrap: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
  itemTotal: { fontSize: 17, fontWeight: '900', color: COLORS.saffron },
  separator: { height: 12 },

  summary: {
    marginTop: 18,
    backgroundColor: COLORS.darkCard,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  summaryTitle: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: COLORS.textSecondary },
  summaryValue: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  freeValue: { color: COLORS.success },
  summaryDivider: { height: 1, backgroundColor: COLORS.darkBorder, marginVertical: 6 },
  totalLabelBig: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  totalValue: { fontSize: 27, fontWeight: '900', color: COLORS.saffron },
  impactNote: { marginTop: 12, backgroundColor: COLORS.green + '18', borderRadius: 16, padding: 13 },
  impactText: { fontSize: 12, color: COLORS.greenLight, fontWeight: '700', textAlign: 'center', lineHeight: 18 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.darkCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.large,
  },
  footerLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  footerTotal: { fontSize: 27, fontWeight: '900', color: COLORS.saffron, marginTop: 2 },
  checkoutBtn: { borderRadius: 50, overflow: 'hidden' },
  checkoutGrad: { paddingHorizontal: 32, paddingVertical: 16 },
  checkoutText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    paddingHorizontal: 24,
  },
  confirmBox: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 26,
    padding: 26,
    alignItems: 'center',
    width: '100%',
    maxWidth: 330,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.large,
  },
  confirmEmoji: { fontSize: 38, marginBottom: 10 },
  confirmTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 6 },
  confirmMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  confirmBtns: { flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' },
  keepBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  keepBtnText: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary },
  clearConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.bengalRed,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  clearConfirmText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});
