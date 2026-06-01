// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View, StyleSheet, ScrollView, TouchableOpacity,
//   Platform, Alert
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';

// import useStore from '../../store/useStore';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';
// import useAppLanguage from '../../autoTranslation/useAppLanguage';

// export default function CheckoutScreen({ navigation }) {
//   const lang = useAppLanguage();
//   const { cart, getCartTotal, placeOrder, user, addUserAddress } = useStore();
//   const addresses = user.addresses || [];
//   const defaultAddress = addresses.find((addr) => addr.default) || addresses[0] || null;

//   const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);
//   const [selectedPayment, setSelectedPayment] = useState('upi');
//   const [upiId, setUpiId] = useState('');
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [addressLabel, setAddressLabel] = useState('');
//   const [addressLine, setAddressLine] = useState('');
//   const [addressError, setAddressError] = useState('');

//   useEffect(() => {
//     if (!selectedAddressId && defaultAddress?.id) {
//       setSelectedAddressId(defaultAddress.id);
//       return;
//     }
//     if (selectedAddressId && !addresses.some((addr) => addr.id === selectedAddressId)) {
//       setSelectedAddressId(defaultAddress?.id || null);
//     }
//   }, [addresses, defaultAddress?.id, selectedAddressId]);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('blur', () => {
//       setShowAddressForm(false);
//       setAddressError('');
//     });

//     return unsubscribe;
//   }, [navigation]);

//   const selectedAddress = useMemo(
//     () => addresses.find((addr) => addr.id === selectedAddressId) || defaultAddress,
//     [addresses, defaultAddress, selectedAddressId]
//   );

//   const PAYMENT_METHODS = [
//     { id: 'upi', label: 'UPI / GPay / PhonePe', emoji: '📱' },
//     { id: 'card', label: 'Credit / Debit Card', emoji: '💳' },
//     { id: 'netbanking', label: 'Net Banking', emoji: '🏦' },
//     { id: 'cod', label: 'Cash on Delivery', emoji: '💵' }
//   ];

//   const subtotal = getCartTotal();
//   const delivery = subtotal > 500 ? 0 : 60;
//   const grandTotal = subtotal + delivery;

//   const showMessage = (title, message) => {
//     if (Platform.OS === 'web') window.alert(message || title);
//     else Alert.alert(title, message);
//   };

//   const handleAddAddress = () => {
//     const label = addressLabel.trim();
//     const line = addressLine.trim();

//     if (!label || !line) {
//       setAddressError('Please enter address label and full address');
//       return;
//     }
//     if (line.length < 10) {
//       setAddressError('Please enter a complete address with city and PIN');
//       return;
//     }

//     const saved = addUserAddress({ label, line, default: addresses.length === 0 });
//     setSelectedAddressId(saved.id);
//     setAddressLabel('');
//     setAddressLine('');
//     setAddressError('');
//     setShowAddressForm(false);
//   };


//   const handlePlaceOrder = () => {
//     if (cart.length === 0) {
//       showMessage('Cart Empty', 'Please add items to cart before checkout.');
//       navigation.navigate('ConsumerTabs', { screen: 'Cart' });
//       return;
//     }

//     if (!selectedAddress?.line) {
//       setAddressError('Please add/select a delivery address');
//       setShowAddressForm(true);
//       return;
//     }

//     if (selectedPayment === 'upi' && upiId.trim() && !upiId.includes('@')) {
//       showMessage('Invalid UPI ID', 'Please enter a valid UPI ID or leave it empty.');
//       return;
//     }

//     if (selectedPayment === 'cod') {
//       placeOrder(selectedAddress.line);
//       navigation.replace('OrderSuccess');
//       return;
//     }

//     navigation.navigate('PaymentMethods', {
//       checkout: {
//         amount: grandTotal,
//         deliveryAddress: selectedAddress.line,
//         paymentMethod: selectedPayment,
//         upiId: upiId.trim(),
//       },
//     });
//   };

//   // const handlePlaceOrder = () => {
//   //   if (cart.length === 0) {
//   //     showMessage('Cart Empty', 'Please add items to cart before checkout.');
//   //     navigation.navigate('ConsumerTabs', { screen: 'Cart' });
//   //     return;
//   //   }
//   //   if (!selectedAddress?.line) {
//   //     setAddressError('Please add/select a delivery address');
//   //     setShowAddressForm(true);
//   //     return;
//   //   }
//   //   if (selectedPayment === 'upi' && upiId.trim() && !upiId.includes('@')) {
//   //     showMessage('Invalid UPI ID', 'Please enter a valid UPI ID or leave it empty for demo checkout.');
//   //     return;
//   //   }

