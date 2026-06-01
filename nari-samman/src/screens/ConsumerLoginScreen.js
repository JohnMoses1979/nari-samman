// import React, { useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { CommonActions } from '@react-navigation/native';
// import { COLORS } from '../theme/colors';
// import useStore from '../store/useStore';
// import Text from '../autoTranslation/AutoText';
// import TextInput from '../autoTranslation/AutoTextInput';
// import NariLogoIcon from '../components/NariLogoIcon';

// const { width } = Dimensions.get('window');
// const DUMMY_OTP = '123456';

// function cleanMobile(value) {
//   return String(value || '').replace(/\D/g, '').slice(0, 10);
// }

// function Field({
//   label,
//   placeholder,
//   keyboardType,
//   secure,
//   show,
//   onToggle,
//   icon,
//   value,
//   onChangeText,
//   error,
//   maxLength,
//   rightElement,
// }) {
//   return (
//     <View style={styles.fieldGroup}>
//       <Text style={styles.label}>{label}</Text>
//       <View style={[styles.inputRow, error && styles.inputError]}>
//         <Text style={styles.inputIcon}>{icon}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder={placeholder}
//           placeholderTextColor="rgba(200,208,228,0.35)"
//           value={value}
//           onChangeText={onChangeText}
//           keyboardType={keyboardType || 'default'}
//           autoCapitalize="none"
//           maxLength={maxLength}
//           secureTextEntry={secure && !show}
//         />
//         {rightElement}
//         {secure && (
//           <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
//             <Text style={styles.eyeIcon}>{show ? '🙈' : '👁️'}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//     </View>
//   );
// }

// export default function ConsumerLoginScreen({ navigation }) {
//   const [mode, setMode] = useState('login');
//   const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
//   const [errors, setErrors] = useState({});
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpInput, setOtpInput] = useState('');
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [otpMessage, setOtpMessage] = useState('');
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   const loginUser = useStore((s) => s.loginUser);
//   const registerUser = useStore((s) => s.registerUser);

//   const resetOtp = () => {
//     setOtpSent(false);
//     setOtpInput('');
//     setPhoneVerified(false);
//     setOtpMessage('');
//   };

//   const setField = (field, value) => {
//     setForm((f) => ({ ...f, [field]: value }));
//     setErrors((e) => ({ ...e, [field]: null }));
//   };

//   const setPhone = (value) => {
//     const mobile = cleanMobile(value);
//     setForm((f) => ({ ...f, phone: mobile }));
//     setErrors((e) => ({ ...e, phone: null, otp: null }));
//     resetOtp();
//   };

//   const switchMode = (next) => {
//     Animated.spring(slideAnim, { toValue: next === 'login' ? 0 : 1, useNativeDriver: false }).start();
//     setMode(next);
//     setErrors({});
//     setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
//     resetOtp();
//   };

//   const sendOtp = () => {
//     if (!/^\d{10}$/.test(form.phone)) {
//       setErrors((e) => ({ ...e, phone: 'Enter exactly 10 digit mobile number' }));
//       return;
//     }
//     setOtpSent(true);
//     setPhoneVerified(false);
//     setOtpInput('');
//     setErrors((e) => ({ ...e, phone: null, otp: null }));
//     setOtpMessage(`Dummy OTP sent to +91 ${form.phone}. Use ${DUMMY_OTP}`);
//   };

//   const verifyOtp = () => {
//     if (otpInput === DUMMY_OTP) {
//       setPhoneVerified(true);
//       setErrors((e) => ({ ...e, otp: null, phone: null }));
//       setOtpMessage('Mobile number verified successfully');
//       return;
//     }
//     setPhoneVerified(false);
//     setErrors((e) => ({ ...e, otp: 'Invalid OTP. Use 123456 for demo verification' }));
//   };

//   const validate = () => {
//     const e = {};
//     if (mode === 'register' && !form.name.trim()) e.name = 'Full Name is required';
//     if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
//     if (mode === 'register' && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter exactly 10 digit mobile number';
//     if (mode === 'register' && !phoneVerified) e.otp = 'Please verify mobile number with OTP';
//     if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
//     if (mode === 'register' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = () => {
//     if (!validate()) return;
//     if (mode === 'login') {
//       loginUser('consumer', { email: form.email });
//     } else {
//       registerUser('consumer', { name: form.name, email: form.email, phone: form.phone, mobileVerified: true });
//     }
//     navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'ConsumerTabs' }] }));
//   };

