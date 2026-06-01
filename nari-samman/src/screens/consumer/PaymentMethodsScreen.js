// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore from '../../store/useStore';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';
// import useAppLanguage from '../../autoTranslation/useAppLanguage';
// import { createPaymentOrder, launchRazorpayCheckout, verifyPayment } from '../../utils/paymentFlow';

// const SAVED_METHODS = [
//   { id: 'm1', type: 'upi', label: 'aarav@oksbi', name: 'SBI UPI', emoji: 'UPI', color: COLORS.purple },
//   { id: 'm2', type: 'card', label: '**** **** **** 4242', name: 'HDFC Visa', emoji: 'CARD', color: COLORS.info },
// ];

// const ADD_OPTIONS = [
//   { id: 'upi', emoji: 'UPI', label: 'UPI / GPay / PhonePe', desc: 'Pay instantly using any UPI app' },
//   { id: 'card', emoji: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
//   { id: 'netbanking', emoji: 'BANK', label: 'Net Banking', desc: 'All major Indian banks' },
//   { id: 'cod', emoji: 'CASH', label: 'Cash on Delivery', desc: 'Pay after your order is delivered' },
// ];

// export default function PaymentMethodsScreen({ navigation, route }) {
//   const lang = useAppLanguage();
//   const { user, placeOrder } = useStore();
//   const checkout = route?.params?.checkout || null;
//   const isCheckoutFlow = !!checkout;

//   const initialPaymentMethod = checkout?.paymentMethod || 'upi';
//   const [selectedSavedMethod, setSelectedSavedMethod] = useState(initialPaymentMethod === 'card' ? 'm2' : 'm1');
//   const [selectedPayment, setSelectedPayment] = useState(initialPaymentMethod);
//   const [addUpi, setAddUpi] = useState(checkout?.upiId || '');
//   const [showUpiForm, setShowUpiForm] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     if (!checkout?.paymentMethod) {
//       return;
//     }

//     setSelectedPayment(checkout.paymentMethod);
//     setSelectedSavedMethod(checkout.paymentMethod === 'card' ? 'm2' : 'm1');
//   }, [checkout?.paymentMethod]);

//   const showMessage = (title, message) => {
//     if (Platform.OS === 'web') window.alert(message || title);
//     else Alert.alert(title, message);
//   };

//   const finishCheckout = () => {
//     if (!checkout?.deliveryAddress) {
//       showMessage('Missing Address', 'Delivery address was not provided from checkout.');
//       return;
//     }

//     placeOrder(checkout.deliveryAddress);
//     navigation.replace('OrderSuccess');
//   };

//   const runPayment = async (paymentMethod, upiValue = '') => {
//     if (!isCheckoutFlow || isProcessing) {
//       return;
//     }

//     if (paymentMethod === 'cod') {
//       finishCheckout();
//       return;
//     }

