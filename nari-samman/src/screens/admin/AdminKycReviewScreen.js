import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import Text from '../../autoTranslation/AutoText';
import { adminGetAllKyc, adminApproveKyc, adminRejectKyc } from '../../services/api';
import { getAdminToken } from '../../storage/authStorage';

const { width } = Dimensions.get('window');

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS = {
  PENDING:  { label: 'Pending Review', color: '#FF9800', emoji: '⏳', bg: '#FF980018' },
  APPROVED: { label: 'Approved',       color: '#4CAF50', emoji: '✅', bg: '#4CAF5018' },
  REJECTED: { label: 'Rejected',       color: '#F44336', emoji: '❌', bg: '#F4433618' },
};

// ─── Document thumbnail ──────────────────────────────────────────────────────
function DocThumb({ label, url, onView, headers }) {
  if (!url) {
    return (
      <View style={thumbStyles.absent}>
        <Text style={thumbStyles.absentIcon}>📄</Text>
        <Text style={thumbStyles.absentLabel}>{label}</Text>
        <Text style={thumbStyles.absentSub}>Not uploaded</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={() => onView(url, label)} style={thumbStyles.card} activeOpacity={0.8}>
      <Image source={{ uri: url, headers: headers || {} }} style={thumbStyles.img} resizeMode="cover" />
      <View style={thumbStyles.overlay}>
        <Text style={thumbStyles.overlayText}>👁 View</Text>
      </View>
      <Text style={thumbStyles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

const thumbStyles = StyleSheet.create({
  card: { width: (width - 80) / 2, borderRadius: 14, overflow: 'hidden', marginBottom: 10, backgroundColor: COLORS.dark },
  img: { width: '100%', height: 110 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 22, backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'center', justifyContent: 'center' },
  overlayText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  label: { backgroundColor: COLORS.darkCard, color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', paddingVertical: 5, paddingHorizontal: 8 },
  absent: { width: (width - 80) / 2, height: 132, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: COLORS.dark },
  absentIcon: { fontSize: 26, marginBottom: 4 },
  absentLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  absentSub: { color: COLORS.textMuted, fontSize: 10, marginTop: 2 },
});

// ─── Image viewer modal ──────────────────────────────────────────────────────
function ImageViewerModal({ visible, url, title, onClose, headers }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={viewerStyles.overlay}>
        <View style={viewerStyles.container}>
          <View style={viewerStyles.header}>
            <Text style={viewerStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={viewerStyles.closeBtn}>
              <Text style={viewerStyles.closeText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          {url ? (
            <Image
              source={{ uri: url, headers: headers || {} }}
              style={viewerStyles.image}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const viewerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  container: { width: width - 24, maxHeight: '90%', backgroundColor: COLORS.darkCard, borderRadius: 20, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  title: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', flex: 1 },
  closeBtn: { backgroundColor: COLORS.error + '20', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  closeText: { color: COLORS.error, fontWeight: '700', fontSize: 13 },
  image: { width: '100%', height: 420 },
});

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({ visible, onClose, onConfirm, vendorName, loading }) {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (!note.trim()) {
      if (Platform.OS === 'web') {
        alert('Please enter a rejection reason.');
      } else {
        Alert.alert('Required', 'Please enter a rejection reason.');
      }
      return;
    }
    onConfirm(note.trim());
    setNote('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={rejectStyles.overlay}>
        <View style={rejectStyles.card}>
          <Text style={rejectStyles.title}>❌ Reject KYC</Text>
          <Text style={rejectStyles.subtitle}>
            Rejecting KYC for <Text style={{ color: COLORS.warning, fontWeight: '800' }}>{vendorName}</Text>.
            {'\n'}The vendor will see your note and can re-submit.
          </Text>
          <Text style={rejectStyles.label}>Rejection Reason *</Text>
          <TextInput
            style={rejectStyles.input}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Identity document is unclear. Please upload a clearer photo."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
          />
          <View style={rejectStyles.btnRow}>
            <TouchableOpacity onPress={onClose} style={rejectStyles.cancelBtn}>
              <Text style={rejectStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={rejectStyles.confirmBtn} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={rejectStyles.confirmText}>Reject →</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const rejectStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  card: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: 36 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.error, marginBottom: 10 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 18 },
  label: { fontSize: 12, color: COLORS.textMuted, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: COLORS.dark, color: COLORS.textPrimary, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, minHeight: 90, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.darkBorder, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  cancelText: { color: COLORS.textMuted, fontWeight: '700', fontSize: 14 },
  confirmBtn: { flex: 1, backgroundColor: COLORS.error, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

// ─── KYC Card (single submission) ────────────────────────────────────────────
function KycCard({ item, onApprove, onReject, onViewImage, approving, rejecting, imageHeaders = {} }) {
  const [expanded, setExpanded] = useState(false);
  const st = STATUS[item.kycStatus] || STATUS.PENDING;
  const isActing = approving || rejecting;

  return (
    <View style={cardStyles.card}>
      {/* Header row */}
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} activeOpacity={0.85}>
        <View style={cardStyles.headerRow}>
          <View style={[cardStyles.avatarCircle, { backgroundColor: st.color + '22' }]}>
            <Text style={cardStyles.avatarText}>{item.vendorName?.charAt(0) || '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={cardStyles.name}>{item.vendorName}</Text>
            <Text style={cardStyles.shg}>{item.shgName}</Text>
            <Text style={cardStyles.meta}>📍 {item.location || '—'}  ·  🏷️ {item.category || '—'}</Text>
            <Text style={cardStyles.meta}>✉️ {item.email}  ·  📞 {item.phone}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <View style={[cardStyles.statusChip, { backgroundColor: st.bg, borderColor: st.color + '40' }]}>
              <Text style={[cardStyles.statusText, { color: st.color }]}>{st.emoji} {st.label}</Text>
            </View>
            <Text style={cardStyles.expandArrow}>{expanded ? '▲' : '▼'}</Text>
          </View>
        </View>

        {/* Submission date */}
        <View style={cardStyles.dateRow}>
          <Text style={cardStyles.dateMeta}>Submitted: {item.submittedAt || '—'}</Text>
          {item.reviewedAt && <Text style={cardStyles.dateMeta}>Reviewed: {item.reviewedAt}</Text>}
        </View>
      </TouchableOpacity>

      {/* Expanded detail */}
      {expanded && (
        <View style={cardStyles.expanded}>
          <View style={cardStyles.divider} />

          {/* Document thumbnails */}
          <Text style={cardStyles.sectionTitle}>📎 Submitted Documents</Text>
          <View style={cardStyles.docsGrid}>
            <DocThumb label="Identity Proof" url={item.identityProofUrl} onView={onViewImage} headers={imageHeaders} />
            <DocThumb label="SHG Certificate" url={item.shgCertificateUrl} onView={onViewImage} headers={imageHeaders} />
            <DocThumb label="Address Proof" url={item.addressProofUrl} onView={onViewImage} headers={imageHeaders} />
            <DocThumb label="PAN / Extra Doc" url={item.panRegistrationUrl} onView={onViewImage} headers={imageHeaders} />
          </View>

          {/* Vendor note */}
          {item.vendorNote ? (
            <View style={cardStyles.noteBox}>
              <Text style={cardStyles.noteTitle}>📝 Vendor Note</Text>
              <Text style={cardStyles.noteText}>{item.vendorNote}</Text>
            </View>
          ) : null}

          {/* Admin note (shown after review) */}
          {item.adminNote ? (
            <View style={[cardStyles.noteBox, { borderColor: st.color + '40', backgroundColor: st.bg }]}>
              <Text style={[cardStyles.noteTitle, { color: st.color }]}>
                🔐 Admin Note {item.reviewedBy ? `(${item.reviewedBy})` : ''}
              </Text>
              <Text style={cardStyles.noteText}>{item.adminNote}</Text>
            </View>
          ) : null}

          {/* Action buttons — only shown for PENDING */}
          {item.kycStatus === 'PENDING' && (
            <View style={cardStyles.actionRow}>
              <TouchableOpacity
                onPress={() => onApprove(item)}
                style={cardStyles.approveBtn}
                disabled={isActing}
              >
                {approving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={cardStyles.approveBtnText}>✅ Approve KYC</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onReject(item)}
                style={cardStyles.rejectBtn}
                disabled={isActing}
              >
                {rejecting
                  ? <ActivityIndicator color={COLORS.error} size="small" />
                  : <Text style={cardStyles.rejectBtnText}>❌ Reject</Text>
                }
              </TouchableOpacity>
            </View>
          )}

          {/* Re-approve / re-reject for already reviewed items */}
          {item.kycStatus !== 'PENDING' && (
            <TouchableOpacity
              onPress={() => item.kycStatus === 'APPROVED' ? onReject(item) : onApprove(item)}
              style={[cardStyles.reReviewBtn, { borderColor: item.kycStatus === 'APPROVED' ? COLORS.error : COLORS.success }]}
              disabled={isActing}
            >
              <Text style={[cardStyles.reReviewText, { color: item.kycStatus === 'APPROVED' ? COLORS.error : COLORS.success }]}>
                {item.kycStatus === 'APPROVED' ? '↩ Revoke & Reject' : '↩ Re-approve'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: { backgroundColor: COLORS.darkCard, borderRadius: 20, marginBottom: 14, overflow: 'hidden', ...SHADOWS.medium },
  headerRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 16, paddingBottom: 10 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  name: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  shg: { fontSize: 12, color: COLORS.success, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, lineHeight: 17 },
  statusChip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '800' },
  expandArrow: { fontSize: 12, color: COLORS.textMuted },
  dateRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 16, paddingBottom: 12, flexWrap: 'wrap' },
  dateMeta: { fontSize: 11, color: COLORS.textMuted },
  expanded: { paddingHorizontal: 16, paddingBottom: 16 },
  divider: { height: 1, backgroundColor: COLORS.darkBorder, marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  docsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  noteBox: { backgroundColor: COLORS.dark, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.darkBorder },
  noteTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  noteText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  approveBtn: { flex: 1, backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  approveBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  rejectBtn: { flex: 0.55, backgroundColor: COLORS.error + '15', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.error + '40' },
  rejectBtnText: { color: COLORS.error, fontWeight: '800', fontSize: 14 },
  reReviewBtn: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  reReviewText: { fontWeight: '700', fontSize: 13 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminKycReviewScreen({ navigation }) {
  const [submissions, setSubmissions]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [filter, setFilter]               = useState('ALL');      // ALL | PENDING | APPROVED | REJECTED
  const [search, setSearch]               = useState('');
  const [error, setError]                 = useState('');

  // Per-item action states
  const [approvingId, setApprovingId]     = useState(null);
  const [rejectingId, setRejectingId]     = useState(null);

  // Reject modal
  const [rejectModal, setRejectModal]     = useState(false);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  // Image viewer
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerUrl, setViewerUrl]         = useState('');
  const [viewerTitle, setViewerTitle]     = useState('');
  const [imageHeaders, setImageHeaders]   = useState({});

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError('');
    try {
      const res = await adminGetAllKyc(filter === 'ALL' ? undefined : filter);
      if (res?.success) setSubmissions(res.kyc || []);
      else setError(res?.message || 'Failed to load KYC submissions');
    } catch (e) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getAdminToken();
        if (!mounted) return;
        setImageHeaders(token ? { Authorization: `Bearer ${token}` } : {});
      } catch {
        if (mounted) setImageHeaders({});
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(false);
  };

  // ── Filter + search ──────────────────────────────────────────────────────
  const visible = submissions.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.vendorName?.toLowerCase().includes(q) ||
      item.shgName?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  });

  // ── Summary counts ──────────────────────────────────────────────────────
  const counts = {
    ALL:      submissions.length,
    PENDING:  submissions.filter((s) => s.kycStatus === 'PENDING').length,
    APPROVED: submissions.filter((s) => s.kycStatus === 'APPROVED').length,
    REJECTED: submissions.filter((s) => s.kycStatus === 'REJECTED').length,
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleApprove = async (item) => {
    const doApprove = async () => {
      setApprovingId(item.vendorId);
      try {
        const res = await adminApproveKyc(item.vendorId, '');
        if (res?.success) {
          setSubmissions((prev) =>
            prev.map((s) => s.vendorId === item.vendorId ? { ...s, ...res.kyc } : s)
          );
        } else {
          showAlert('Failed to approve: ' + (res?.message || 'Unknown error'));
        }
      } catch (e) {
        showAlert(e.message || 'Approval failed');
      } finally {
        setApprovingId(null);
      }
    };

    if (Platform.OS === 'web') {
      doApprove();
    } else {
      Alert.alert(
        'Approve KYC',
        `Approve KYC for ${item.vendorName} (${item.shgName})?`,
        [{ text: 'Cancel', style: 'cancel' }, { text: 'Approve ✅', onPress: doApprove }]
      );
    }
  };

  const handleOpenRejectModal = (item) => {
    setRejectTarget(item);
    setRejectModal(true);
  };

  const handleRejectConfirm = async (note) => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    try {
      const res = await adminRejectKyc(rejectTarget.vendorId, note);
      if (res?.success) {
        setSubmissions((prev) =>
          prev.map((s) => s.vendorId === rejectTarget.vendorId ? { ...s, ...res.kyc } : s)
        );
        setRejectModal(false);
        setRejectTarget(null);
      } else {
        showAlert('Failed to reject: ' + (res?.message || 'Unknown error'));
      }
    } catch (e) {
      showAlert(e.message || 'Rejection failed');
    } finally {
      setRejectLoading(false);
    }
  };

  const handleViewImage = (url, title) => {
    setViewerUrl(url);
    setViewerTitle(title);
    setViewerVisible(true);
  };

  const showAlert = (msg) => {
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Error', msg);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🪪 KYC Review</Text>
        <Text style={styles.headerSub}>Review and approve vendor KYC document submissions.</Text>
      </LinearGradient>

      {/* ── Stats bar ── */}
      <View style={styles.statsBar}>
        {[
          { key: 'ALL',      label: 'Total',    color: COLORS.textPrimary },
          { key: 'PENDING',  label: 'Pending',  color: '#FF9800' },
          { key: 'APPROVED', label: 'Approved', color: '#4CAF50' },
          { key: 'REJECTED', label: 'Rejected', color: '#F44336' },
        ].map((s) => (
          <TouchableOpacity
            key={s.key}
            onPress={() => setFilter(s.key)}
            style={[styles.statChip, filter === s.key && { borderBottomWidth: 2, borderBottomColor: s.color }]}
          >
            <Text style={[styles.statCount, { color: s.color }]}>{counts[s.key]}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Search ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search name, SHG, email, location..."
            placeholderTextColor={COLORS.textMuted}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ── List ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary || '#D7A94B'} />
          <Text style={styles.loadingText}>Loading KYC submissions...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchData()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {visible.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🪪</Text>
              <Text style={styles.emptyTitle}>No KYC submissions</Text>
              <Text style={styles.emptySubtitle}>
                {filter !== 'ALL'
                  ? `No ${filter.toLowerCase()} submissions found.`
                  : 'KYC submissions will appear here once vendors upload documents.'}
              </Text>
            </View>
          ) : (
            visible.map((item) => (
              <KycCard
                key={item.vendorId}
                item={item}
                onApprove={handleApprove}
                onReject={handleOpenRejectModal}
                onViewImage={handleViewImage}
                approving={approvingId === item.vendorId}
                rejecting={rejectingId === item.vendorId}
                imageHeaders={imageHeaders}
              />
            ))
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* ── Modals ── */}
      <RejectModal
        visible={rejectModal}
        onClose={() => { setRejectModal(false); setRejectTarget(null); }}
        onConfirm={handleRejectConfirm}
        vendorName={rejectTarget?.vendorName || ''}
        loading={rejectLoading}
      />
      <ImageViewerModal
        visible={viewerVisible}
        url={viewerUrl}
        title={viewerTitle}
        onClose={() => setViewerVisible(false)}
        headers={imageHeaders}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },

  // Header
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 14 },
  backText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 15 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900' },
  headerSub: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 6 },

  // Stats bar
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.darkCard, paddingHorizontal: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  statChip: { flex: 1, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4 },
  statCount: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, fontWeight: '600' },

  // Search
  searchRow: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.darkCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },

  // Scroll list
  scroll: { paddingHorizontal: 16, paddingTop: 4 },

  // States
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  loadingText: { color: COLORS.textMuted, marginTop: 12, fontSize: 14 },
  errorEmoji: { fontSize: 40, marginBottom: 10 },
  errorText: { color: COLORS.error, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  retryBtn: { marginTop: 14, backgroundColor: COLORS.primary + '20', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  retryText: { color: COLORS.primary || '#D7A94B', fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
});
