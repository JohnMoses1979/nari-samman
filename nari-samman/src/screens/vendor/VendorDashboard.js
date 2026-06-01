import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';

const STATUS_COLORS = {
  confirmed: { bg: COLORS.info + '25', text: COLORS.info },
  packed: { bg: COLORS.teal + '25', text: COLORS.teal },
  sent_to_logistics: { bg: COLORS.purple + '25', text: COLORS.purple },
  shipped: { bg: COLORS.greenLight + '30', text: COLORS.greenLight },
  delivered: { bg: COLORS.success + '25', text: COLORS.success },
};

function OnboardingStep({ done, emoji, title, subtitle, buttonText, onPress }) {
  return (
    <View style={[styles.stepCard, done && styles.stepCardDone]}>
      <View style={[styles.stepIcon, done && styles.stepIconDone]}>
        <Text style={styles.stepEmoji}>{done ? '✓' : emoji}</Text>
      </View>
      <View style={styles.stepInfo}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      {!done ? (
        <TouchableOpacity onPress={onPress} style={styles.stepBtn}>
          <Text style={styles.stepBtnText}>{buttonText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.doneBadge}>
          <Text style={styles.doneBadgeText}>Done</Text>
        </View>
      )}
    </View>
  );
}

export default function VendorDashboard({ navigation }) {
  const {
    vendorProfile,
    vendorOrders,
    vendorProducts,
    pendingProducts,
    shgGroups,
    vendorNotifications,
    vendorOnboarding,
    submitVendorForAdminApproval,
    loadVendorOrders,
  } = useStore();

  useEffect(() => {
    loadVendorOrders(vendorProfile?.id).catch(() => {});
  }, [loadVendorOrders, vendorProfile?.id]);

  const ownPendingProducts = (pendingProducts || []).filter((p) => p.artisanId === vendorProfile.id);
  const displayProducts = vendorProducts.length > 0 ? vendorProducts : ownPendingProducts;
  const myShgGroup = shgGroups?.find((s) => s.name === vendorProfile.name || s.shgName === vendorProfile.shgName) || null;

  const totalEarnings = vendorOrders
    .filter((o) => o.status === 'delivered' && o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingPayout = vendorOrders
    .filter((o) => o.status === 'delivered' && ['pending_payment', 'payout_requested'].includes(o.paymentStatus))
    .reduce((sum, o) => sum + o.amount, 0);
  const unreadVendorNotifications = (vendorNotifications || []).filter((n) => !n.read).length;

  const onboardingStatus = vendorOnboarding?.status || 'approved';
  const isOnboardingVendor = onboardingStatus !== 'approved';
  const isApprovedVendor = onboardingStatus === 'approved';
  const isWaitingApproval = onboardingStatus === 'pending_admin';
  const productDone = Boolean(vendorOnboarding?.productSubmitted || vendorProducts.length > 0 || ownPendingProducts.length > 0);
  const kycDone = Boolean(vendorOnboarding?.kycSubmitted || ['submitted', 'verified'].includes(vendorProfile.kycStatus));
  const bankDone = Boolean(vendorOnboarding?.bankSubmitted || vendorProfile.bankLinked);
  const canSubmitForApproval = productDone && kycDone && bankDone;

  const kycLabel = vendorProfile.kycStatus === 'verified' ? 'KYC Verified' : kycDone ? 'KYC Submitted' : 'KYC Pending';
  const bankLabel = bankDone ? 'Bank Added' : 'Bank Pending';
  const approvalLabel = isWaitingApproval ? 'Waiting Admin Approval' : onboardingStatus === 'rejected' ? 'Need Resubmit' : 'Setup Pending';

  const activeOrders = vendorOrders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const productCount = vendorProducts.length + ownPendingProducts.length;

  const statCards = [
    { label: 'Total Earnings', value: `₹${(totalEarnings / 1000).toFixed(1)}K`, emoji: '💰', color: COLORS.gold, onPress: () => navigation.navigate('TotalEarnings') },
    { label: 'Pending Payout', value: `₹${pendingPayout.toLocaleString()}`, emoji: '⏳', color: COLORS.warning, onPress: () => navigation.navigate('PendingPayout') },
    { label: 'My Orders', value: activeOrders, emoji: '📦', color: COLORS.greenLight, onPress: () => navigation.navigate('VendorOrders') },
    { label: 'My Products', value: productCount, emoji: '🛍️', color: COLORS.saffron, onPress: () => navigation.navigate('ManageProducts') },
  ];

  const handleSubmitForApproval = () => {
    if (!canSubmitForApproval) return;
    submitVendorForAdminApproval();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={COLORS.gradientHero} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Namaste, {(vendorProfile.name || 'Vendor').split(' ')[0]} 🙏</Text>
            <Text style={styles.shgName}>{vendorProfile.shgName || 'Your SHG'}</Text>
            <Text style={styles.location}>📍 {vendorProfile.location || 'Add location'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications', { role: 'vendor' })} style={styles.iconBtn}>
            <Text style={styles.iconText}>🔔</Text>
            {unreadVendorNotifications > 0 ? (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadVendorNotifications > 9 ? '9+' : unreadVendorNotifications}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusChip, { backgroundColor: kycDone ? COLORS.success + '25' : COLORS.warning + '25' }]}>
            <Text style={[styles.statusChipText, { color: kycDone ? COLORS.mint : COLORS.warning }]}>{kycDone ? '✓' : '⏳'} {kycLabel}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: bankDone ? COLORS.info + '25' : COLORS.warning + '25' }]}>
            <Text style={[styles.statusChipText, { color: bankDone ? '#60B0F0' : COLORS.warning }]}>{bankDone ? '✓' : '⏳'} {bankLabel}</Text>
          </View>
          {isOnboardingVendor ? (
            <View style={[styles.statusChip, { backgroundColor: COLORS.gold + '25' }]}>
              <Text style={[styles.statusChipText, { color: COLORS.gold }]}>⏳ {approvalLabel}</Text>
            </View>
          ) : (
            <View style={[styles.statusChip, { backgroundColor: COLORS.gold + '25' }]}>
              <Text style={[styles.statusChipText, { color: COLORS.gold }]}>⭐ {vendorProfile.rating || 0}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {isOnboardingVendor ? (
        <View style={styles.onboardingCard}>
          {isWaitingApproval ? (
            <>
              <View style={styles.waitingIconWrap}>
                <Text style={styles.waitingIcon}>⏳</Text>
              </View>
              <Text style={styles.onboardingTitle}>Waiting for Admin Approval</Text>
              <Text style={styles.onboardingSub}>
                Your product details, KYC documents, and bank details are submitted. Admin will verify and approve your vendor account.
              </Text>
              <View style={styles.waitingList}>
                <Text style={styles.waitingItem}>✅ Product details submitted</Text>
                <Text style={styles.waitingItem}>✅ KYC documents submitted</Text>
                <Text style={styles.waitingItem}>✅ Bank details submitted</Text>
                <Text style={styles.waitingItem}>⏳ Admin review pending</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.onboardingTitle}>Complete Vendor Registration</Text>
              <Text style={styles.onboardingSub}>
                First complete these 3 steps from dashboard. After that submit your account for admin approval.
              </Text>

              <OnboardingStep
                done={productDone}
                emoji="🛍️"
                title="Product Details"
                subtitle={productDone ? 'Product sent for review' : 'Add your first product with image, price, stock and description'}
                buttonText="Add"
                onPress={() => navigation.navigate('AddProduct')}
              />
              <OnboardingStep
                done={kycDone}
                emoji="🪪"
                title="KYC Documents"
                subtitle={kycDone ? 'KYC document photos saved' : 'Upload identity proof and SHG certificate photos'}
                buttonText="KYC"
                onPress={() => navigation.navigate('VendorKYCDocuments')}
              />
              <OnboardingStep
                done={bankDone}
                emoji="🏦"
                title="Bank Details"
                subtitle={bankDone ? 'Bank details saved' : 'Add account holder, bank name, account number and IFSC'}
                buttonText="Bank"
                onPress={() => navigation.navigate('VendorBankDetails')}
              />

              <TouchableOpacity
                onPress={handleSubmitForApproval}
                disabled={!canSubmitForApproval}
                style={[styles.submitApprovalBtn, !canSubmitForApproval && styles.submitApprovalBtnDisabled]}
                activeOpacity={canSubmitForApproval ? 0.85 : 1}>
                <Text style={[styles.submitApprovalText, !canSubmitForApproval && styles.submitApprovalTextDisabled]}>
                  {canSubmitForApproval ? 'Submit for Admin Approval →' : 'Complete all steps to submit'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}


      {!isApprovedVendor ? (
        <View style={styles.lockedCard}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedTitle}>Vendor functions are locked</Text>
          <Text style={styles.lockedText}>
            Orders, earnings, payouts, product management, and remaining screens will open only after admin approval.
          </Text>
        </View>
      ) : (
        <>

      <View style={styles.statsGrid}>
        {statCards.map((s, i) => (
          <TouchableOpacity key={i} onPress={s.onPress} style={[styles.statCard, { borderTopColor: s.color }]} activeOpacity={0.75}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statTap}>Tap to view →</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        {[
          { emoji: '🛍️', label: 'Add Product', onPress: () => navigation.navigate('AddProduct') },
          { emoji: '📄', label: 'KYC Details', onPress: () => navigation.navigate('VendorKYCDocuments') },
          { emoji: '🏦', label: 'Bank Details', onPress: () => navigation.navigate('VendorBankDetails') },
          { emoji: '🌐', label: 'Language', onPress: () => navigation.navigate('LanguageSelect') },
        ].map((a, i) => (
          <TouchableOpacity key={i} onPress={a.onPress} style={styles.quickBtn}>
            <Text style={styles.quickEmoji}>{a.emoji}</Text>
            <Text style={styles.quickLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VendorOrders')}>
            <Text style={styles.seeAll}>See All ({vendorOrders.length}) →</Text>
          </TouchableOpacity>
        </View>
        {vendorOrders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>Orders will appear here after admin approves your account and products go live.</Text>
          </View>
        ) : (
          [...vendorOrders]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4)
            .map((order) => {
              const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.confirmed;
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderLeft}>
                    <Text style={styles.orderBuyer}>{order.buyer}</Text>
                    <Text style={styles.orderItem} numberOfLines={1}>{order.item}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>₹{order.amount.toLocaleString()}</Text>
                    <View style={[styles.orderStatus, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.orderStatusText, { color: statusStyle.text }]}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManageProducts')}>
            <Text style={styles.seeAll}>Manage All →</Text>
          </TouchableOpacity>
        </View>
        {displayProducts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyText}>No products added yet. Add your first product to continue registration.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.emptyActionBtn}>
              <Text style={styles.emptyActionText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {displayProducts.slice(0, 5).map((p) => (
              <View key={p.id} style={styles.productCard}>
                <Image source={imgSrc(p.image)} style={styles.productImg} resizeMode="cover" />
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.productPrice}>₹{p.price}</Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productRating}>{p.status === 'pending' ? '⏳ Pending' : `⭐ ${p.rating || 0}`}</Text>
                  <Text style={styles.productStock}>{p.stock} left</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {myShgGroup?.employees?.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👥 SHG Team members</Text>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeText}>{myShgGroup.employees.length} members</Text>
            </View>
          </View>
          {myShgGroup.employees.map((emp) => (
            <View key={emp.id} style={styles.empCard}>
              <View style={styles.empAvatar}>
                <Text style={styles.empAvatarText}>{emp.name.charAt(0)}</Text>
              </View>
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empRole}>{emp.role}</Text>
              </View>
              <Text style={styles.empPhone}>{emp.phone}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <LinearGradient colors={[COLORS.green + '25', COLORS.greenLight + '12']} style={styles.supportBanner}>
        <Text style={styles.supportEmoji}>🤝</Text>
        <View style={styles.supportInfo}>
          <Text style={styles.supportTitle}>IS&SF Warehouse Support</Text>
          <Text style={styles.supportText}>
            Your products are quality-checked, packaged, and dispatched from Sandeshkhali warehouse. No logistics hassle for you!
          </Text>
        </View>
      </LinearGradient>

        </>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1 },

  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(200,208,228,0.12)', alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: COLORS.saffron + '30' },
  iconText: { fontSize: 18 },
  notifBadge: { position: 'absolute', top: 3, right: 3, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, backgroundColor: COLORS.bengalRed, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  greeting: { fontSize: 12, color: 'rgba(245,240,232,0.65)', marginBottom: 4 },
  shgName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  location: { fontSize: 12, color: 'rgba(245,240,232,0.65)', marginTop: 4 },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusChipText: { fontSize: 11, fontWeight: '700' },

  onboardingCard: { margin: 16, marginBottom: 6, backgroundColor: COLORS.darkCard, borderRadius: 22, padding: 18, borderWidth: 1.5, borderColor: COLORS.primary + '35', ...SHADOWS.medium },
  onboardingTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  onboardingSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  stepCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dark, borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  stepCardDone: { borderColor: COLORS.success + '50', backgroundColor: COLORS.success + '10' },
  stepIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.warning + '18' },
  stepIconDone: { backgroundColor: COLORS.success },
  stepEmoji: { fontSize: 18, color: '#fff', fontWeight: '900' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  stepSubtitle: { fontSize: 11, color: COLORS.textMuted, lineHeight: 15, marginTop: 2 },
  stepBtn: { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  stepBtnText: { fontSize: 11, fontWeight: '800', color: COLORS.textDark },
  doneBadge: { backgroundColor: COLORS.success + '25', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  doneBadgeText: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  submitApprovalBtn: { marginTop: 6, backgroundColor: COLORS.primary, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  submitApprovalBtnDisabled: { backgroundColor: COLORS.darkBorder },
  submitApprovalText: { color: COLORS.textDark, fontSize: 14, fontWeight: '900' },
  submitApprovalTextDisabled: { color: COLORS.textMuted },
  waitingIconWrap: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.warning + '20', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  waitingIcon: { fontSize: 36 },
  waitingList: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 14, gap: 8 },
  waitingItem: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19 },


  lockedCard: { margin: 16, backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.warning + '35', ...SHADOWS.small },
  lockedIcon: { fontSize: 34, marginBottom: 8 },
  lockedTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '900', marginBottom: 6 },
  lockedText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  statCard: { width: '47%', backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 16, borderTopWidth: 3, ...SHADOWS.small, alignItems: 'center', minHeight: 110, justifyContent: 'center' },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  statTap: { fontSize: 10, color: COLORS.saffron, marginTop: 6, opacity: 0.8 },

  quickActions: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  quickBtn: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, ...SHADOWS.small },
  quickEmoji: { fontSize: 22 },
  quickLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },
  emptyBox: { backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 18, alignItems: 'center', ...SHADOWS.small },
  emptyEmoji: { fontSize: 38, marginBottom: 8 },
  emptyText: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  emptyActionBtn: { backgroundColor: COLORS.primary, borderRadius: 50, paddingHorizontal: 18, paddingVertical: 10, marginTop: 14 },
  emptyActionText: { color: COLORS.textDark, fontWeight: '800' },

  orderCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 8, ...SHADOWS.small },
  orderLeft: { flex: 1 },
  orderBuyer: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  orderItem: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontSize: 16, fontWeight: '800', color: COLORS.green },
  orderStatus: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  orderStatusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },

  productCard: { width: 140, backgroundColor: COLORS.darkCard, borderRadius: 16, overflow: 'hidden', ...SHADOWS.small },
  productImg: { width: 140, height: 110, backgroundColor: COLORS.dark },
  productName: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, padding: 8, paddingBottom: 2, lineHeight: 16 },
  productPrice: { fontSize: 14, fontWeight: '800', color: COLORS.saffron, paddingHorizontal: 8 },
  productMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 6 },
  productRating: { fontSize: 11, color: COLORS.textSecondary },
  productStock: { fontSize: 11, color: COLORS.textMuted },

  supportBanner: { marginHorizontal: 16, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.green + '30' },
  supportEmoji: { fontSize: 32, marginTop: 4 },
  supportInfo: { flex: 1 },
  supportTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green },
  supportText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 4 },

  teamBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  teamBadgeText: { fontSize: 11, color: COLORS.saffron, fontWeight: '700' },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12, marginBottom: 8, gap: 12, ...SHADOWS.small },
  empAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.saffron + '30', alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: 16, fontWeight: '800', color: COLORS.saffron },
  empInfo: { flex: 1 },
  empName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  empRole: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  empPhone: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
});
