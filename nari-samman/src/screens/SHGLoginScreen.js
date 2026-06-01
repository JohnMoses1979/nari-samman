import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';
import TextInput from '../autoTranslation/AutoTextInput';
import NariLogoIcon from '../components/NariLogoIcon';


import { loginVendor, registerVendor, sendOtpToPhone, verifyPhoneOtp } from '../services/api';
import { saveVendorToken, saveVendorId } from '../storage/authStorage';
import AppAlert, { useAppAlert } from '../components/AppAlert';

const { width } = Dimensions.get('window');
const DUMMY_OTP = '123456';

const SHG_CATEGORIES = ['Food & Agriculture', 'Textiles & Weaving', 'Crafts & Handicrafts', 'Herbal & Wellness', 'Other'];

function cleanMobile(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function Field({
  label,
  placeholder,
  keyboardType,
  secure,
  show,
  onToggle,
  icon,
  value,
  onChangeText,
  error,
  maxLength,
  rightElement,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(200,208,228,0.35)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
          maxLength={maxLength}
          secureTextEntry={secure && !show}
        />
        {rightElement}
        {secure && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{show ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function SHGLoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    leaderName: '',
    shgName: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    members: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const loginVendorByEmail = useStore((s) => s.loginVendorByEmail);
  const startSHGRegistration = useStore((s) => s.startSHGRegistration);
  const updateVendorProfile = useStore((s) => s.updateVendorProfile);
  const [loginMessage, setLoginMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { alertState, showAlert, hideAlert } = useAppAlert();

  const resetOtp = () => {
    setOtpSent(false);
    setOtpInput('');
    setPhoneVerified(false);
    setOtpMessage('');
  };

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null, general: null }));
    setLoginMessage('');
  };

  const setPhone = (value) => {
    const mobile = cleanMobile(value);
    setForm((f) => ({ ...f, phone: mobile }));
    setErrors((e) => ({ ...e, phone: null, otp: null }));
    resetOtp();
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setCatOpen(false);
    setForm({ leaderName: '', shgName: '', email: '', phone: '', location: '', category: '', members: '', password: '', confirm: '' });
    resetOtp();
  };

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setErrors((e) => ({ ...e, phone: 'Enter exactly 10 digit mobile number' }));
      return;
    }
    setOtpLoading(true);
    try {
      await sendOtpToPhone(form.phone);
      setOtpSent(true);
      setPhoneVerified(false);
      setOtpInput('');
      setErrors((e) => ({ ...e, phone: null, otp: null }));
      setOtpMessage(`OTP sent to +91 ${form.phone}`);
    } catch (err) {
      setErrors((e) => ({ ...e, phone: err.message || 'Failed to send OTP. Please try again.' }));
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpInput || otpInput.length < 4) {
      setErrors((e) => ({ ...e, otp: 'Enter the OTP sent to your number' }));
      return;
    }
    setOtpLoading(true);
    try {
      await verifyPhoneOtp(form.phone, otpInput);
      setPhoneVerified(true);
      setErrors((e) => ({ ...e, otp: null, phone: null }));
      setOtpMessage('Mobile number verified successfully ✓');
    } catch (err) {
      setPhoneVerified(false);
      setErrors((e) => ({ ...e, otp: err.message || 'Invalid OTP. Please try again.' }));
    } finally {
      setOtpLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (mode === 'register') {
      if (!form.leaderName.trim()) e.leaderName = 'Leader name is required';
      if (!form.shgName.trim()) e.shgName = 'SHG name is required';
      if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter exactly 10 digit mobile number';
      if (!phoneVerified) e.otp = 'Please verify mobile number with OTP';
      if (!form.location.trim()) e.location = 'Location is required';
      if (!form.category) e.category = 'Select a category';
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let result;

      if (mode === 'login') {
        result = await loginVendor({ email: form.email, password: form.password });
      } else {
        result = await registerVendor({
          leaderName: form.leaderName,
          shgName: form.shgName,
          email: form.email,
          mobileNumber: form.phone,
          password: form.password,
          village: form.location || '',
          district: '',
          state: 'West Bengal',
          category: form.category,
          members: form.members,
        });
      }

      // Persist vendor auth (separate from consumer keys)
      await saveVendorToken(result.token);
      await saveVendorId(result.vendorId);

      // Sync into Zustand so VendorProfileScreen renders immediately
      if (result.profile) {
        const p = result.profile;
        updateVendorProfile({
          id: p.id,
          name: p.leaderName,
          shgName: p.shgName,
          email: p.email,
          phone: p.mobileNumber,
          location: p.village || '',
          category: p.category || '',
          members: p.members || '',
          approvalStatus: p.approvalStatus,
        });
      }

      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'VendorStack' }] }));

    } catch (err) {
      showAlert('error',
        mode === 'login' ? 'Login Failed' : 'Registration Failed',
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const otpButton = phoneVerified ? (
    <View style={styles.verifiedBadge}>
      <Text style={styles.verifiedText}>✓ Verified</Text>
    </View>
  ) : (
    <TouchableOpacity onPress={sendOtp} style={styles.otpSmallBtn} disabled={otpLoading}>
      {otpLoading
        ? <ActivityIndicator size="small" color="#fff" />
        : <Text style={styles.otpSmallBtnText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
      }
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0F1822', '#1A2635', '#0F1822']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <LinearGradient colors={['#2A7A4A', '#3A9A5A']} style={styles.iconCircle}>
              <Text style={styles.headerIcon}>🧵</Text>
            </LinearGradient>
            <View style={styles.brandNameRow}>
              <NariLogoIcon size={34} />
              <Text style={{ ...styles.appName, marginBottom: 0 }}>Nari Samman – SHG Portal</Text>
            </View>
            <Text style={styles.title}>{mode === 'login' ? 'Artisan Login' : 'Join as SHG / Artisan'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'login' ? 'Access your SHG dashboard and manage orders' : 'Register your SHG and start selling directly'}
            </Text>
          </View>

          <View style={styles.tabContainer}>
            {['login', 'register'].map((m) => (
              <TouchableOpacity key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => switchMode(m)}>
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                  {m === 'login' ? 'Sign In' : 'Register SHG'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            {mode === 'register' && (
              <>
                <Field
                  label="Leader / Contact Name"
                  placeholder="Your full name"
                  icon="👤"
                  value={form.leaderName}
                  onChangeText={(v) => setField('leaderName', v)}
                  error={errors.leaderName}
                />
                <Field
                  label="SHG / Group Name"
                  placeholder="e.g. Tant Weavers Collective"
                  icon="🏘️"
                  value={form.shgName}
                  onChangeText={(v) => setField('shgName', v)}
                  error={errors.shgName}
                />
              </>
            )}

            <Field
              label="Email Address"
              placeholder="shg@example.com"
              keyboardType="email-address"
              icon="✉️"
              value={form.email}
              onChangeText={(v) => setField('email', v)}
              error={errors.email}
            />

            {mode === 'register' && (
              <>
                <Field
                  label="Mobile Number"
                  placeholder="Enter 10 digit mobile number"
                  keyboardType="number-pad"
                  icon="📱"
                  value={form.phone}
                  onChangeText={setPhone}
                  maxLength={10}
                  error={errors.phone}
                  rightElement={otpButton}
                />

                {otpSent && !phoneVerified && (
                  <View style={styles.otpBox}>
                    <Text style={styles.otpHint}>{otpMessage}</Text>
                    <View style={styles.otpVerifyRow}>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="Enter OTP"
                        placeholderTextColor="rgba(200,208,228,0.35)"
                        value={otpInput}
                        onChangeText={(value) => {
                          setOtpInput(String(value || '').replace(/\D/g, '').slice(0, 6));
                          setErrors((e) => ({ ...e, otp: null }));
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                      <TouchableOpacity onPress={verifyOtp} style={styles.verifyBtn} disabled={otpLoading}>
                        {otpLoading
                          ? <ActivityIndicator size="small" color="#fff" />
                          : <Text style={styles.verifyBtnText}>Verify</Text>
                        }
                      </TouchableOpacity>
                    </View>
                    {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                  </View>
                )}

                {phoneVerified && <Text style={styles.successText}>{otpMessage}</Text>}
                {!otpSent && errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}

                <Field
                  label="Location / District"
                  placeholder="e.g. Nadia, West Bengal"
                  icon="📍"
                  value={form.location}
                  onChangeText={(v) => setField('location', v)}
                  error={errors.location}
                />
                <Field
                  label="Members Count"
                  placeholder="Number of members"
                  keyboardType="numeric"
                  icon="👥"
                  value={form.members}
                  onChangeText={(v) => setField('members', String(v || '').replace(/\D/g, '').slice(0, 4))}
                  error={errors.members}
                />

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Product Category</Text>
                  <TouchableOpacity
                    style={[styles.inputRow, styles.selectorRow, errors.category && styles.inputError]}
                    onPress={() => setCatOpen((v) => !v)}
                  >
                    <Text style={styles.inputIcon}>🏷️</Text>
                    <Text style={[styles.input, !form.category && { color: 'rgba(200,208,228,0.35)' }]}>
                      {form.category || 'Select a category'}
                    </Text>
                    <Text style={styles.chevron}>{catOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {catOpen && (
                    <View style={styles.dropdown}>
                      {SHG_CATEGORIES.map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[styles.dropdownItem, form.category === c && styles.dropdownItemActive]}
                          onPress={() => {
                            setField('category', c);
                            setCatOpen(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, form.category === c && styles.dropdownItemTextActive]}>{c}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
                </View>
              </>
            )}

            <Field
              label="Password"
              placeholder="Min. 8 characters"
              icon="🔒"
              secure
              show={showPass}
              onToggle={() => setShowPass((v) => !v)}
              value={form.password}
              onChangeText={(v) => setField('password', v)}
              error={errors.password}
            />

            {mode === 'register' && (
              <Field
                label="Confirm Password"
                placeholder="Re-enter password"
                icon="🔑"
                secure
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                value={form.confirm}
                onChangeText={(v) => setField('confirm', v)}
                error={errors.confirm}
              />
            )}

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword', { role: 'vendor' })}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
            {loginMessage ? <Text style={styles.loginInfoText}>{loginMessage}</Text> : null}

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              <LinearGradient
                colors={['#1A4A2A', '#2A7A4A', '#3A9A5A']}
                style={styles.submitBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'login' ? 'Sign In  →' : 'Register SHG  →'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {mode === 'register' && (
            <View style={styles.kycInfo}>
              <Text style={styles.kycTitle}>📋 What happens next?</Text>
              {[
                '✅ After signup you will enter vendor dashboard',
                '🛍️ Add your first product details',
                '📄 Complete KYC documents and bank details',
                '⏳ Then submit and wait for admin approval',
              ].map((s, i) => (
                <Text key={i} style={styles.kycStep}>{s}</Text>
              ))}
            </View>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{mode === 'login' ? 'New SHG? ' : 'Already registered? '}</Text>
            <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              <Text style={styles.switchLink}>{mode === 'login' ? 'Register here' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>IS&SF Initiative · Empowering Rural West Bengal</Text>
        </ScrollView>
        <AppAlert
          visible={alertState.visible}
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={hideAlert}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 90 },
  backBtn: { marginTop: 52, marginBottom: 8 },
  backText: { color: '#3A9A5A', fontSize: 15, fontWeight: '600' },
  header: { alignItems: 'center', paddingVertical: 20 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  headerIcon: { fontSize: 34 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  appName: { fontSize: 11, color: '#3A9A5A', fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.55)', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(200,208,228,0.07)', borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  tabActive: { backgroundColor: '#2A7A4A' },
  tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.5)' },
  tabTextActive: { color: '#FFFFFF' },
  card: { backgroundColor: 'rgba(19,29,41,0.95)', borderRadius: 22, padding: 24, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: 'rgba(200,208,228,0.6)', marginBottom: 7, letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', paddingHorizontal: 14, minHeight: 52 },
  selectorRow: { paddingVertical: 0 },
  inputError: { borderColor: COLORS.error },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, height: 52 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },
  chevron: { fontSize: 12, color: 'rgba(200,208,228,0.4)' },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },
  successText: { fontSize: 12, color: COLORS.success, marginTop: -8, marginBottom: 12, fontWeight: '700' },
  loginInfoText: { fontSize: 12, color: COLORS.warning, backgroundColor: 'rgba(255,193,7,0.12)', borderRadius: 10, padding: 10, marginBottom: 12, lineHeight: 18, fontWeight: '700' },
  otpSmallBtn: { backgroundColor: '#3A9A5A', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  otpSmallBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  verifiedBadge: { backgroundColor: 'rgba(40,167,69,0.18)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  verifiedText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  otpBox: { marginTop: -8, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 13, padding: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
  otpHint: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginBottom: 10, lineHeight: 18 },
  otpVerifyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  otpInput: { flex: 1, height: 46, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.textPrimary, paddingHorizontal: 14, fontSize: 15, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)' },
  verifyBtn: { height: 46, borderRadius: 12, backgroundColor: '#3A9A5A', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  verifyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  dropdown: { backgroundColor: '#131D29', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.15)', marginTop: 4, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 13, paddingHorizontal: 16 },
  dropdownItemActive: { backgroundColor: 'rgba(42,122,74,0.3)' },
  dropdownItemText: { fontSize: 14, color: 'rgba(200,208,228,0.7)' },
  dropdownItemTextActive: { color: '#3A9A5A', fontWeight: '700' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: '#3A9A5A', fontWeight: '600' },
  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
  submitText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  kycInfo: { backgroundColor: 'rgba(42,122,74,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(42,122,74,0.25)', padding: 18, marginBottom: 20, gap: 10 },
  kycTitle: { fontSize: 14, fontWeight: '700', color: '#3A9A5A', marginBottom: 6 },
  kycStep: { fontSize: 13, color: 'rgba(200,208,228,0.75)', lineHeight: 20 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' },
  switchLabel: { fontSize: 14, color: 'rgba(200,208,228,0.55)' },
  switchLink: { fontSize: 14, color: '#3A9A5A', fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' },
});
