import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import useStore from '../store/useStore';import Text from "../autoTranslation/AutoText";import TextInput from "../autoTranslation/AutoTextInput";import useAppLanguage from "../autoTranslation/useAppLanguage";
import NariLogoIcon from '../components/NariLogoIcon';
import { adminLogin } from '../services/api';
import { saveAdminToken, saveAdminEmail } from '../storage/authStorage';
import Constants from 'expo-constants';


// ─── Demo Credentials ─────────────────────────────────────────────────────────
const DEMO_CREDENTIALS = {
  email: 'admin@narisamman.in',
  password: 'Admin@1234'
};

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const loginUser = useStore((s) => s.loginUser);
  const adminPassword = useStore((s) => s.authPasswords?.admin || DEMO_CREDENTIALS.password);const lang = useAppLanguage();


  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(adminPassword);
    setErrors({});
    setLoginError('');
  };

  const showDemoCard =
    String(Constants.expoConfig?.extra?.showDemoAdminLogin || process.env.EXPO_PUBLIC_SHOW_DEMO_ADMIN_LOGIN || '')
      .toLowerCase() === 'true';

  const validate = () => {
    const e = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    setLoginError('');
    if (!validate()) return;
    (async () => {
      try {
        const res = await adminLogin(email.trim(), password);
        if (!res?.success || !res?.token) {
          setLoginError(res?.message || 'Login failed');
          return;
        }
        await saveAdminToken(res.token);
        await saveAdminEmail(res.email || email.trim());
        loginUser('admin', { email: res.email || email.trim() });
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AdminStack' }] }));
      } catch (e) {
        setLoginError(e?.message || 'Login failed. Please try again.');
      }
    })();
  };

  return (
    <LinearGradient colors={['#0A0F1A', '#0F1822', '#1C2437']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" keyboardDismissMode="none">

          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <LinearGradient colors={[COLORS.purple + 'CC', COLORS.primary]} style={styles.iconCircle}>
              <Text style={styles.headerIcon}>⚙️</Text>
            </LinearGradient>
            <View style={styles.brandNameRow}>
              <NariLogoIcon size={35} />
              <Text style={{...styles.appName, marginBottom: 0}}>{"Nari Samman".toUpperCase()}</Text>
            </View>
            <Text style={styles.title}>{"Admin Portal"}</Text>
            <Text style={styles.subtitle}>{"Restricted access — authorized personnel only"}</Text>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🔐</Text>
            <Text style={styles.securityText}>{"Secure Admin Access · IS&SF Initiative"}</Text>
          </View>

          {/* Demo Credentials Card */}
          <TouchableOpacity onPress={fillDemo} activeOpacity={0.8} style={styles.demoCard}>
            <LinearGradient colors={[COLORS.purple + '25', COLORS.primary + '15']} style={styles.demoCardInner}>
              <View style={styles.demoHeader}>
                <Text style={styles.demoTitle}>🎯 {"Demo Credentials"}</Text>
                <View style={styles.tapBadge}><Text style={styles.tapBadgeText}>{"TAP TO FILL"}</Text></View>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>{"Email Address"}</Text>
                <Text style={styles.credValue}>{DEMO_CREDENTIALS.email}</Text>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credLabel}>{"Password"}</Text>
                <Text style={styles.credValue}>{adminPassword}</Text>
              </View>
              <Text style={styles.demoNote}>{"* Tap this card to auto-fill credentials"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Form */}
          <View style={styles.card}>
            {/* Global error */}
            {loginError ?
            <View style={styles.globalError}>
                <Text style={styles.globalErrorText}>⚠️  {loginError}</Text>
              </View> :
            null}

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{"ADMIN EMAIL"}</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="admin@narisamman.in"
                  placeholderTextColor="rgba(200,208,228,0.3)"
                  value={email}
                  onChangeText={(v) => {setEmail(v);setErrors((e) => ({ ...e, email: null }));setLoginError('');}}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false} />
                
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{"Password".toUpperCase()}</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder={"Enter admin password"}
                  placeholderTextColor="rgba(200,208,228,0.3)"
                  value={password}
                  onChangeText={(v) => {setPassword(v);setErrors((e) => ({ ...e, password: null }));setLoginError('');}}
                  secureTextEntry={!showPass}
                  autoCapitalize="none" />
                
                <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword', { role: 'admin' })}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} style={{ marginTop: 8 }}>
              <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                style={styles.submitBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                
                <Text style={styles.submitText}>{"Access Admin Portal  →"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Warning strip */}
          <View style={styles.warningStrip}>
            <Text style={styles.warningText}>
              ⚠️  {"Unauthorized access is strictly prohibited.\nAll login attempts are monitored and logged."}
            </Text>
          </View>

          {/* Admin capabilities */}
          <View style={styles.capabilitiesCard}>
            <Text style={styles.capTitle}>{"🏛️ Admin Capabilities"}</Text>
            {[
            '✅ Approve / reject SHG registrations & products',
            '💸 Manage vendor payout requests',
            '🚚 Monitor logistics & dispatches',
            '📊 View Revenue & NABARD Reports',
            '👩 Manage 200+ SHG groups & artisans',
            '📣 Send announcements to all users'].
            map((c, i) =>
            <Text key={i} style={styles.capItem}>{c}</Text>
            )}
          </View>

          <Text style={styles.footer}>{"IS&SF Initiative · Empowering Rural West Bengal"}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>);

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 70 },

  backBtn: { marginTop: 52, marginBottom: 8 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },

  header: { alignItems: 'center', paddingVertical: 24 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16
  },
  headerIcon: { fontSize: 38 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  appName: { fontSize: 11, color: COLORS.primary, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'rgba(200,208,228,0.45)', textAlign: 'center', marginTop: 6, lineHeight: 20 },

  securityBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 20,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)',
    alignSelf: 'center'
  },
  securityIcon: { fontSize: 16 },
  securityText: { fontSize: 12, color: COLORS.purple, fontWeight: '600' },

  demoCard: { marginBottom: 20, borderRadius: 18, overflow: 'hidden' },
  demoCardInner: {
    borderRadius: 18, padding: 18,
    borderWidth: 1.5, borderColor: COLORS.purple + '40'
  },
  demoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  demoTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  tapBadge: {
    backgroundColor: COLORS.primary + '30', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.primary + '50'
  },
  tapBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.8 },
  credRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 8
  },
  credLabel: { fontSize: 12, color: 'rgba(200,208,228,0.5)', fontWeight: '600', width: 70 },
  credValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', flex: 1, textAlign: 'right' },
  demoNote: { fontSize: 11, color: 'rgba(200,208,228,0.35)', marginTop: 6, textAlign: 'center', fontStyle: 'italic' },

  card: {
    backgroundColor: 'rgba(19,29,41,0.98)',
    borderRadius: 22, padding: 24,
    borderWidth: 1, borderColor: 'rgba(200,208,228,0.1)', marginBottom: 20
  },

  globalError: {
    backgroundColor: COLORS.error + '18', borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.error + '40',
    padding: 12, marginBottom: 16
  },
  globalErrorText: { fontSize: 13, color: COLORS.error, fontWeight: '600', lineHeight: 18 },

  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(200,208,228,0.5)', marginBottom: 8, letterSpacing: 1 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 13, borderWidth: 1.5,
    borderColor: 'rgba(200,208,228,0.12)',
    paddingHorizontal: 14, height: 54
  },
  inputError: { borderColor: COLORS.error },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, height: 54 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 18 },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -4 },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  submitBtn: {
    borderRadius: 14, paddingVertical: 17,
    alignItems: 'center'
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#0F1822', letterSpacing: 0.3 },

  warningStrip: {
    backgroundColor: 'rgba(231,76,60,0.08)',
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.2)',
    padding: 14, marginBottom: 20
  },
  warningText: { fontSize: 12, color: 'rgba(231,76,60,0.7)', textAlign: 'center', lineHeight: 18, fontWeight: '500' },

  capabilitiesCard: {
    backgroundColor: 'rgba(157,205,67,0.06)',
    borderRadius: 18, borderWidth: 1,
    borderColor: 'rgba(157,205,67,0.18)',
    padding: 18, marginBottom: 28, gap: 10
  },
  capTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginBottom: 6 },
  capItem: { fontSize: 13, color: 'rgba(200,208,228,0.75)', lineHeight: 20 },

  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' }
});
