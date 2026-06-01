// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS } from '../theme/colors';
// import useStore from '../store/useStore';
// import Text from '../autoTranslation/AutoText';
// import TextInput from '../autoTranslation/AutoTextInput';
// import NariLogoIcon from '../components/NariLogoIcon';

// const DUMMY_OTP = '123456';

// function cleanMobile(value) {
//   return String(value || '').replace(/\D/g, '').slice(0, 10);
// }

// function normalizeRole(role) {
//   return role === 'shg' ? 'vendor' : role || 'consumer';
// }

// function roleTitle(role) {
//   const normalized = normalizeRole(role);
//   if (normalized === 'vendor') return 'SHG / Vendor';
//   if (normalized === 'admin') return 'Admin';
//   return 'Consumer';
// }

// export default function ForgotPasswordScreen({ route, navigation }) {
//   const role = normalizeRole(route?.params?.role);
//   const resetPassword = useStore((s) => s.resetPassword);
//   const [step, setStep] = useState('mobile');
//   const [mobile, setMobile] = useState('');
//   const [otp, setOtp] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [error, setError] = useState('');
//   const [info, setInfo] = useState('');

//   const sendOtp = () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setError('Enter exactly 10 digit mobile number');
//       return;
//     }
//     setError('');
//     setInfo(`OTP sent to +91 ${mobile}. Use ${DUMMY_OTP} for demo.`);
//     setOtp('');
//     setStep('otp');
//   };

//   const verifyOtp = () => {
//     if (otp !== DUMMY_OTP) {
//       setError('Invalid OTP. Use 123456 for demo verification');
//       return;
//     }
//     setError('');
//     setInfo('Mobile number verified successfully');
//     setStep('password');
//   };

//   const savePassword = () => {
//     if (!password || password.length < 6) {
//       setError('New password must be at least 6 characters');
//       return;
//     }
//     if (password !== confirm) {
//       setError('Confirm password does not match');
//       return;
//     }
//     resetPassword(role, password, mobile);
//     setError('');
//     setInfo('Password reset successfully. Please login with your new password.');
//     setStep('success');
//   };

//   return (
//     <LinearGradient colors={['#0F1822', '#1C2437', '#0F1822']} style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>

//           <View style={styles.header}>
//             <NariLogoIcon size={46} />
//             <Text style={styles.title}>Forgot Password</Text>
//             <Text style={styles.subtitle}>{roleTitle(role)} account recovery</Text>
//           </View>

//           <View style={styles.card}>
//             <View style={styles.stepRow}>
//               {['mobile', 'otp', 'password'].map((s, index) => (
//                 <View key={s} style={[styles.stepDot, (step === s || index < ['mobile', 'otp', 'password'].indexOf(step)) && styles.stepDotActive]} />
//               ))}
//             </View>

//             {step === 'mobile' && (
//               <>
//                 <Text style={styles.cardTitle}>1. Enter Mobile Number</Text>
//                 <Text style={styles.helpText}>We will send an OTP to verify your registered mobile number.</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter 10 digit mobile number"
//                   placeholderTextColor="rgba(200,208,228,0.35)"
//                   keyboardType="number-pad"
//                   maxLength={10}
//                   value={mobile}
//                   onChangeText={(v) => { setMobile(cleanMobile(v)); setError(''); }}
//                 />
//                 <TouchableOpacity onPress={sendOtp} style={styles.primaryBtn}>
//                   <Text style={styles.primaryText}>Send OTP</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {step === 'otp' && (
//               <>
//                 <Text style={styles.cardTitle}>2. Verify OTP</Text>
//                 <Text style={styles.helpText}>{info}</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter OTP"
//                   placeholderTextColor="rgba(200,208,228,0.35)"
//                   keyboardType="number-pad"
//                   maxLength={6}
//                   value={otp}
//                   onChangeText={(v) => { setOtp(String(v || '').replace(/\D/g, '').slice(0, 6)); setError(''); }}
//                 />
//                 <TouchableOpacity onPress={verifyOtp} style={styles.primaryBtn}>
//                   <Text style={styles.primaryText}>Verify OTP</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={sendOtp} style={styles.linkBtn}>
//                   <Text style={styles.linkText}>Resend OTP</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {step === 'password' && (
//               <>
//                 <Text style={styles.cardTitle}>3. Set New Password</Text>
//                 <Text style={styles.helpText}>Enter your new password and confirm it.</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="New password"
//                   placeholderTextColor="rgba(200,208,228,0.35)"
//                   secureTextEntry
//                   autoCapitalize="none"
//                   value={password}
//                   onChangeText={(v) => { setPassword(v); setError(''); }}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Confirm password"
//                   placeholderTextColor="rgba(200,208,228,0.35)"
//                   secureTextEntry
//                   autoCapitalize="none"
//                   value={confirm}
//                   onChangeText={(v) => { setConfirm(v); setError(''); }}
//                 />
//                 <TouchableOpacity onPress={savePassword} style={styles.primaryBtn}>
//                   <Text style={styles.primaryText}>Save Password</Text>
//                 </TouchableOpacity>
//               </>
//             )}

