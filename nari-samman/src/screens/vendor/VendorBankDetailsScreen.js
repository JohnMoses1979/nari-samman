import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'none', error }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function VendorBankDetailsScreen({ navigation }) {
  const vendorProfile = useStore((s) => s.vendorProfile);
  const updateVendorProfile = useStore((s) => s.updateVendorProfile);
  const markVendorOnboardingStep = useStore((s) => s.markVendorOnboardingStep);

  const [form, setForm] = useState({
    accountHolder: vendorProfile.accountHolder || vendorProfile.name || '',
    accountNumber: vendorProfile.accountNumber || '',
    confirmAccountNumber: vendorProfile.accountNumber || '',
    bankName: vendorProfile.bankName || '',
    ifsc: vendorProfile.ifsc || '',
    branch: vendorProfile.branch || '',
    upi: vendorProfile.upi || '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const isComplete = useMemo(() => (
    Boolean(form.accountHolder.trim()) &&
    Boolean(form.accountNumber.trim()) &&
    form.accountNumber === form.confirmAccountNumber &&
    Boolean(form.bankName.trim()) &&
    Boolean(form.ifsc.trim())
  ), [form]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: key === 'ifsc' ? value.toUpperCase() : value }));
    setErrors((prev) => ({ ...prev, [key]: null, general: null }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.accountHolder.trim()) e.accountHolder = 'Account holder name is required';
    if (!form.accountNumber.trim()) e.accountNumber = 'Account number is required';
    if (form.accountNumber && form.accountNumber.length < 6) e.accountNumber = 'Enter valid account number';
    if (form.confirmAccountNumber !== form.accountNumber) e.confirmAccountNumber = 'Account numbers do not match';
    if (!form.bankName.trim()) e.bankName = 'Bank name is required';
    if (!form.ifsc.trim()) e.ifsc = 'IFSC code is required';
    if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim())) e.ifsc = 'Enter valid IFSC, e.g. SBIN0001234';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveBankDetails = () => {
    if (!validate()) return;
    updateVendorProfile({
      accountHolder: form.accountHolder.trim(),
      accountNumber: form.accountNumber.trim(),
      bankName: form.bankName.trim(),
      ifsc: form.ifsc.trim(),
      branch: form.branch.trim(),
      upi: form.upi.trim(),
      bankLinked: true,
      bankStatus: 'submitted',
    });
    markVendorOnboardingStep('bankSubmitted');
    setSaved(true);
    if (Platform.OS === 'web') {
      setTimeout(() => navigation.navigate('VendorTabs', { screen: 'VendorDashboard' }), 500);
    } else {
      Alert.alert('Bank Details Saved', 'Bank details are saved to your vendor profile.', [
        { text: 'OK', onPress: () => navigation.navigate('VendorTabs', { screen: 'VendorDashboard' }) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientHero} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
        <Text style={styles.headerSub}>Add payout account details separately. These details will be saved into your vendor profile.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Secure payout setup</Text>
            <Text style={styles.infoText}>Admin will verify this account before payouts are enabled. Keep the account holder name same as your SHG/vendor name.</Text>
          </View>
        </View>

        {errors.general ? <Text style={styles.errorBanner}>⚠️ {errors.general}</Text> : null}
        {saved ? <Text style={styles.successBanner}>✅ Bank details saved to profile</Text> : null}

        <View style={styles.card}>
          <Field
            label="Account Holder Name *"
            value={form.accountHolder}
            onChangeText={(v) => update('accountHolder', v)}
            placeholder="Enter account holder name"
            autoCapitalize="words"
            error={errors.accountHolder}
          />
          <Field
            label="Account Number *"
            value={form.accountNumber}
            onChangeText={(v) => update('accountNumber', v.replace(/\D/g, ''))}
            placeholder="Enter account number"
            keyboardType="numeric"
            error={errors.accountNumber}
          />
          <Field
            label="Confirm Account Number *"
            value={form.confirmAccountNumber}
            onChangeText={(v) => update('confirmAccountNumber', v.replace(/\D/g, ''))}
            placeholder="Re-enter account number"
            keyboardType="numeric"
            error={errors.confirmAccountNumber}
          />
          <Field
            label="Bank Name *"
            value={form.bankName}
            onChangeText={(v) => update('bankName', v)}
            placeholder="e.g. State Bank of India"
            autoCapitalize="words"
            error={errors.bankName}
          />
          <Field
            label="IFSC Code *"
            value={form.ifsc}
            onChangeText={(v) => update('ifsc', v)}
            placeholder="e.g. SBIN0001234"
            error={errors.ifsc}
          />
          <Field
            label="Branch Name"
            value={form.branch}
            onChangeText={(v) => update('branch', v)}
            placeholder="Enter branch name"
            autoCapitalize="words"
          />
          <Field
            label="UPI ID (optional)"
            value={form.upi}
            onChangeText={(v) => update('upi', v)}
            placeholder="yourname@upi"
          />
        </View>

        <TouchableOpacity onPress={saveBankDetails} activeOpacity={0.86} style={[styles.submitBtn, !isComplete && styles.submitBtnMuted]}>
          <LinearGradient colors={isComplete ? [COLORS.green, COLORS.greenLight] : [COLORS.darkBorder, COLORS.darkBorder]} style={styles.submitGrad}>
            <Text style={[styles.submitText, !isComplete && styles.submitTextMuted]}>Save Bank Details →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 22 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 15 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900' },
  headerSub: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
  scroll: { padding: 16 },
  infoCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, backgroundColor: COLORS.info + '14', borderWidth: 1, borderColor: COLORS.info + '35', marginBottom: 14 },
  infoIcon: { fontSize: 28 },
  infoTitle: { color: COLORS.info, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  infoText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  errorBanner: { color: COLORS.error, backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 12, marginBottom: 12, fontWeight: '700' },
  successBanner: { color: COLORS.success, backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 12, fontWeight: '800' },
  card: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, ...SHADOWS.small },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: COLORS.dark, color: COLORS.textPrimary, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, fontSize: 11, marginTop: 5, fontWeight: '600' },
  submitBtn: { marginTop: 18, borderRadius: 16, overflow: 'hidden', ...SHADOWS.medium },
  submitBtnMuted: { opacity: 0.9 },
  submitGrad: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  submitTextMuted: { color: COLORS.textMuted },
});