//   const otpButton = phoneVerified ? (
//     <View style={styles.verifiedBadge}>
//       <Text style={styles.verifiedText}>✓ Verified</Text>
//     </View>
//   ) : (
//     <TouchableOpacity onPress={sendOtp} style={styles.otpSmallBtn}>
//       <Text style={styles.otpSmallBtnText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <LinearGradient colors={['#0F1822', '#1C2437', '#0F1822']} style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView
//           contentContainerStyle={styles.scroll}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="always"
//           keyboardDismissMode="none"
//         >
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.iconCircle}>
//               <Text style={styles.headerIcon}>🛍️</Text>
//             </LinearGradient>
//             <View style={styles.brandNameRow}>
//               <NariLogoIcon size={35} />
//               <Text style={{...styles.appName, marginBottom: 0}}>Nari Samman</Text>
//             </View>
//             <Text style={styles.title}>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</Text>
//             <Text style={styles.subtitle}>
//               {mode === 'login' ? 'Sign in to explore authentic rural products' : 'Join thousands discovering rural artisans'}
//             </Text>
//           </View>

//           <View style={styles.tabContainer}>
//             <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => switchMode('login')}>
//               <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => switchMode('register')}>
//               <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Register</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.card}>
//             {mode === 'register' && (
//               <Field
//                 label="Full Name"
//                 placeholder="Enter your full name"
//                 icon="👤"
//                 value={form.name}
//                 onChangeText={(v) => setField('name', v)}
//                 error={errors.name}
//               />
//             )}

//             <Field
//               label="Email Address"
//               placeholder="you@example.com"
//               keyboardType="email-address"
//               icon="✉️"
//               value={form.email}
//               onChangeText={(v) => setField('email', v)}
//               error={errors.email}
//             />

//             {mode === 'register' && (
//               <>
//                 <Field
//                   label="Mobile Number"
//                   placeholder="Enter 10 digit mobile number"
//                   keyboardType="number-pad"
//                   icon="📱"
//                   value={form.phone}
//                   onChangeText={setPhone}
//                   maxLength={10}
//                   error={errors.phone}
//                   rightElement={otpButton}
//                 />

//                 {otpSent && !phoneVerified && (
//                   <View style={styles.otpBox}>
//                     <Text style={styles.otpHint}>{otpMessage}</Text>
//                     <View style={styles.otpVerifyRow}>
//                       <TextInput
//                         style={styles.otpInput}
//                         placeholder="Enter OTP"
//                         placeholderTextColor="rgba(200,208,228,0.35)"
//                         value={otpInput}
//                         onChangeText={(value) => {
//                           setOtpInput(String(value || '').replace(/\D/g, '').slice(0, 6));
//                           setErrors((e) => ({ ...e, otp: null }));
//                         }}
//                         keyboardType="number-pad"
//                         maxLength={6}
//                       />
//                       <TouchableOpacity onPress={verifyOtp} style={styles.verifyBtn}>
//                         <Text style={styles.verifyBtnText}>Verify</Text>
//                       </TouchableOpacity>
//                     </View>
//                     {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
//                   </View>
//                 )}

//                 {phoneVerified && <Text style={styles.successText}>{otpMessage}</Text>}
//                 {!otpSent && errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
//               </>
//             )}

//             <Field
//               label="Password"
//               placeholder="Min. 6 characters"
//               icon="🔒"
//               secure
//               show={showPass}
//               onToggle={() => setShowPass((v) => !v)}
//               value={form.password}
//               onChangeText={(v) => setField('password', v)}
//               error={errors.password}
//             />

//             {mode === 'register' && (
//               <Field
//                 label="Confirm Password"
//                 placeholder="Re-enter password"
//                 icon="🔑"
//                 secure
//                 show={showConfirm}
//                 onToggle={() => setShowConfirm((v) => !v)}
//                 value={form.confirm}
//                 onChangeText={(v) => setField('confirm', v)}
//                 error={errors.confirm}
//               />
//             )}