//             {step === 'success' && (
//               <View style={styles.successBox}>
//                 <Text style={styles.successEmoji}>✅</Text>
//                 <Text style={styles.cardTitle}>Password Reset Successful</Text>
//                 <Text style={styles.helpText}>{info}</Text>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryBtn}>
//                   <Text style={styles.primaryText}>Back to Login</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {error ? <Text style={styles.errorText}>{error}</Text> : null}
//             {info && step !== 'otp' && step !== 'success' ? <Text style={styles.infoText}>{info}</Text> : null}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 70 },
//   backBtn: { marginTop: 52, marginBottom: 12 },
//   backText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
//   header: { alignItems: 'center', paddingVertical: 24 },
//   title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginTop: 14 },
//   subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.55)', marginTop: 6 },
//   card: { backgroundColor: 'rgba(19,29,41,0.96)', borderRadius: 22, padding: 24, borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)' },
//   stepRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
//   stepDot: { flex: 1, height: 5, borderRadius: 4, backgroundColor: 'rgba(200,208,228,0.15)' },
//   stepDotActive: { backgroundColor: COLORS.primary },
//   cardTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 8 },
//   helpText: { fontSize: 13, color: 'rgba(200,208,228,0.62)', lineHeight: 20, marginBottom: 16 },
//   input: { height: 52, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)', paddingHorizontal: 14, color: COLORS.textPrimary, fontSize: 15, marginBottom: 12 },
//   primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
//   primaryText: { color: '#0F1822', fontSize: 15, fontWeight: '900' },
//   linkBtn: { alignItems: 'center', marginTop: 14 },
//   linkText: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
//   errorText: { color: COLORS.error || COLORS.bengalRed, fontSize: 12, marginTop: 14, fontWeight: '700' },
//   infoText: { color: COLORS.success, fontSize: 12, marginTop: 14, fontWeight: '700' },
//   successBox: { alignItems: 'center' },
//   successEmoji: { fontSize: 52, marginBottom: 12 },
// });















import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import Text from '../autoTranslation/AutoText';
import TextInput from '../autoTranslation/AutoTextInput';
import NariLogoIcon from '../components/NariLogoIcon';

import {
  checkPhoneRegistered,
  resetPasswordApi,
  sendOtpToPhone,
  verifyPhoneOtp,
} from '../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const RESEND_COOLDOWN_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;

