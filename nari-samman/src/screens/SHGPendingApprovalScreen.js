import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, ScrollView, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

import useStore from '../store/useStore';import Text from "../autoTranslation/AutoText";

const getSteps = () => [
{ emoji: '📝', label: "Registration Submitted", desc: "Your SHG details have been received", done: true },
{ emoji: '🔍', label: "Admin Review", desc: "Our team is verifying your details (1–2 business days)", done: false, active: true },
{ emoji: '📄', label: "KYC Documents", desc: "Document collection via email", done: false },
{ emoji: '🏦', label: "Bank Account Linking", desc: "For seamless payouts", done: false },
{ emoji: '✅', label: "Account Activated", desc: "Start listing your products!", done: false }];


export default function SHGPendingApprovalScreen({ navigation, route }) {
  const vendorProfile = useStore((s) => s.vendorProfile);
  const logout = useStore((s) => s.logout);

  const shgName = route?.params?.shgName || vendorProfile?.shgName || 'Your SHG';
  const leaderName = route?.params?.leaderName || vendorProfile?.name || 'Leader';
  const STEPS = getSteps();

  const handleGoBack = () => {
    logout();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'RoleSelect' }] }));
  };

  return (
    <LinearGradient colors={['#0F1822', '#1A2635', '#0F1822']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Success Icon */}
        <View style={styles.successCircle}>
          <LinearGradient colors={['#2A7A4A', '#3A9A5A']} style={styles.successGradient}>
            <Text style={styles.successIcon}>🎉</Text>
          </LinearGradient>
        </View>

        <Text style={styles.title}>{"Registration\nSubmitted!"}</Text>
        <Text style={styles.subtitle}>
          {"Welcome"}, <Text style={styles.highlight}>{leaderName}</Text>!{'\n'}
          <Text style={styles.shgTag}>{shgName}</Text> {"has been successfully registered."}
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusEmoji}>⏳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>{"Pending Admin Approval"}</Text>
              <Text style={styles.statusDesc}>{"You'll receive an email once your account is verified"}</Text>
            </View>
          </View>
          <LinearGradient colors={['rgba(255,152,0,0.15)', 'rgba(255,152,0,0.05)']} style={styles.pendingBanner}>
            <Text style={styles.pendingBannerText}>{"🔔 Estimated review time: 1–2 business days"}</Text>
          </LinearGradient>
        </View>

        {/* Approval Pipeline Steps */}
        <Text style={styles.sectionTitle}>📋 {"Approval Pipeline"}</Text>
        <View style={styles.stepsCard}>
          {STEPS.map((step, i) =>
          <View key={i} style={styles.stepRow}>
              {/* Connector line */}
              <View style={styles.stepLeft}>
                <View style={[
              styles.stepDot,
              step.done && styles.stepDotDone,
              step.active && styles.stepDotActive]
              }>
                  <Text style={styles.stepDotText}>{step.done ? '✓' : step.active ? '●' : i + 1}</Text>
                </View>
                {i < STEPS.length - 1 &&
              <View style={[styles.stepLine, step.done && styles.stepLineDone]} />
              }
              </View>
              <View style={[styles.stepContent, step.active && styles.stepContentActive]}>
                <View style={styles.stepHeaderRow}>
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                  <Text style={[
                styles.stepLabel,
                step.done && styles.stepLabelDone,
                step.active && styles.stepLabelActive]
                }>{step.label}</Text>
                  {step.done && <View style={styles.doneBadge}><Text style={styles.doneBadgeText}>{"DONE"}</Text></View>}
                  {step.active && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>{"IN PROGRESS"}</Text></View>}
                </View>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📬 {"What to expect"}</Text>
          {["You will receive a confirmation email at your registered address", "Admin may request additional documents for KYC verification", "Once approved, you can start listing products immediately", "Contact us at support@narisamman.in for urgent queries"].




          map((item, i) =>
          <View key={i} style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>{item}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.85}>
          <LinearGradient
            colors={['#1A4A2A', '#2A7A4A']}
            style={styles.primaryBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            
            <Text style={styles.primaryBtnText}>← {"Return to Home"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.refNote}>
          Reference ID: SHG-{Date.now().toString().slice(-6)}
        </Text>

        <Text style={styles.footer}>{"IS&SF Initiative · Empowering Rural West Bengal"}</Text>
      </ScrollView>
    </LinearGradient>);

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 60, alignItems: 'center' },

  successCircle: { marginBottom: 20 },
  successGradient: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center'
  },
  successIcon: { fontSize: 42 },

  title: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', lineHeight: 38, marginBottom: 12 },
  subtitle: { fontSize: 15, color: 'rgba(200,208,228,0.7)', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  highlight: { color: '#FFFFFF', fontWeight: '800' },
  shgTag: { color: '#3A9A5A', fontWeight: '700' },

  statusCard: {
    width: '100%', backgroundColor: 'rgba(19,29,41,0.95)',
    borderRadius: 20, padding: 18, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(255,152,0,0.25)'
  },
  statusHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  statusEmoji: { fontSize: 30 },
  statusTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statusDesc: { fontSize: 12, color: 'rgba(200,208,228,0.55)', lineHeight: 18 },
  pendingBanner: {
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: 'rgba(255,152,0,0.2)'
  },
  pendingBannerText: { fontSize: 13, color: '#FF9800', fontWeight: '600', textAlign: 'center' },

  sectionTitle: {
    fontSize: 14, fontWeight: '700', color: 'rgba(200,208,228,0.6)',
    alignSelf: 'flex-start', marginBottom: 12, letterSpacing: 0.5
  },

  stepsCard: {
    width: '100%', backgroundColor: 'rgba(19,29,41,0.95)',
    borderRadius: 20, padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(200,208,228,0.08)'
  },
  stepRow: { flexDirection: 'row', gap: 14, marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 28 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(200,208,228,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.2)',
    alignItems: 'center', justifyContent: 'center'
  },
  stepDotDone: { backgroundColor: '#2A7A4A', borderColor: '#3A9A5A' },
  stepDotActive: { backgroundColor: 'rgba(255,152,0,0.2)', borderColor: '#FF9800' },
  stepDotText: { fontSize: 11, color: '#FFFFFF', fontWeight: '800' },
  stepLine: { width: 2, flex: 1, backgroundColor: 'rgba(200,208,228,0.1)', minHeight: 20 },
  stepLineDone: { backgroundColor: '#3A9A5A' },
  stepContent: {
    flex: 1, paddingBottom: 16, paddingTop: 2,
    borderRadius: 10, marginBottom: 0
  },
  stepContentActive: {
    backgroundColor: 'rgba(255,152,0,0.07)',
    borderRadius: 10, padding: 10, marginLeft: -6
  },
  stepHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  stepEmoji: { fontSize: 15 },
  stepLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.5)' },
  stepLabelDone: { color: '#3A9A5A', fontWeight: '700' },
  stepLabelActive: { color: '#FF9800', fontWeight: '800' },
  doneBadge: { backgroundColor: '#2A7A4A30', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  doneBadgeText: { fontSize: 9, color: '#3A9A5A', fontWeight: '800', letterSpacing: 0.5 },
  activeBadge: { backgroundColor: 'rgba(255,152,0,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  activeBadgeText: { fontSize: 9, color: '#FF9800', fontWeight: '800', letterSpacing: 0.5 },
  stepDesc: { fontSize: 12, color: 'rgba(200,208,228,0.45)', lineHeight: 18 },

  infoBox: {
    width: '100%', backgroundColor: 'rgba(42,122,74,0.08)',
    borderRadius: 18, borderWidth: 1, borderColor: 'rgba(42,122,74,0.22)',
    padding: 18, marginBottom: 24, gap: 10
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#3A9A5A', marginBottom: 6 },
  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  infoBullet: { fontSize: 14, color: '#3A9A5A', lineHeight: 20 },
  infoText: { flex: 1, fontSize: 13, color: 'rgba(200,208,228,0.7)', lineHeight: 20 },

  primaryBtn: {
    width: 280, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', marginBottom: 16
  },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },

  refNote: { fontSize: 12, color: 'rgba(200,208,228,0.3)', fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }), marginBottom: 24 },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(200,208,228,0.2)' }
});