//             {mode === 'login' && (
//               <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword', { role: 'consumer' })}>
//                 <Text style={styles.forgotText}>Forgot Password?</Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
//               <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//                 <Text style={styles.submitText}>{mode === 'login' ? 'Sign In  →' : 'Create Account  →'}</Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             <View style={styles.dividerRow}>
//               <View style={styles.dividerLine} />
//               <Text style={styles.dividerText}>or continue with</Text>
//               <View style={styles.dividerLine} />
//             </View>

//             <TouchableOpacity style={styles.socialBtn}>
//               <Text style={styles.socialIcon}>🔍</Text>
//               <Text style={styles.socialText}>Continue with Google</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.switchRow}>
//             <Text style={styles.switchLabel}>{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}</Text>
//             <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
//               <Text style={styles.switchLink}>{mode === 'login' ? 'Register' : 'Sign In'}</Text>
//             </TouchableOpacity>
//           </View>

//           {mode === 'register' && (
//             <View style={styles.benefits}>
//               {['🎁 First order 10% off', '🚚 Free delivery above ₹499', 'Support rural artisans'].map((b, i) => (
//                 <View key={i} style={styles.benefitRow}>
//                   <Text style={styles.benefitText}>{b}</Text>
//                 </View>
//               ))}
//             </View>
//           )}

//           <Text style={styles.footer}>IS&SF Initiative · Empowering Rural West Bengal</Text>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 90 },
//   backBtn: { marginTop: 52, marginBottom: 8 },
//   backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
//   header: { alignItems: 'center', paddingVertical: 20 },
//   iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
//   headerIcon: { fontSize: 34 },
//   brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
//   appName: { fontSize: 12, color: COLORS.primary, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
//   title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
//   subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.55)', textAlign: 'center', marginTop: 6, lineHeight: 20 },
//   tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(200,208,228,0.07)', borderRadius: 14, padding: 4, marginBottom: 20 },
//   tab: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
//   tabActive: { backgroundColor: COLORS.primary },
//   tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.5)' },
//   tabTextActive: { color: '#0F1822' },
//   card: { backgroundColor: 'rgba(19,29,41,0.95)', borderRadius: 22, padding: 24, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)', marginBottom: 20 },
//   fieldGroup: { marginBottom: 16 },
//   label: { fontSize: 12, fontWeight: '600', color: 'rgba(200,208,228,0.6)', marginBottom: 7, letterSpacing: 0.5 },
//   inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', paddingHorizontal: 14, minHeight: 52 },
//   inputError: { borderColor: COLORS.error },
//   inputIcon: { fontSize: 16, marginRight: 10 },
//   input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, height: 52 },
//   eyeBtn: { paddingLeft: 8 },
//   eyeIcon: { fontSize: 18 },
//   errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },
//   successText: { fontSize: 12, color: COLORS.success, marginTop: -8, marginBottom: 12, fontWeight: '700' },
//   otpSmallBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
//   otpSmallBtnText: { color: '#0F1822', fontSize: 11, fontWeight: '800' },
//   verifiedBadge: { backgroundColor: 'rgba(40,167,69,0.18)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
//   verifiedText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
//   otpBox: { marginTop: -8, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 13, padding: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
//   otpHint: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginBottom: 10, lineHeight: 18 },
//   otpVerifyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   otpInput: { flex: 1, height: 46, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.textPrimary, paddingHorizontal: 14, fontSize: 15, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)' },
//   verifyBtn: { height: 46, borderRadius: 12, backgroundColor: COLORS.primary, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
//   verifyBtnText: { color: '#0F1822', fontSize: 13, fontWeight: '800' },
//   forgotBtn: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
//   forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
//   submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
//   submitText: { fontSize: 16, fontWeight: '800', color: '#0F1822', letterSpacing: 0.3 },
//   dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(200,208,228,0.1)' },
//   dividerText: { fontSize: 12, color: 'rgba(200,208,228,0.35)', marginHorizontal: 12 },
//   socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)', backgroundColor: 'rgba(255,255,255,0.03)' },
//   socialIcon: { fontSize: 18, marginRight: 10 },
//   socialText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
//   switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' },
//   switchLabel: { fontSize: 14, color: 'rgba(200,208,228,0.55)' },
//   switchLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
//   benefits: { flexDirection: width > 360 ? 'row' : 'column', gap: 10, marginBottom: 24 },
//   benefitRow: { flex: 1, backgroundColor: 'rgba(215,169,75,0.1)', borderRadius: 12, padding: 12, alignItems: 'center' },
//   benefitText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', textAlign: 'center' },
//   footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' },
// });




























