import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';

export default function RazorpayDemoModal({
  visible,
  amount,
  paymentMethod,
  upiId,
  cardPreview,
  bankName,
  isProcessing,
  onClose,
  onSuccess,
}) {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!visible) setOtp('');
  }, [visible]);

  if (!visible) return null;

  const methodLabel =
    paymentMethod === 'upi'
      ? `UPI ${upiId ? `(${upiId})` : ''}`
      : paymentMethod === 'card'
      ? `Card ${cardPreview || ''}`
      : paymentMethod === 'netbanking'
      ? `Net Banking ${bankName ? `(${bankName})` : ''}`
      : 'Payment';

  const canPay = otp.trim().length >= 4;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.modalHeader}>
          <Text style={styles.logoText}>Razorpay</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.title}>Sample Secure Checkout</Text>
          <Text style={styles.subTitle}>This is a demo Razorpay payment form UI.</Text>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <Text style={styles.amountValue}>₹{amount}</Text>
          </View>

          <View style={styles.methodBox}>
            <Text style={styles.methodLabel}>Selected Method</Text>
            <Text style={styles.methodValue}>{methodLabel}</Text>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Enter Demo OTP / PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 1234"
              placeholderTextColor={COLORS.textMuted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={onSuccess}
            disabled={!canPay || isProcessing}
            activeOpacity={0.9}
            style={[styles.payBtn, (!canPay || isProcessing) && styles.payBtnDisabled]}
          >
            <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.payGrad}>
              <Text style={styles.payText}>{isProcessing ? 'Processing...' : `Pay ₹${amount}`}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.safeText}>
            🔒 Real card/UPI details should be handled by Razorpay SDK or Checkout only.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: COLORS.darkCard,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.large,
  },
  modalHeader: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 26,
  },
  body: {
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  amountBox: {
    backgroundColor: COLORS.saffron + '14',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.saffron + '35',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  amountValue: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.saffron,
    marginTop: 4,
  },
  methodBox: {
    backgroundColor: COLORS.darkDeep,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  methodLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  methodValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '800',
    marginTop: 4,
  },
  inputBox: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 12 : 11,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  payBtn: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 16,
  },
  payBtnDisabled: {
    opacity: 0.55,
  },
  payGrad: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  safeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
  },
});