//   //   placeOrder(selectedAddress.line);
//   //   navigation.replace('OrderSuccess');
//   // };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Checkout</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
//         {/* Delivery Address */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📍 Delivery Address</Text>
//           {addresses.length === 0 ? (
//             <Text style={styles.emptyAddressText}>No saved address. Add a new address to continue checkout.</Text>
//           ) : null}

//           {addresses.map((addr) => (
//             <TouchableOpacity
//               key={addr.id}
//               onPress={() => setSelectedAddressId(addr.id)}
//               style={[styles.addressCard, selectedAddress?.id === addr.id && styles.addressCardActive]}
//             >
//               <View style={styles.addressRadio}>
//                 <View style={[styles.radio, selectedAddress?.id === addr.id && styles.radioActive]} />
//               </View>
//               <View style={styles.addressInfo}>
//                 <View style={styles.addressLabelRow}>
//                   <View style={styles.addressLabelBadge}>
//                     <Text style={styles.addressLabelText}>{addr.label}</Text>
//                   </View>
//                   {addr.default && <Text style={styles.defaultTag}>Default</Text>}
//                 </View>
//                 <Text style={styles.addressLine}>{addr.line}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}

//           {showAddressForm ? (
//             <View style={styles.inlineAddressForm}>
//               <Text style={styles.inlineFormTitle}>➕ Add New Address</Text>
//               <TextInput
//                 style={styles.formInput}
//                 placeholder="Label e.g. Home, Office"
//                 placeholderTextColor={COLORS.textMuted}
//                 value={addressLabel}
//                 onChangeText={(v) => { setAddressLabel(v); setAddressError(''); }}
//               />
//               <TextInput
//                 style={[styles.formInput, styles.formInputMulti]}
//                 placeholder="Full address with city and PIN"
//                 placeholderTextColor={COLORS.textMuted}
//                 value={addressLine}
//                 onChangeText={(v) => { setAddressLine(v); setAddressError(''); }}
//                 multiline
//                 numberOfLines={3}
//               />
//               {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
//               <View style={styles.formBtns}>
//                 <TouchableOpacity onPress={() => { setShowAddressForm(false); setAddressError(''); }} style={styles.cancelAddressBtn}>
//                   <Text style={styles.cancelAddressText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleAddAddress} style={styles.saveAddressBtn}>
//                   <Text style={styles.saveAddressText}>Save Address</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ) : (
//             <TouchableOpacity style={styles.addAddrBtn} onPress={() => setShowAddressForm(true)}>
//               <Text style={styles.addAddrText}>+ Add New Address</Text>
//             </TouchableOpacity>
//           )}

//           {addressError && !showAddressForm ? <Text style={styles.errorText}>{addressError}</Text> : null}
//         </View>

//         {/* Order Items Summary */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🛒 Order Items ({cart.length})</Text>
//           {cart.map((item) => (
//             <View key={item.id} style={styles.orderItem}>
//               <Text style={styles.orderItemEmoji}>{item.emoji}</Text>
//               <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
//               <Text style={styles.orderItemQty}>x{item.qty}</Text>
//               <Text style={styles.orderItemPrice}>₹{item.price * item.qty}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Payment Method */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>💳 Payment Method</Text>
//           {PAYMENT_METHODS.map((pm) => (
//             <TouchableOpacity
//               key={pm.id}
//               onPress={() => setSelectedPayment(pm.id)}
//               style={[styles.paymentCard, selectedPayment === pm.id && styles.paymentCardActive]}
//             >
//               <View style={[styles.radio, selectedPayment === pm.id && styles.radioActive]} />
//               <Text style={styles.paymentEmoji}>{pm.emoji}</Text>
//               <Text style={styles.paymentLabel}>{pm.label}</Text>
//             </TouchableOpacity>
//           ))}
//           {selectedPayment === 'upi' && (
//             <View style={styles.upiInput}>
//               <TextInput
//                 placeholder="Enter UPI ID (optional for demo)"
//                 placeholderTextColor={COLORS.textMuted}
//                 style={styles.upiTextInput}
//                 value={upiId}
//                 onChangeText={setUpiId}
//                 autoCapitalize="none"
//               />
//             </View>
//           )}
//         </View>