//     if (paymentMethod === 'upi' && upiValue && !upiValue.includes('@')) {
//       showMessage('Invalid UPI ID', 'Please enter a valid UPI ID or leave it empty.');
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const orderData = await createPaymentOrder({
//         amount: checkout.amount,
//         paymentMethod,
//         deliveryAddress: checkout.deliveryAddress,
//       });

//       const paymentOptions = {
//         key: orderData.key,
//         amount: orderData.amount,
//         currency: orderData.currency || 'INR',
//         name: 'Nari Samman',
//         description: `Payment for order of Rs ${checkout.amount}`,
//         order_id: orderData.orderId,
//         method: paymentMethod,
//         prefill: {
//           name: user?.name || 'Customer',
//           email: user?.email || '',
//           contact: user?.phone || user?.mobile || '',
//           vpa: paymentMethod === 'upi' ? upiValue : undefined,
//         },
//         theme: { color: COLORS.saffron },
//       };

//       const paymentResponse = await launchRazorpayCheckout(paymentOptions);

//       await verifyPayment({
//         razorpay_order_id: paymentResponse.razorpay_order_id,
//         razorpay_payment_id: paymentResponse.razorpay_payment_id,
//         razorpay_signature: paymentResponse.razorpay_signature,
//       });

//       finishCheckout();
//     } catch (error) {
//       const message = error?.description || error?.message || 'Payment was cancelled or failed.';
//       showMessage('Payment Issue', message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const onSavedMethodPress = (method) => {
//     setSelectedSavedMethod(method.id);
//     setSelectedPayment(method.type);
//     if (method.type === 'upi') {
//       setShowUpiForm(true);
//     }
//   };

//   const onPaymentOptionPress = (opt) => {
//     setSelectedPayment(opt.id);
//     setShowUpiForm(opt.id === 'upi');
//   };

//   const onUpiAction = async () => {
//     if (isCheckoutFlow) {
//       await runPayment(selectedPayment || 'upi', addUpi.trim());
//       return;
//     }

//     setAddUpi('');
//     setShowUpiForm(false);
//   };

//   const actionLabel = isCheckoutFlow ? 'Place Order' : 'Verify & Save';

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>{"<- Back"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Payment Methods</Text>
//         <Text style={styles.headerSub}>{isCheckoutFlow ? 'Choose a payment mode and place the order' : 'Manage Payment'}</Text>
//       </LinearGradient>

//       <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         <Text style={styles.sectionTitle}>Saved Methods</Text>
//         {SAVED_METHODS.map((m) => (
//           <TouchableOpacity
//             key={m.id}
//             onPress={() => onSavedMethodPress(m)}
//             style={[styles.methodCard, selectedSavedMethod === m.id && styles.methodCardActive]}
//             activeOpacity={0.85}
//           >
//             <View style={[styles.methodIconBox, { backgroundColor: m.color + '20' }]}>
//               <Text style={styles.methodEmoji}>{m.emoji}</Text>
//             </View>
//             <View style={styles.methodInfo}>
//               <Text style={styles.methodName}>{m.name}</Text>
//               <Text style={styles.methodLabel}>{m.label}</Text>
//             </View>
//             <View style={[styles.radio, selectedSavedMethod === m.id && styles.radioActive]} />
//           </TouchableOpacity>
//         ))}

//         <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Add UPI ID</Text>
//         <View style={styles.upiForm}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter UPI ID (e.g. name@upi)"
//             placeholderTextColor={COLORS.textMuted}
//             value={addUpi}
//             onChangeText={setAddUpi}
//           />

//           <TouchableOpacity style={styles.verifyBtn} onPress={onUpiAction} activeOpacity={0.9} disabled={isProcessing}>
//             <Text style={styles.verifyBtnText}>{actionLabel}</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={[styles.sectionTitle, { marginTop: 20 }]}>More Payment Options</Text>
//         {ADD_OPTIONS.map((opt) => (
//           <TouchableOpacity
//             key={opt.id}
//             onPress={() => onPaymentOptionPress(opt)}
//             style={[styles.optionCard, selectedPayment === opt.id && styles.optionCardActive]}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.optionEmoji}>{opt.emoji}</Text>
//             <View style={styles.optionInfo}>
//               <Text style={styles.optionLabel}>{opt.label}</Text>
//               <Text style={styles.optionDesc}>{opt.desc}</Text>
//             </View>
//             <View style={[styles.radio, selectedPayment === opt.id && styles.radioActive]} />
//           </TouchableOpacity>
//         ))}

//         <View style={styles.secureBox}>
//           <Text style={styles.secureTitle}>Secure Payments</Text>
//           <Text style={styles.secureText}>
//             Your payment is processed securely through the gateway. UPI, card, netbanking, and COD all follow the same order confirmation flow.
//           </Text>
//         </View>
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
//   header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
//   backBtn: { marginBottom: 16 },
//   backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
//   headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
//   headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4 },
//   scroll: { flex: 1, minHeight: 0 },
//   scrollContent: { padding: 16 },
//   sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
//   methodCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 10,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   methodCardActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple + '06' },
//   methodIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
//   methodEmoji: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
//   methodInfo: { flex: 1 },
//   methodName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
//   methodLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
//   radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textMuted },
//   radioActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
//   upiForm: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small, marginBottom: 8 },
//   input: { backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.textPrimary, marginBottom: 12 },
//   verifyBtn: { backgroundColor: COLORS.saffron, borderRadius: 50, paddingVertical: 12, alignItems: 'center' },
//   verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
//   optionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 8,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },
//   optionCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
//   optionEmoji: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
//   optionInfo: { flex: 1 },
//   optionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
//   optionDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
//   secureBox: { marginTop: 16, backgroundColor: COLORS.success + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.success + '30' },
//   secureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success, marginBottom: 8 },
//   secureText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
// });




import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import useAppLanguage from '../../autoTranslation/useAppLanguage';
import { createPaymentOrder, launchRazorpayCheckout, verifyPayment } from '../../utils/paymentFlow';

const SAVED_METHODS = [
  { id: 'm1', type: 'upi', label: 'aarav@oksbi', name: 'SBI UPI', emoji: 'UPI', color: COLORS.purple },
  { id: 'm2', type: 'card', label: '**** **** **** 4242', name: 'HDFC Visa', emoji: 'CARD', color: COLORS.info },
];

const ADD_OPTIONS = [
  { id: 'upi', emoji: 'UPI', label: 'UPI / GPay / PhonePe', desc: 'Pay instantly using any UPI app' },
  { id: 'card', emoji: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', emoji: 'BANK', label: 'Net Banking', desc: 'All major Indian banks' },
  { id: 'cod', emoji: 'CASH', label: 'Cash on Delivery', desc: 'Pay after your order is delivered' },
];

export default function PaymentMethodsScreen({ navigation, route }) {
  const lang = useAppLanguage();
  const { user, placeOrder } = useStore();
  const checkout = route?.params?.checkout || null;
  const isCheckoutFlow = !!checkout;

  const initialPaymentMethod = checkout?.paymentMethod || 'upi';
  const [selectedSavedMethod, setSelectedSavedMethod] = useState(initialPaymentMethod === 'card' ? 'm2' : 'm1');
  const [selectedPayment, setSelectedPayment] = useState(initialPaymentMethod);
  const [addUpi, setAddUpi] = useState(checkout?.upiId || '');
  const [showUpiForm, setShowUpiForm] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!checkout?.paymentMethod) {
      return;
    }

    setSelectedPayment(checkout.paymentMethod);
    setSelectedSavedMethod(checkout.paymentMethod === 'card' ? 'm2' : 'm1');
  }, [checkout?.paymentMethod]);

  const showMessage = (title, message) => {
    if (Platform.OS === 'web') window.alert(message || title);
    else Alert.alert(title, message);
  };

  const finishCheckout = async (paymentMethod = selectedPayment, paymentStatus = 'paid') => {
    if (!checkout?.deliveryAddress) {
      showMessage('Missing Address', 'Delivery address was not provided from checkout.');
      return;
    }

    try {
      await placeOrder(checkout.deliveryAddress, {
        paymentMethod: paymentMethod?.toUpperCase?.() || 'UPI',
        paymentStatus,
      });
      navigation.replace('OrderSuccess');
    } catch (err) {
      showMessage('Order Failed', err.message || 'Could not place your order. Please try again.');
    }
  };

  const runPayment = async (paymentMethod, upiValue = '') => {
    if (!isCheckoutFlow || isProcessing) {
      return;
    }

    if (paymentMethod === 'cod') {
      await finishCheckout('COD', 'pending');
      return;
    }

    if (paymentMethod === 'upi' && upiValue && !upiValue.includes('@')) {
      showMessage('Invalid UPI ID', 'Please enter a valid UPI ID or leave it empty.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = await createPaymentOrder({
        amount: checkout.amount,
        paymentMethod,
        deliveryAddress: checkout.deliveryAddress,
      });

      const paymentOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Nari Samman',
        description: `Payment for order of Rs ${checkout.amount}`,
        order_id: orderData.orderId,
        method: paymentMethod,
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || '',
          contact: user?.phone || user?.mobile || '',
          vpa: paymentMethod === 'upi' ? upiValue : undefined,
        },
        theme: { color: COLORS.saffron },
      };

      const paymentResponse = await launchRazorpayCheckout(paymentOptions);

      await verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      await finishCheckout(paymentMethod, 'paid');
    } catch (error) {
      const message = error?.description || error?.message || 'Payment was cancelled or failed.';
      showMessage('Payment Issue', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSavedMethodPress = (method) => {
    setSelectedSavedMethod(method.id);
    setSelectedPayment(method.type);
    if (method.type === 'upi') {
      setShowUpiForm(true);
    }
  };

  const onPaymentOptionPress = (opt) => {
    setSelectedPayment(opt.id);
    setShowUpiForm(opt.id === 'upi');
  };

  const onUpiAction = async () => {
    if (isCheckoutFlow) {
      await runPayment(selectedPayment || 'upi', addUpi.trim());
      return;
    }

    setAddUpi('');
    setShowUpiForm(false);
  };

  const actionLabel = isCheckoutFlow ? 'Place Order' : 'Verify & Save';

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{"<- Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <Text style={styles.headerSub}>{isCheckoutFlow ? 'Choose a payment mode and place the order' : 'Manage Payment'}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Text style={styles.sectionTitle}>Saved Methods</Text>
        {SAVED_METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => onSavedMethodPress(m)}
            style={[styles.methodCard, selectedSavedMethod === m.id && styles.methodCardActive]}
            activeOpacity={0.85}
          >
            <View style={[styles.methodIconBox, { backgroundColor: m.color + '20' }]}>
              <Text style={styles.methodEmoji}>{m.emoji}</Text>
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{m.name}</Text>
              <Text style={styles.methodLabel}>{m.label}</Text>
            </View>
            <View style={[styles.radio, selectedSavedMethod === m.id && styles.radioActive]} />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Add UPI ID</Text>
        <View style={styles.upiForm}>
          <TextInput
            style={styles.input}
            placeholder="Enter UPI ID (e.g. name@upi)"
            placeholderTextColor={COLORS.textMuted}
            value={addUpi}
            onChangeText={setAddUpi}
          />

          <TouchableOpacity style={styles.verifyBtn} onPress={onUpiAction} activeOpacity={0.9} disabled={isProcessing}>
            <Text style={styles.verifyBtnText}>{actionLabel}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>More Payment Options</Text>
        {ADD_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onPaymentOptionPress(opt)}
            style={[styles.optionCard, selectedPayment === opt.id && styles.optionCardActive]}
            activeOpacity={0.85}
          >
            <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <View style={[styles.radio, selectedPayment === opt.id && styles.radioActive]} />
          </TouchableOpacity>
        ))}

        <View style={styles.secureBox}>
          <Text style={styles.secureTitle}>Secure Payments</Text>
          <Text style={styles.secureText}>
            Your payment is processed securely through the gateway. UPI, card, netbanking, and COD all follow the same order confirmation flow.
          </Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4 },

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

  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  methodCardActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple + '06' },
  methodIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  methodEmoji: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  methodInfo: { flex: 1 },
  methodName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  methodLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textMuted },
  radioActive: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
  upiForm: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, ...SHADOWS.small, marginBottom: 8 },
  input: { backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.textPrimary, marginBottom: 12 },
  verifyBtn: { backgroundColor: COLORS.saffron, borderRadius: 50, paddingVertical: 12, alignItems: 'center' },
  verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  optionCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '08' },
  optionEmoji: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  optionDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  secureBox: { marginTop: 16, backgroundColor: COLORS.success + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.success + '30' },
  secureTitle: { fontSize: 14, fontWeight: '700', color: COLORS.success, marginBottom: 8 },
  secureText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});