// ─── screens/ConsumerLoginScreen.js ──────────────────────────────────────────
//
// Changes from original:
//   - handleSubmit now calls real backend via loginConsumer / registerConsumer
//   - JWT token and consumerId are persisted in AsyncStorage on success
//   - Zustand loginUser still called so rest of app (vendor/admin) is untouched
//   - All UI, styles, and navigation are identical to the original
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';
import TextInput from '../autoTranslation/AutoTextInput';
import NariLogoIcon from '../components/NariLogoIcon';

// ── Real API + storage ────────────────────────────────────────────────────────
import { loginConsumer, registerConsumer, sendOtpToPhone, verifyPhoneOtp } from '../services/api';
import { saveToken, saveConsumerId } from '../storage/authStorage';

const { width } = Dimensions.get('window');
const DUMMY_OTP = '123456';

function cleanMobile(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function Field({
  label, placeholder, keyboardType, secure, show, onToggle,
  icon, value, onChangeText, error, maxLength, rightElement,
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

export default function ConsumerLoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [otpLoading, setOtpLoading] = useState(false);

  // Keep calling loginUser so Zustand role/isLoggedIn stays consistent
  // for vendor/admin flows that still rely on the store.
  const loginUser = useStore((s) => s.loginUser);
  const updateUserProfile = useStore((s) => s.updateUserProfile);

  const resetOtp = () => {
    setOtpSent(false);
    setOtpInput('');
    setPhoneVerified(false);
    setOtpMessage('');
  };

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const setPhone = (value) => {
    const mobile = cleanMobile(value);
    setForm((f) => ({ ...f, phone: mobile }));
    setErrors((e) => ({ ...e, phone: null, otp: null }));
    resetOtp();
  };

  const switchMode = (next) => {
    Animated.spring(slideAnim, { toValue: next === 'login' ? 0 : 1, useNativeDriver: false }).start();
    setMode(next);
    setErrors({});
    setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
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
      setErrors((e) => ({
        ...e,
        phone: err.message || 'Failed to send OTP. Please try again.',
      }));
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
      setErrors((e) => ({
        ...e,
        otp: err.message || 'Invalid OTP. Please try again.',
      }));
    } finally {
      setOtpLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Full Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (mode === 'register' && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter exactly 10 digit mobile number';
    if (mode === 'register' && !phoneVerified) e.otp = 'Please verify mobile number with OTP';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Main submit — calls real backend ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let result;

      if (mode === 'login') {
        result = await loginConsumer({ email: form.email, password: form.password });
      } else {
        result = await registerConsumer({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }

      // Persist auth data locally
      await saveToken(result.token);
      await saveConsumerId(result.consumerId);

      // Sync real profile into Zustand so ProfileScreen renders correct data immediately
      if (result.profile) {
        updateUserProfile({
          id: result.profile.id,
          name: result.profile.fullName,
          email: result.profile.email,
          phone: result.profile.phone,
        });
      }

      // Mark consumer role as logged-in in Zustand (keeps vendor/admin flow intact)
      loginUser('consumer', { email: result.profile?.email || form.email });

      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'ConsumerTabs' }] }));

    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const otpButton = phoneVerified ? (
    <View style={styles.verifiedBadge}>
      <Text style={styles.verifiedText}>✓ Verified</Text>
    </View>
  ) : (
    <TouchableOpacity
      onPress={sendOtp}
      style={styles.otpSmallBtn}
      disabled={otpLoading}
    >
      {otpLoading
        ? <ActivityIndicator size="small" color="#0F1822" />
        : <Text style={styles.otpSmallBtnText}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
      }
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0F1822', '#1C2437', '#0F1822']} style={styles.container}>
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
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.iconCircle}>
              <Text style={styles.headerIcon}>🛍️</Text>
            </LinearGradient>
            <View style={styles.brandNameRow}>
              <NariLogoIcon size={35} />
              <Text style={{ ...styles.appName, marginBottom: 0 }}>Nari Samman</Text>
            </View>
            <Text style={styles.title}>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in to explore authentic rural products'
                : 'Join thousands discovering rural artisans'}
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => switchMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {mode === 'register' && (
              <Field
                label="Full Name"
                placeholder="Enter your full name"
                icon="👤"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                error={errors.name}
              />
            )}

            <Field
              label="Email Address"
              placeholder="you@example.com"
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
                      <TouchableOpacity
                        onPress={verifyOtp}
                        style={styles.verifyBtn}
                        disabled={otpLoading}
                      >
                        {otpLoading
                          ? <ActivityIndicator size="small" color="#0F1822" />
                          : <Text style={styles.verifyBtnText}>Verify</Text>
                        }
                      </TouchableOpacity>
                    </View>
                    {errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
                  </View>
                )}

                {phoneVerified && <Text style={styles.successText}>{otpMessage}</Text>}
                {!otpSent && errors.otp ? <Text style={styles.errorText}>{errors.otp}</Text> : null}
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
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate('ForgotPassword', { role: 'consumer' })}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} disabled={loading}>
              <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
                style={styles.submitBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#0F1822" />
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'login' ? 'Sign In  →' : 'Create Account  →'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialIcon}>🔍</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              <Text style={styles.switchLink}>{mode === 'login' ? 'Register' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>

          {mode === 'register' && (
            <View style={styles.benefits}>
              {['🎁 First order 10% off', '🚚 Free delivery above ₹499', 'Support rural artisans'].map((b, i) => (
                <View key={i} style={styles.benefitRow}>
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.footer}>IS&SF Initiative · Empowering Rural West Bengal</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ─── Styles (identical to original) ──────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 90 },
  backBtn: { marginTop: 52, marginBottom: 8 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  header: { alignItems: 'center', paddingVertical: 20 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  headerIcon: { fontSize: 34 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  appName: { fontSize: 12, color: COLORS.primary, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.55)', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(200,208,228,0.07)', borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.5)' },
  tabTextActive: { color: '#0F1822' },
  card: { backgroundColor: 'rgba(19,29,41,0.95)', borderRadius: 22, padding: 24, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: 'rgba(200,208,228,0.6)', marginBottom: 7, letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 13, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', paddingHorizontal: 14, minHeight: 52 },
  inputError: { borderColor: COLORS.error },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, height: 52 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },
  successText: { fontSize: 12, color: COLORS.success, marginTop: -8, marginBottom: 12, fontWeight: '700' },
  otpSmallBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  otpSmallBtnText: { color: '#0F1822', fontSize: 11, fontWeight: '800' },
  verifiedBadge: { backgroundColor: 'rgba(40,167,69,0.18)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, marginLeft: 8 },
  verifiedText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  otpBox: { marginTop: -8, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 13, padding: 12, borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)' },
  otpHint: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginBottom: 10, lineHeight: 18 },
  otpVerifyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  otpInput: { flex: 1, height: 46, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.textPrimary, paddingHorizontal: 14, fontSize: 15, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)' },
  verifyBtn: { height: 46, borderRadius: 12, backgroundColor: COLORS.primary, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  verifyBtnText: { color: '#0F1822', fontSize: 13, fontWeight: '800' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 },
  submitText: { fontSize: 16, fontWeight: '800', color: '#0F1822', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(200,208,228,0.1)' },
  dividerText: { fontSize: 12, color: 'rgba(200,208,228,0.35)', marginHorizontal: 12 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)', backgroundColor: 'rgba(255,255,255,0.03)' },
  socialIcon: { fontSize: 18, marginRight: 10 },
  socialText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' },
  switchLabel: { fontSize: 14, color: 'rgba(200,208,228,0.55)' },
  switchLink: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  benefits: { flexDirection: width > 360 ? 'row' : 'column', gap: 10, marginBottom: 24 },
  benefitRow: { flex: 1, backgroundColor: 'rgba(215,169,75,0.1)', borderRadius: 12, padding: 12, alignItems: 'center' },
  benefitText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', textAlign: 'center' },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' },
});