//         {/* Price Breakdown */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>💰 Price Details</Text>
//           <View style={styles.priceSummary}>
//             <View style={styles.priceRow}>
//               <Text style={styles.priceLabel}>Items Total</Text>
//               <Text style={styles.priceVal}>₹{subtotal}</Text>
//             </View>
//             <View style={styles.priceRow}>
//               <Text style={styles.priceLabel}>Delivery Charges</Text>
//               <Text style={[styles.priceVal, delivery === 0 && { color: COLORS.success }]}>
//                 {delivery === 0 ? 'FREE' : `₹${delivery}`}
//               </Text>
//             </View>
//             <View style={[styles.priceRow, styles.grandRow]}>
//               <Text style={styles.grandLabel}>Amount Payable</Text>
//               <Text style={styles.grandVal}>₹{grandTotal}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Impact Note */}
//         <LinearGradient colors={[COLORS.green + '20', COLORS.greenLight + '10']} style={styles.impactCard}>
//           <Text style={styles.impactTitle}>🌱 Your Impact</Text>
//           <Text style={styles.impactText}>This order directly supports SHG women and artisan families in West Bengal. Every rupee you spend creates dignified livelihoods.</Text>
//         </LinearGradient>

//         <View style={{ height: 20 }} />

//         {/* Place Order CTA */}
//         <View style={styles.footer}>
//           <View>
//             <Text style={styles.footerLabel}>Amount Payable</Text>
//             <Text style={styles.footerTotal}>₹{grandTotal}</Text>
//           </View>
//           <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderBtn}>
//             <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.placeOrderGrad}>
//               <Text style={styles.placeOrderText}>Place Order 🎉</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
//     backgroundColor: COLORS.darkCard, ...SHADOWS.small
//   },
//   backBtn: { padding: 4 },
//   backText: { fontSize: 15, color: COLORS.saffron, fontWeight: '600' },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
//   scroll: { flex: 1, minHeight: 0 },
//   scrollContent: { paddingHorizontal: 16, paddingTop: 16, flexGrow: 1 },
//   section: { marginBottom: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.small },
//   sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
//   emptyAddressText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginBottom: 12 },
//   addressCard: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, marginBottom: 10 },
//   addressCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
//   addressRadio: { paddingTop: 2 },
//   radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.textMuted },
//   radioActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron },
//   addressInfo: { flex: 1 },
//   addressLabelRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
//   addressLabelBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
//   addressLabelText: { fontSize: 11, fontWeight: '700', color: COLORS.saffron },
//   defaultTag: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
//   addressLine: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
//   addAddrBtn: { paddingTop: 4 },
//   addAddrText: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },
//   inlineAddressForm: { marginTop: 4, borderTopWidth: 1, borderTopColor: COLORS.darkBorder, paddingTop: 14 },
//   inlineFormTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
//   formInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, borderWidth: 1, borderColor: COLORS.darkBorder, paddingHorizontal: 14, paddingVertical: 12, color: COLORS.textPrimary, fontSize: 14, marginBottom: 10 },
//   formInputMulti: { minHeight: 78, textAlignVertical: 'top' },
//   formBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
//   cancelAddressBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.2, borderColor: COLORS.darkBorder, alignItems: 'center' },
//   cancelAddressText: { color: COLORS.textMuted, fontWeight: '700' },
//   saveAddressBtn: { flex: 1.4, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.saffron, alignItems: 'center' },
//   saveAddressText: { color: '#fff', fontWeight: '800' },
//   errorText: { color: COLORS.error || COLORS.bengalRed, fontSize: 11, marginTop: 4, fontWeight: '700' },
//   orderItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
//   orderItemEmoji: { fontSize: 22 },
//   orderItemName: { flex: 1, fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },
//   orderItemQty: { fontSize: 13, color: COLORS.textMuted },
//   orderItemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.saffron },
//   paymentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, marginBottom: 8 },
//   paymentCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
//   paymentEmoji: { fontSize: 20 },
//   paymentLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
//   upiInput: { backgroundColor: COLORS.darkCard, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginTop: 4 },
//   upiTextInput: { fontSize: 14, color: COLORS.textPrimary },
//   priceSummary: { gap: 12 },
//   priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   priceLabel: { fontSize: 14, color: COLORS.textSecondary },
//   priceVal: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
//   grandRow: { borderTopWidth: 1, borderColor: COLORS.darkBorder, paddingTop: 12, marginTop: 4 },
//   grandLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
//   grandVal: { fontSize: 20, fontWeight: '800', color: COLORS.saffron },
//   impactCard: { borderRadius: 20, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.greenLight + '40' },
//   impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 6 },
//   impactText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
//   footer: {
//     backgroundColor: COLORS.darkCard, flexDirection: 'row', alignItems: 'center',
//     justifyContent: 'space-between', paddingHorizontal: 16,
//     paddingTop: 14, paddingBottom: Platform.OS === 'web' ? 14 : 30,
//     borderTopWidth: 1, borderColor: COLORS.darkBorder, ...SHADOWS.medium
//   },
//   footerLabel: { fontSize: 11, color: COLORS.textMuted },
//   footerTotal: { fontSize: 22, fontWeight: '800', color: COLORS.saffron },
//   placeOrderBtn: { borderRadius: 50, overflow: 'hidden' },
//   placeOrderGrad: { paddingHorizontal: 28, paddingVertical: 14 },
//   placeOrderText: { color: '#fff', fontWeight: '700', fontSize: 14 }
// });