function cleanMobile(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function normalizeRole(role) {
  return role === 'shg' ? 'vendor' : role || 'consumer';
}

function roleTitle(role) {
  const normalized = normalizeRole(role);
  if (normalized === 'vendor') return 'SHG / Vendor';
  if (normalized === 'admin') return 'Admin';
  return 'Consumer';
}

export default function ForgotPasswordScreen({ route, navigation }) {
  const role = normalizeRole(route?.params?.role);

  const [step, setStep] = useState('mobile');       // mobile → otp → password → success
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP attempt tracking
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLocked, setOtpLocked] = useState(false);

  // Resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimer = useRef(null);

  // Store the verified OTP so reset-password endpoint can use it
  const [verifiedOtp, setVerifiedOtp] = useState('');

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Step 1: Verify phone is registered, then send OTP ─────────────────────
  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter exactly 10 digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Confirm this mobile is registered in the DB before spending an OTP credit
      await checkPhoneRegistered(role, mobile);

      // Phone exists — now send real Twilio OTP
      await sendOtpToPhone(mobile);

      setInfo(`OTP sent to +91 ${mobile}`);
      setOtp('');
      setOtpAttempts(0);
      setOtpLocked(false);
      setStep('otp');
      startResendCooldown();
    } catch (err) {
      // checkPhoneRegistered throws with backend message if phone not found
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP (only allowed after cooldown expires) ──────────────────────
  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      await sendOtpToPhone(mobile);
      setInfo(`OTP resent to +91 ${mobile}`);
      setOtp('');
      setOtpAttempts(0);
      setOtpLocked(false);
      startResendCooldown();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP via Twilio ─────────────────────────────────────────
  const verifyOtp = async () => {
    if (otpLocked) {
      setError('Too many attempts. Please request a new OTP.');
      return;
    }
    if (!otp || otp.length < 4) {
      setError('Enter the OTP sent to your mobile');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Real Twilio verification — handles expiry (5 min) automatically
      await verifyPhoneOtp(mobile, otp);

      // OTP approved — store it for the reset step
      setVerifiedOtp(otp);
      setInfo('Mobile number verified successfully');
      setStep('password');
    } catch (err) {
      const attempts = otpAttempts + 1;
      setOtpAttempts(attempts);
      if (attempts >= MAX_OTP_ATTEMPTS) {
        setOtpLocked(true);
        setError(`Too many failed attempts. Request a new OTP.`);
      } else {
        setError(
          err.message ||
          `Invalid OTP. ${MAX_OTP_ATTEMPTS - attempts} attempt${MAX_OTP_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Set new password ───────────────────────────────────────────────
  const savePassword = async () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    // Password strength: at least one letter and one number
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one letter and one number');
      return;
    }
    if (password !== confirm) {
      setError('Confirm password does not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Backend re-verifies OTP + BCrypt-hashes + saves
      await resetPasswordApi(role, mobile, verifiedOtp, password);
      setInfo('Password reset successfully. Please login with your new password.');
      setStep('success');
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0F1822', '#1C2437', '#0F1822']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <NariLogoIcon size={46} />
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>{roleTitle(role)} account recovery</Text>
          </View>

          <View style={styles.card}>
            {/* Progress dots */}
            <View style={styles.stepRow}>
              {['mobile', 'otp', 'password'].map((s, index) => (
                <View
                  key={s}
                  style={[
                    styles.stepDot,
                    (step === s || index < ['mobile', 'otp', 'password'].indexOf(step)) &&
                    styles.stepDotActive,
                  ]}
                />
              ))}
            </View>

            {/* ── Step 1: Mobile ── */}
            {step === 'mobile' && (
              <>
                <Text style={styles.cardTitle}>1. Enter Mobile Number</Text>
                <Text style={styles.helpText}>
                  Enter your registered mobile number. We will verify it and send an OTP.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10 digit mobile number"
                  placeholderTextColor="rgba(200,208,228,0.35)"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={(v) => { setMobile(cleanMobile(v)); setError(''); }}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={sendOtp}
                  style={[styles.primaryBtn, loading && styles.btnDisabled]}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#0F1822" />
                    : <Text style={styles.primaryText}>Verify & Send OTP</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
              <>
                <Text style={styles.cardTitle}>2. Verify OTP</Text>
                <Text style={styles.helpText}>{info}</Text>
                <TextInput
                  style={[styles.input, otpLocked && styles.inputDisabled]}
                  placeholder="Enter OTP"
                  placeholderTextColor="rgba(200,208,228,0.35)"
                  keyboardType="number-pad"
                  maxLength={8}
                  value={otp}
                  onChangeText={(v) => {
                    setOtp(String(v || '').replace(/\D/g, '').slice(0, 8));
                    setError('');
                  }}
                  editable={!loading && !otpLocked}
                />
                <TouchableOpacity
                  onPress={verifyOtp}
                  style={[styles.primaryBtn, (loading || otpLocked) && styles.btnDisabled]}
                  disabled={loading || otpLocked}
                >
                  {loading
                    ? <ActivityIndicator color="#0F1822" />
                    : <Text style={styles.primaryText}>Verify OTP</Text>
                  }
                </TouchableOpacity>

                {/* Resend with cooldown */}
                <TouchableOpacity
                  onPress={resendOtp}
                  style={[styles.linkBtn, (resendCooldown > 0 || loading) && styles.linkBtnDisabled]}
                  disabled={resendCooldown > 0 || loading}
                >
                  <Text style={[styles.linkText, resendCooldown > 0 && styles.linkTextMuted]}>
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>

                {otpAttempts > 0 && !otpLocked && (
                  <Text style={styles.attemptsText}>
                    {MAX_OTP_ATTEMPTS - otpAttempts} attempt{MAX_OTP_ATTEMPTS - otpAttempts !== 1 ? 's' : ''} remaining
                  </Text>
                )}
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 'password' && (
              <>
                <Text style={styles.cardTitle}>3. Set New Password</Text>
                <Text style={styles.helpText}>
                  Choose a strong password with at least 6 characters, including a letter and a number.
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="New password (min. 8 characters)"
                    placeholderTextColor="rgba(200,208,228,0.35)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={(v) => { setPassword(v); setError(''); }}
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Confirm new password"
                    placeholderTextColor="rgba(200,208,228,0.35)"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    value={confirm}
                    onChangeText={(v) => { setConfirm(v); setError(''); }}
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={savePassword}
                  style={[styles.primaryBtn, loading && styles.btnDisabled]}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#0F1822" />
                    : <Text style={styles.primaryText}>Save New Password</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            {/* ── Success ── */}
            {step === 'success' && (
              <View style={styles.successBox}>
                <Text style={styles.successEmoji}>✅</Text>
                <Text style={styles.cardTitle}>Password Reset Successful</Text>
                <Text style={styles.helpText}>{info}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryBtn}>
                  <Text style={styles.primaryText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {info && step !== 'otp' && step !== 'success' ? (
              <Text style={styles.infoText}>{info}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 70 },
  backBtn: { marginTop: 52, marginBottom: 12 },
  backText: { color: COLORS.primary || COLORS.green, fontSize: 15, fontWeight: '700' },
  header: { alignItems: 'center', paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, marginTop: 14 },
  subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.55)', marginTop: 6 },
  card: {
    backgroundColor: 'rgba(19,29,41,0.96)', borderRadius: 22, padding: 24,
    borderWidth: 1, borderColor: 'rgba(200,208,228,0.12)',
  },
  stepRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  stepDot: { flex: 1, height: 5, borderRadius: 4, backgroundColor: 'rgba(200,208,228,0.15)' },
  stepDotActive: { backgroundColor: COLORS.primary || COLORS.green },
  cardTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 8 },
  helpText: { fontSize: 13, color: 'rgba(200,208,228,0.62)', lineHeight: 20, marginBottom: 16 },
  input: {
    height: 52, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.12)',
    paddingHorizontal: 14, color: COLORS.textPrimary, fontSize: 15, marginBottom: 12,
  },
  inputDisabled: { opacity: 0.5 },
  primaryBtn: {
    backgroundColor: COLORS.primary || COLORS.green,
    borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  primaryText: { color: '#0F1822', fontSize: 15, fontWeight: '900' },
  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkBtnDisabled: { opacity: 0.5 },
  linkText: { color: COLORS.primary || COLORS.green, fontSize: 13, fontWeight: '800' },
  linkTextMuted: { color: 'rgba(200,208,228,0.4)' },
  attemptsText: { fontSize: 11, color: COLORS.warning || '#FFC107', textAlign: 'center', marginTop: 8 },
  errorText: { color: COLORS.error || '#dc3545', fontSize: 12, marginTop: 14, fontWeight: '700' },
  infoText: { color: COLORS.success || '#28a745', fontSize: 12, marginTop: 14, fontWeight: '700' },
  successBox: { alignItems: 'center' },
  successEmoji: { fontSize: 52, marginBottom: 12 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(200,208,228,0.12)',
    marginBottom: 12,
  },

  eyeButton: {
    paddingHorizontal: 15,
  },
  eyeIcon: {
    fontSize: 18,
  },
});