import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';

import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import useAppLanguage from '../../autoTranslation/useAppLanguage';
import RazorpayDemoModal from './RazorpayDemoModal';

const BANK_OPTIONS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
];

export default function CheckoutScreen({ navigation }) {
  const lang = useAppLanguage();
  const { cart, getCartTotal, placeOrder, user, addUserAddress } = useStore();
  const addresses = user.addresses || [];
  const defaultAddress = addresses.find((addr) => addr.default) || addresses[0] || null;

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [selectedBank, setSelectedBank] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressError, setAddressError] = useState('');

  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!selectedAddressId && defaultAddress?.id) {
      setSelectedAddressId(defaultAddress.id);
      return;
    }

    if (selectedAddressId && !addresses.some((addr) => addr.id === selectedAddressId)) {
      setSelectedAddressId(defaultAddress?.id || null);
    }
  }, [addresses, defaultAddress?.id, selectedAddressId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setShowAddressForm(false);
      setAddressError('');
      setPaymentError('');
      setShowRazorpay(false);
    });

    return unsubscribe;
  }, [navigation]);

  const selectedAddress = useMemo(
    () => addresses.find((addr) => addr.id === selectedAddressId) || defaultAddress,
    [addresses, defaultAddress, selectedAddressId]
  );

  const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI / GPay / PhonePe', emoji: '📱' },
    { id: 'card', label: 'Credit / Debit Card', emoji: '💳' },
    { id: 'netbanking', label: 'Net Banking', emoji: '🏦' },
    { id: 'cod', label: 'Cash on Delivery', emoji: '💵' },
  ];

  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 60;
  const grandTotal = subtotal + delivery;

  const showMessage = (title, message) => {
    if (Platform.OS === 'web') window.alert(message || title);
    else Alert.alert(title, message);
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const cardPreview = cardNumber.replace(/\D/g, '').length >= 4
    ? `**** ${cardNumber.replace(/\D/g, '').slice(-4)}`
    : '';

  const handleAddAddress = () => {
    const label = addressLabel.trim();
    const line = addressLine.trim();

    if (!label || !line) {
      setAddressError('Please enter address label and full address');
      return;
    }

    if (line.length < 10) {
      setAddressError('Please enter a complete address with city and PIN');
      return;
    }

    const saved = addUserAddress({ label, line, default: addresses.length === 0 });

    setSelectedAddressId(saved.id);
    setAddressLabel('');
    setAddressLine('');
    setAddressError('');
    setShowAddressForm(false);
  };

  const openUpiApp = async () => {
    const payee = encodeURIComponent(upiId.trim());
    const name = encodeURIComponent('Nari Samman');
    const amount = encodeURIComponent(String(grandTotal));
    const note = encodeURIComponent('Nari Samman Order Payment');
    const transactionRef = encodeURIComponent(`NS${Date.now()}`);

    const url =
      selectedUpiApp === 'phonepe'
        ? `phonepe://pay?pa=${payee}&pn=${name}&am=${amount}&cu=INR&tn=${note}&tr=${transactionRef}`
        : `upi://pay?pa=${payee}&pn=${name}&am=${amount}&cu=INR&tn=${note}&tr=${transactionRef}`;

    if (Platform.OS === 'web') {
      showMessage('UPI Verified', 'UPI verified. On mobile, this will redirect to PhonePe or Google Pay.');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      showMessage(
        'Payment App Not Found',
        'Selected UPI app could not open. You can still click Pay Now to continue with Razorpay sample checkout.'
      );
    }
  };

  const verifyUpiId = async () => {
    const value = upiId.trim();

    if (!value) {
      setPaymentError('Please enter UPI ID.');
      return;
    }

    if (!value.includes('@') || value.length < 6) {
      setPaymentError('Please enter a valid UPI ID, example: name@upi');
      setUpiVerified(false);
      return;
    }

    setPaymentError('');
    setUpiVerified(true);
    await openUpiApp();
  };

  const validatePaymentBeforePay = () => {
    setPaymentError('');

    if (selectedPayment === 'upi') {
      if (!upiId.trim()) {
        setPaymentError('Please enter your UPI ID.');
        return false;
      }

      if (!upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI ID.');
        return false;
      }

      if (!upiVerified) {
        setPaymentError('Please verify UPI ID before Pay Now.');
        return false;
      }
    }

    if (selectedPayment === 'card') {
      const digits = cardNumber.replace(/\D/g, '');

      if (!cardName.trim()) {
        setPaymentError('Please enter card holder name.');
        return false;
      }

      if (digits.length < 12) {
        setPaymentError('Please enter valid card number.');
        return false;
      }

      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setPaymentError('Please enter expiry in MM/YY format.');
        return false;
      }

      if (cardCvv.trim().length < 3) {
        setPaymentError('Please enter valid CVV.');
        return false;
      }
    }

    if (selectedPayment === 'netbanking') {
      if (!selectedBank) {
        setPaymentError('Please select your bank.');
        return false;
      }
    }

    return true;
  };

  const handleNetBankSelection = (bank) => {
    setSelectedBank(bank);
    setPaymentError('');

    if (cart.length === 0) {
      showMessage('Cart Empty', 'Please add items to cart before checkout.');
      navigation.navigate('ConsumerTabs', { screen: 'Cart' });
      return;
    }

    if (!selectedAddress?.line) {
      setAddressError('Please add/select a delivery address');
      setShowAddressForm(true);
      return;
    }

    setShowRazorpay(true);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showMessage('Cart Empty', 'Please add items to cart before checkout.');
      navigation.navigate('ConsumerTabs', { screen: 'Cart' });
      return;
    }

    if (!selectedAddress?.line) {
      setAddressError('Please add/select a delivery address');
      setShowAddressForm(true);
      return;
    }

    if (selectedPayment === 'cod') {
      try {
        await placeOrder(selectedAddress.line, { paymentMethod: 'COD', paymentStatus: 'pending' });
        navigation.replace('OrderSuccess');
      } catch (err) {
        showMessage('Order Failed', err.message || 'Could not place your order. Please try again.');
      }
      return;
    }

    if (!validatePaymentBeforePay()) return;

    setShowRazorpay(true);
  };

  const handleRazorpaySuccess = () => {
    setIsProcessing(true);

    setTimeout(async () => {
      setIsProcessing(false);
      setShowRazorpay(false);
      try {
        await placeOrder(selectedAddress.line, { paymentMethod: selectedPayment?.toUpperCase?.() || 'UPI', paymentStatus: 'paid' });
        navigation.replace('OrderSuccess');
      } catch (err) {
        showMessage('Order Failed', err.message || 'Could not place your order. Please try again.');
      }
    }, 900);
  };

  const renderCartRow = (item) => {
    const itemTotal = Number(item.price || 0) * Number(item.qty || 1);

    return (
      <View key={item.id} style={styles.orderItemCard}>
        <View style={styles.orderItemThumb}>
          {item.image ? (
            <Image source={imgSrc(item.image)} style={styles.orderItemThumbImage} resizeMode="cover" />
          ) : (
            <Text style={styles.orderItemThumbEmoji}>{item.emoji || '🛍️'}</Text>
          )}
        </View>

        <View style={styles.orderItemBody}>
          <Text style={styles.orderItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.orderItemMeta} numberOfLines={1}>
            {item.unit || 'piece'} • Qty {item.qty}
          </Text>
        </View>

        <View style={styles.orderItemTotals}>
          <Text style={styles.orderItemPrice}>₹{Number(item.price || 0)}</Text>
          <Text style={styles.orderItemLineTotal}>₹{itemTotal}</Text>
        </View>
      </View>
    );
  };

  const renderUpiForm = () => (
    <LinearGradient colors={[COLORS.purple + '18', COLORS.saffron + '10']} style={styles.paymentFormBox}>
      <Text style={styles.formPaymentTitle}>📱 Verify UPI ID</Text>
      <Text style={styles.formPaymentSub}>Enter UPI ID and select the app to redirect after verification.</Text>

      <TextInput
        placeholder="Enter UPI ID e.g. name@upi"
        placeholderTextColor={COLORS.textMuted}
        style={styles.paymentInput}
        value={upiId}
        onChangeText={(v) => {
          setUpiId(v);
          setUpiVerified(false);
          setPaymentError('');
        }}
        autoCapitalize="none"
      />

      <View style={styles.upiAppRow}>
        <TouchableOpacity
          onPress={() => setSelectedUpiApp('gpay')}
          style={[styles.upiAppBtn, selectedUpiApp === 'gpay' && styles.upiAppBtnActive]}
        >
          <Text style={styles.upiAppText}>Google Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedUpiApp('phonepe')}
          style={[styles.upiAppBtn, selectedUpiApp === 'phonepe' && styles.upiAppBtnActive]}
        >
          <Text style={styles.upiAppText}>PhonePe</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={verifyUpiId} style={styles.verifyUpiBtn}>
        <Text style={styles.verifyUpiText}>{upiVerified ? '✓ UPI Verified' : 'Verify UPI & Open App'}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderCardForm = () => (
    <LinearGradient colors={[COLORS.info + '18', COLORS.purple + '10']} style={styles.paymentFormBox}>
      <Text style={styles.formPaymentTitle}>💳 Card Details</Text>
      <Text style={styles.formPaymentSub}>Demo card form. Real card processing should happen inside Razorpay Checkout.</Text>

      <TextInput
        placeholder="Card Holder Name"
        placeholderTextColor={COLORS.textMuted}
        style={styles.paymentInput}
        value={cardName}
        onChangeText={(v) => {
          setCardName(v);
          setPaymentError('');
        }}
      />

      <TextInput
        placeholder="Card Number"
        placeholderTextColor={COLORS.textMuted}
        style={styles.paymentInput}
        value={cardNumber}
        onChangeText={(v) => {
          setCardNumber(formatCardNumber(v));
          setPaymentError('');
        }}
        keyboardType="number-pad"
        maxLength={19}
      />

      <View style={styles.cardSmallRow}>
        <TextInput
          placeholder="MM/YY"
          placeholderTextColor={COLORS.textMuted}
          style={[styles.paymentInput, styles.cardSmallInput]}
          value={cardExpiry}
          onChangeText={(v) => {
            setCardExpiry(formatExpiry(v));
            setPaymentError('');
          }}
          keyboardType="number-pad"
          maxLength={5}
        />

        <TextInput
          placeholder="CVV"
          placeholderTextColor={COLORS.textMuted}
          style={[styles.paymentInput, styles.cardSmallInput]}
          value={cardCvv}
          onChangeText={(v) => {
            setCardCvv(v.replace(/\D/g, '').slice(0, 4));
            setPaymentError('');
          }}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />
      </View>
    </LinearGradient>
  );

  const renderNetBankingForm = () => (
    <LinearGradient colors={[COLORS.green + '18', COLORS.teal + '10']} style={styles.paymentFormBox}>
      <Text style={styles.formPaymentTitle}>🏦 Select Bank</Text>
      <Text style={styles.formPaymentSub}>Choose your bank. Pay Now will open Razorpay sample checkout.</Text>

      {BANK_OPTIONS.map((bank) => (
        <TouchableOpacity
          key={bank}
          onPress={() => handleNetBankSelection(bank)}
          style={[styles.bankOption, selectedBank === bank && styles.bankOptionActive]}
        >
          <Text style={styles.bankText}>{bank}</Text>
          {selectedBank === bank && <Text style={styles.bankCheck}>✓</Text>}
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );

  const renderCodNote = () => (
    <View style={styles.codBox}>
      <Text style={styles.codTitle}>💵 Cash on Delivery</Text>
      <Text style={styles.codText}>You can pay when the order is delivered to your address.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Delivery Address</Text>

          {addresses.length === 0 ? (
            <Text style={styles.emptyAddressText}>
              No saved address. Add a new address to continue checkout.
            </Text>
          ) : null}

          {addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => setSelectedAddressId(addr.id)}
              style={[
                styles.addressCard,
                selectedAddress?.id === addr.id && styles.addressCardActive,
              ]}
            >
              <View style={styles.addressRadio}>
                <View
                  style={[
                    styles.radio,
                    selectedAddress?.id === addr.id && styles.radioActive,
                  ]}
                />
              </View>

              <View style={styles.addressInfo}>
                <View style={styles.addressLabelRow}>
                  <View style={styles.addressLabelBadge}>
                    <Text style={styles.addressLabelText}>{addr.label}</Text>
                  </View>

                  {addr.default && <Text style={styles.defaultTag}>Default</Text>}
                </View>

                <Text style={styles.addressLine}>{addr.line}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {showAddressForm ? (
            <View style={styles.inlineAddressForm}>
              <Text style={styles.inlineFormTitle}>➕ Add New Address</Text>

              <TextInput
                style={styles.formInput}
                placeholder="Label e.g. Home, Office"
                placeholderTextColor={COLORS.textMuted}
                value={addressLabel}
                onChangeText={(v) => {
                  setAddressLabel(v);
                  setAddressError('');
                }}
              />

              <TextInput
                style={[styles.formInput, styles.formInputMulti]}
                placeholder="Full address with city and PIN"
                placeholderTextColor={COLORS.textMuted}
                value={addressLine}
                onChangeText={(v) => {
                  setAddressLine(v);
                  setAddressError('');
                }}
                multiline
                numberOfLines={3}
              />

              {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

              <View style={styles.formBtns}>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddressForm(false);
                    setAddressError('');
                  }}
                  style={styles.cancelAddressBtn}
                >
                  <Text style={styles.cancelAddressText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleAddAddress} style={styles.saveAddressBtn}>
                  <Text style={styles.saveAddressText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addAddrBtn} onPress={() => setShowAddressForm(true)}>
              <Text style={styles.addAddrText}>+ Add New Address</Text>
            </TouchableOpacity>
          )}

          {addressError && !showAddressForm ? (
            <Text style={styles.errorText}>{addressError}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Order Items ({cart.length})</Text>

          {cart.map(renderCartRow)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>

          {PAYMENT_METHODS.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              onPress={() => {
                setSelectedPayment(pm.id);
                setPaymentError('');
              }}
              style={[
                styles.paymentCard,
                selectedPayment === pm.id && styles.paymentCardActive,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  selectedPayment === pm.id && styles.radioActive,
                ]}
              />
              <Text style={styles.paymentEmoji}>{pm.emoji}</Text>
              <Text style={styles.paymentLabel}>{pm.label}</Text>
            </TouchableOpacity>
          ))}

          {selectedPayment === 'upi' && renderUpiForm()}
          {selectedPayment === 'card' && renderCardForm()}
          {selectedPayment === 'netbanking' && renderNetBankingForm()}
          {selectedPayment === 'cod' && renderCodNote()}

          {paymentError ? <Text style={styles.paymentErrorText}>{paymentError}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Price Details</Text>

          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Items Total</Text>
              <Text style={styles.priceVal}>₹{subtotal}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Charges</Text>
              <Text style={[styles.priceVal, delivery === 0 && { color: COLORS.success }]}>
                {delivery === 0 ? 'FREE' : `₹${delivery}`}
              </Text>
            </View>

            <View style={[styles.priceRow, styles.grandRow]}>
              <Text style={styles.grandLabel}>Amount Payable</Text>
              <Text style={styles.grandVal}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={[COLORS.green + '20', COLORS.greenLight + '10']}
          style={styles.impactCard}
        >
          <Text style={styles.impactTitle}>🌱 Your Impact</Text>
          <Text style={styles.impactText}>
            This order directly supports SHG women and artisan families in West Bengal. Every
            rupee you spend creates dignified livelihoods.
          </Text>
        </LinearGradient>

        <View style={{ height: 20 }} />

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Amount Payable</Text>
            <Text style={styles.footerTotal}>₹{grandTotal}</Text>
          </View>

          <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderBtn}>
            <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.placeOrderGrad}>
              <Text style={styles.placeOrderText}>
                {selectedPayment === 'cod' ? 'Place Order 🎉' : 'Pay Now'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <RazorpayDemoModal
        visible={showRazorpay}
        amount={grandTotal}
        paymentMethod={selectedPayment}
        upiId={upiId.trim()}
        cardPreview={cardPreview}
        bankName={selectedBank}
        isProcessing={isProcessing}
        onClose={() => setShowRazorpay(false)}
        onSuccess={handleRazorpaySuccess}
      />
    </View>
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
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.darkCard,
    ...SHADOWS.small,
  },

  backBtn: {
    padding: 4,
  },

  backText: {
    fontSize: 15,
    color: COLORS.saffron,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  scroll: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 20,
    flexGrow: 1,
  },

  section: {
    marginBottom: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.small,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },

  emptyAddressText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },

  addressCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    marginBottom: 10,
  },

  addressCardActive: {
    borderColor: COLORS.saffron,
    backgroundColor: COLORS.saffron + '08',
  },

  addressRadio: {
    paddingTop: 2,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
  },

  radioActive: {
    borderColor: COLORS.saffron,
    backgroundColor: COLORS.saffron,
  },

  addressInfo: {
    flex: 1,
  },

  addressLabelRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },

  addressLabelBadge: {
    backgroundColor: COLORS.saffron + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  addressLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.saffron,
  },

  defaultTag: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
  },

  addressLine: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  addAddrBtn: {
    paddingTop: 4,
  },

  addAddrText: {
    fontSize: 13,
    color: COLORS.saffron,
    fontWeight: '600',
  },

  inlineAddressForm: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkBorder,
    paddingTop: 14,
  },

  inlineFormTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },

  formInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 10,
  },

  formInputMulti: {
    minHeight: 78,
    textAlignVertical: 'top',
  },

  formBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  cancelAddressBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.darkBorder,
    alignItems: 'center',
  },

  cancelAddressText: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },

  saveAddressBtn: {
    flex: 1.4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.saffron,
    alignItems: 'center',
  },

  saveAddressText: {
    color: '#fff',
    fontWeight: '800',
  },

  errorText: {
    color: COLORS.error || COLORS.bengalRed,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
  },

  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    marginBottom: 10,
  },

  orderItemThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkDeep,
    overflow: 'hidden',
  },

  orderItemThumbImage: {
    width: '100%',
    height: '100%',
  },

  orderItemThumbEmoji: {
    fontSize: 22,
  },

  orderItemBody: {
    flex: 1,
    minWidth: 0,
  },

  orderItemMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  orderItemTotals: {
    alignItems: 'flex-end',
  },

  orderItemLineTotal: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.saffron,
    marginTop: 2,
  },

  orderItemEmoji: {
    fontSize: 22,
  },

  orderItemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  orderItemQty: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.saffron,
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    marginBottom: 8,
  },

  paymentCardActive: {
    borderColor: COLORS.saffron,
    backgroundColor: COLORS.saffron + '08',
  },

  paymentEmoji: {
    fontSize: 20,
  },

  paymentLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  paymentFormBox: {
    borderRadius: 18,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },

  formPaymentTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },

  formPaymentSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 12,
  },

  paymentInput: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 10,
  },

  upiAppRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  upiAppBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.darkCard,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    alignItems: 'center',
  },

  upiAppBtnActive: {
    borderColor: COLORS.saffron,
    backgroundColor: COLORS.saffron + '18',
  },

  upiAppText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  verifyUpiBtn: {
    backgroundColor: COLORS.saffron,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },

  verifyUpiText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },

  cardSmallRow: {
    flexDirection: 'row',
    gap: 10,
  },

  cardSmallInput: {
    flex: 1,
  },

  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    marginBottom: 8,
  },

  bankOptionActive: {
    borderColor: COLORS.saffron,
    backgroundColor: COLORS.saffron + '18',
  },

  bankText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  bankCheck: {
    color: COLORS.saffron,
    fontSize: 15,
    fontWeight: '900',
  },

  codBox: {
    marginTop: 10,
    backgroundColor: COLORS.green + '15',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.green + '35',
  },

  codTitle: {
    fontSize: 14,
    color: COLORS.green,
    fontWeight: '900',
  },

  codText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  paymentErrorText: {
    color: COLORS.error || COLORS.bengalRed,
    fontSize: 12,
    marginTop: 10,
    fontWeight: '800',
  },

  priceSummary: {
    gap: 12,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  priceVal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  grandRow: {
    borderTopWidth: 1,
    borderColor: COLORS.darkBorder,
    paddingTop: 12,
    marginTop: 4,
  },

  grandLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  grandVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.saffron,
  },

  impactCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.greenLight + '40',
  },

  impactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
    marginBottom: 6,
  },

  impactText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  footer: {
    backgroundColor: COLORS.darkCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'web' ? 14 : 30,
    borderTopWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.medium,
  },

  footerLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  footerTotal: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.saffron,
  },

  placeOrderBtn: {
    borderRadius: 50,
    overflow: 'hidden',
  },

  placeOrderGrad: {
    paddingHorizontal: 28,
    paddingVertical: 14,
  },

  placeOrderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
