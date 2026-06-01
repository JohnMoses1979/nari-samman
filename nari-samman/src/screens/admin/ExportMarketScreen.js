import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, Alert } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

const EXPORT_MARKETS = [
{ id: 'ex1', country: 'United States', flag: '🇺🇸', currency: 'USD', exchangeRate: 83.5, status: 'active', targetSegment: 'Bengali NRI Community', cities: ['New York', 'New Jersey', 'Chicago', 'San Jose'], monthlyRevenue: 124000, ordersThisMonth: 34, avgOrderValue: 3647, topProducts: ['Baluchari Silk Saree', 'Jamdani Saree', 'Sundarbans Honey'], shippingPartner: 'FedEx International', avgDeliveryDays: 7, notes: 'Largest Bengali diaspora outside India. High demand for Durga Puja and wedding season.' },
{ id: 'ex2', country: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', exchangeRate: 106.2, status: 'active', targetSegment: 'South Asian Diaspora', cities: ['London', 'Leicester', 'Birmingham'], monthlyRevenue: 98000, ordersThisMonth: 27, avgOrderValue: 3630, topProducts: ['Tant Saree', 'Murshidabad Silk', 'Tribal Crafts'], shippingPartner: 'DHL Express', avgDeliveryDays: 5, notes: 'Strong demand for ethnic textiles especially around Eid, Diwali, and Durga Puja.' },
{ id: 'ex3', country: 'Australia', flag: '🇦🇺', currency: 'AUD', exchangeRate: 54.8, status: 'active', targetSegment: 'Indian Diaspora', cities: ['Sydney', 'Melbourne', 'Brisbane'], monthlyRevenue: 67000, ordersThisMonth: 19, avgOrderValue: 3526, topProducts: ['Baluchari Silk', 'Jamdani', 'Bamboo Crafts'], shippingPartner: 'Australia Post International', avgDeliveryDays: 10, notes: 'Growing Indian community. Focus on gifting and festive collections.' },
{ id: 'ex4', country: 'Canada', flag: '🇨🇦', currency: 'CAD', exchangeRate: 61.4, status: 'active', targetSegment: 'Bengali NRI Community', cities: ['Toronto', 'Vancouver', 'Calgary'], monthlyRevenue: 54000, ordersThisMonth: 16, avgOrderValue: 3375, topProducts: ['Tant Saree', 'Sundarbans Honey', 'Jaggery'], shippingPartner: 'Canada Post / FedEx', avgDeliveryDays: 9, notes: 'High demand for food products (honey, jaggery) alongside textiles.' },
{ id: 'ex5', country: 'Germany', flag: '🇩🇪', currency: 'EUR', exchangeRate: 89.7, status: 'pipeline', targetSegment: 'Ethnic Craft Buyers', cities: ['Berlin', 'Frankfurt', 'Hamburg'], monthlyRevenue: 0, ordersThisMonth: 0, avgOrderValue: 0, topProducts: ['Dokra Art', 'Patachitra', 'Tribal Textiles'], shippingPartner: 'DHL Express', avgDeliveryDays: 6, notes: 'Strong market for handcrafted ethnic art. Sustainability focus aligns with eco products.' },
{ id: 'ex6', country: 'UAE', flag: '🇦🇪', currency: 'AED', exchangeRate: 22.7, status: 'pipeline', targetSegment: 'NRI & South Asian Community', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'], monthlyRevenue: 0, ordersThisMonth: 0, avgOrderValue: 0, topProducts: ['Baluchari Silk', 'Jamdani', 'Gold Sarees'], shippingPartner: 'Aramex', avgDeliveryDays: 5, notes: 'Large NRI market. Significant potential for premium sarees and luxury ethnic wear.' }];


const EXPORT_ORDERS = [
{ id: 'eo1', country: 'USA', flag: '🇺🇸', buyer: 'Moushumi Chatterjee', product: 'Baluchari Silk Saree', qty: 2, priceINR: 17000, status: 'delivered', date: '2025-05-08', tracking: 'FDX-8823411' },
{ id: 'eo2', country: 'UK', flag: '🇬🇧', buyer: 'Priyanka Sen', product: 'Jamdani Saree - White & Gold', qty: 1, priceINR: 4200, status: 'shipped', date: '2025-05-09', tracking: 'DHL-UK-9934' },
{ id: 'eo3', country: 'Australia', flag: '🇦🇺', buyer: 'Devjyoti Bose', product: 'Sundarbans Honey + Tribal Craft Set', qty: 1, priceINR: 2800, status: 'processing', date: '2025-05-11', tracking: 'Pending' },
{ id: 'eo4', country: 'Canada', flag: '🇨🇦', buyer: 'Rumi Das', product: 'Tant Saree (x2) + Honey', qty: 3, priceINR: 3000, status: 'confirmed', date: '2025-05-12', tracking: 'Pending' }];




export default function ExportMarketScreen({ navigation }) {const lang = useAppLanguage();

  const [tab, setTab] = useState('markets');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [orders, setOrders] = useState(EXPORT_ORDERS);
  const [orderForm, setOrderForm] = useState({ country: '', buyer: '', product: '', qty: '1', priceINR: '', currency: 'USD' });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelectedMarket(null);
      setShowAddOrder(false);
    });

    return unsubscribe;
  }, [navigation]);

  const activeMarkets = EXPORT_MARKETS.filter((m) => m.status === 'active');
  const totalExportRevenue = activeMarkets.reduce((s, m) => s + m.monthlyRevenue, 0);
  const totalExportOrders = activeMarkets.reduce((s, m) => s + m.ordersThisMonth, 0);

  const getStatusColor = (status) => {
    if (status === 'delivered') return COLORS.success;
    if (status === 'shipped') return COLORS.primary;
    if (status === 'processing') return COLORS.warning;
    return COLORS.textMuted;
  };

  const handleAddOrder = () => {
    if (!orderForm.country || !orderForm.buyer || !orderForm.product) return Alert.alert('Error', 'Country, buyer name, and product are required');
    const rate = EXPORT_MARKETS.find((m) => m.country === orderForm.country)?.exchangeRate || 83;
    const newOrder = {
      id: `eo${Date.now()}`, ...orderForm,
      qty: parseInt(orderForm.qty) || 1,
      priceINR: parseFloat(orderForm.priceINR) || 0,
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0],
      tracking: 'Pending',
      flag: EXPORT_MARKETS.find((m) => m.country === orderForm.country)?.flag || '🌍'
    };
    setOrders((prev) => [newOrder, ...prev]);
    setShowAddOrder(false);
    setOrderForm({ country: '', buyer: '', product: '', qty: '1', priceINR: '', currency: 'USD' });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{"← Back"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"Export Market"}</Text>
          <Text style={styles.headerSub}>{"Global Ethnic & Bengali Diaspora Commerce"}</Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.primary }]}>₹{(totalExportRevenue / 1000).toFixed(0)}K</Text><Text style={styles.statLbl}>{"Monthly Revenue"}</Text></View>
          <View style={styles.statCard}><Text style={styles.statVal}>{totalExportOrders}</Text><Text style={styles.statLbl}>{"Export Orders"}</Text></View>
          <View style={styles.statCard}><Text style={[styles.statVal, { color: COLORS.success }]}>{activeMarkets.length}</Text><Text style={styles.statLbl}>{"Active Markets"}</Text></View>
        </View>

        <View style={styles.tabs}>
          {[['markets', '🌍 Markets'], ['orders', '📦 Orders'], ['pricing', '💱 Pricing']].map(([key, label]) =>
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
              <Text style={[styles.tabTxt, tab === key && styles.tabTxtActive]}>{label}</Text>
            </TouchableOpacity>
          )}
        </View>

        {tab === 'markets' && EXPORT_MARKETS.map((market) =>
        <TouchableOpacity key={market.id} onPress={() => setSelectedMarket(market)} style={styles.marketCard}>
            <View style={styles.marketTop}>
              <Text style={styles.marketFlag}>{market.flag}</Text>
              <View style={styles.marketInfo}>
                <View style={styles.marketNameRow}>
                  <Text style={styles.marketName}>{market.country}</Text>
                  <View style={[styles.marketStatus, { backgroundColor: market.status === 'active' ? COLORS.success + '25' : COLORS.warning + '25' }]}>
                    <Text style={[styles.marketStatusTxt, { color: market.status === 'active' ? COLORS.success : COLORS.warning }]}>{market.status === 'active' ? '● Live' : '⏳ Pipeline'}</Text>
                  </View>
                </View>
                <Text style={styles.marketSegment}>{market.targetSegment}</Text>
                <Text style={styles.marketCities}>📍 {market.cities.slice(0, 3).join(', ')}</Text>
              </View>
            </View>
            {market.status === 'active' &&
          <View style={styles.marketStats}>
                <View style={styles.marketStat}><Text style={[styles.marketStatVal, { color: COLORS.primary }]}>₹{(market.monthlyRevenue / 1000).toFixed(0)}K</Text><Text style={styles.marketStatLbl}>{"Rev/Month"}</Text></View>
                <View style={styles.marketStat}><Text style={styles.marketStatVal}>{market.ordersThisMonth}</Text><Text style={styles.marketStatLbl}>{"Orders"}</Text></View>
                <View style={styles.marketStat}><Text style={[styles.marketStatVal, { color: COLORS.teal }]}>{market.avgDeliveryDays}d</Text><Text style={styles.marketStatLbl}>{"Avg Delivery"}</Text></View>
                <View style={styles.marketStat}><Text style={styles.marketStatVal}>{market.currency}</Text><Text style={styles.marketStatLbl}>{"Currency"}</Text></View>
              </View>
          }
          </TouchableOpacity>
        )}

        {tab === 'orders' &&
        <>
            <TouchableOpacity onPress={() => setShowAddOrder(true)} style={styles.addBtn}><Text style={styles.addBtnTxt}>{"+ New Export Order"}</Text></TouchableOpacity>
            {orders.map((order) =>
          <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderFlag}>{order.flag}</Text>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderBuyer}>{order.buyer}</Text>
                    <Text style={styles.orderProduct}>{order.product} × {order.qty}</Text>
                    <Text style={styles.orderDate}>{order.date} · {order.tracking}</Text>
                  </View>
                  <View>
                    <Text style={styles.orderPrice}>₹{order.priceINR.toLocaleString()}</Text>
                    <View style={[styles.orderStatusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                      <Text style={[styles.orderStatusTxt, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
          )}
          </>
        }

        {tab === 'pricing' &&
        <View style={styles.pricingSection}>
            <Text style={styles.pricingTitle}>{"Export Pricing Guide"}</Text>
            <Text style={styles.pricingNote}>{"All export prices include: product cost + packaging + international shipping + customs duty margin + 10% export premium"}</Text>
            {[
          { product: 'Baluchari Silk Saree', inr: 8500, usd: 128, gbp: 100, aud: 186 },
          { product: 'Jamdani Saree', inr: 4200, usd: 65, gbp: 51, aud: 97 },
          { product: 'Murshidabad Silk', inr: 3600, usd: 56, gbp: 44, aud: 83 },
          { product: 'Tant Saree', inr: 1200, usd: 22, gbp: 17, aud: 32 },
          { product: 'Sundarbans Honey', inr: 480, usd: 11, gbp: 8, aud: 16 },
          { product: 'Tribal Craft Set', inr: 1500, usd: 28, gbp: 22, aud: 41 },
          { product: 'Jaggery (1kg)', inr: 160, usd: 5, gbp: 4, aud: 7 }].
          map((item) =>
          <View key={item.product} style={styles.pricingRow}>
                <Text style={styles.pricingProduct}>{item.product}</Text>
                <Text style={styles.pricingINR}>₹{item.inr}</Text>
                <Text style={styles.pricingForeign}>${item.usd}</Text>
                <Text style={styles.pricingForeign}>£{item.gbp}</Text>
                <Text style={styles.pricingForeign}>A${item.aud}</Text>
              </View>
          )}
          </View>
        }

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal transparent animationType="slide" visible={!!selectedMarket} onRequestClose={() => setSelectedMarket(null)}>
          <View style={styles.overlay}>
            <View style={styles.detailModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedMarket ? (
                  <>
                    <View style={styles.modalTop}>
                      <Text style={styles.modalFlag}>{selectedMarket.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalCountry}>{selectedMarket.country}</Text>
                        <Text style={styles.modalSegment}>{selectedMarket.targetSegment}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedMarket(null)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
                    </View>
                    {[
                      ['Exchange Rate', `1 ${selectedMarket.currency} = ₹${selectedMarket.exchangeRate}`],
                      ['Shipping Partner', selectedMarket.shippingPartner],
                      ['Avg Delivery', `${selectedMarket.avgDeliveryDays} days`],
                      ['Key Cities', selectedMarket.cities.join(', ')],
                      ['Monthly Orders', selectedMarket.ordersThisMonth.toString()],
                      ["Monthly Revenue", `₹${selectedMarket.monthlyRevenue.toLocaleString()}`],
                    ].map(([lbl, val]) => (
                      <View key={lbl} style={styles.detailRow}>
                        <Text style={styles.detailLbl}>{lbl}</Text>
                        <Text style={styles.detailVal}>{val}</Text>
                      </View>
                    ))}
                    <Text style={styles.marketNotes}>{selectedMarket.notes}</Text>
                    <Text style={styles.topProductsTitle}>Top Products in {selectedMarket.country}</Text>
                    {selectedMarket.topProducts.map((p) => <Text key={p} style={styles.topProductItem}>• {p}</Text>)}
                    <TouchableOpacity onPress={() => setSelectedMarket(null)} style={styles.closeBtn}><Text style={styles.closeBtnTxt}>{"Close"}</Text></TouchableOpacity>
                  </>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>

      <Modal transparent animationType="slide" visible={showAddOrder} onRequestClose={() => setShowAddOrder(false)}>
          <View style={styles.overlay}>
            <View style={styles.addModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.addTitle}>{"New Export Order"}</Text>
                <Text style={styles.addLabel}>{"Destination Country"}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {EXPORT_MARKETS.map((m) =>
                  <TouchableOpacity key={m.id} onPress={() => setOrderForm((f) => ({ ...f, country: m.country, currency: m.currency }))}
                  style={[styles.countryBtn, orderForm.country === m.country && styles.countryBtnActive]}>
                        <Text style={styles.countryBtnTxt}>{m.flag} {m.country}</Text>
                      </TouchableOpacity>
                  )}
                  </View>
                </ScrollView>
                {[['buyer', "Buyer's Name"], ['product', 'Product(s)'], ['qty', 'Quantity'], ['priceINR', 'Price in ₹']].map(([k, l]) =>
              <TextInput key={k} placeholder={l} placeholderTextColor={COLORS.textMuted} value={orderForm[k]}
              onChangeText={(v) => setOrderForm((f) => ({ ...f, [k]: v }))} style={styles.input}
              keyboardType={['qty', 'priceINR'].includes(k) ? 'numeric' : 'default'} />
              )}
                {orderForm.priceINR && orderForm.country &&
              <View style={styles.conversionBox}>
                    <Text style={styles.conversionTxt}>
                      ≈ {orderForm.currency} {(parseFloat(orderForm.priceINR) / (EXPORT_MARKETS.find((m) => m.country === orderForm.country)?.exchangeRate || 83)).toFixed(2)}
                    </Text>
                  </View>
              }
                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={() => setShowAddOrder(false)} style={styles.cancelBtn}><Text style={styles.cancelTxt}>{"Cancel"}</Text></TouchableOpacity>
                  <TouchableOpacity onPress={handleAddOrder} style={styles.saveBtn}><Text style={styles.saveTxt}>{"Create Order"}</Text></TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flexGrow: 1 },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { marginBottom: 12 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12, alignItems: 'center', ...SHADOWS.small },
  statVal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  statLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 3, textAlign: 'center' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.darkCard, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  tabActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  tabTxt: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  tabTxtActive: { color: COLORS.primary },
  marketCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.darkCard, borderRadius: 16, padding: 14, ...SHADOWS.small },
  marketTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  marketFlag: { fontSize: 34 },
  marketInfo: { flex: 1 },
  marketNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  marketName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  marketStatus: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  marketStatusTxt: { fontSize: 10, fontWeight: '700' },
  marketSegment: { fontSize: 12, color: COLORS.primary, marginTop: 3 },
  marketCities: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  marketStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.darkBorder, paddingTop: 10, gap: 8 },
  marketStat: { flex: 1, alignItems: 'center' },
  marketStatVal: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  marketStatLbl: { fontSize: 9, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  addBtn: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  addBtnTxt: { fontSize: 14, fontWeight: '700', color: COLORS.darkDeep },
  orderCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 12 },
  orderTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  orderFlag: { fontSize: 26 },
  orderInfo: { flex: 1 },
  orderBuyer: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  orderProduct: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  orderPrice: { fontSize: 14, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },
  orderStatusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  orderStatusTxt: { fontSize: 10, fontWeight: '700' },
  pricingSection: { marginHorizontal: 16 },
  pricingTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  pricingNote: { fontSize: 11, color: COLORS.textMuted, marginBottom: 12, lineHeight: 16 },
  pricingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  pricingProduct: { flex: 2, fontSize: 12, color: COLORS.textSecondary },
  pricingINR: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '600', textAlign: 'right' },
  pricingForeign: { flex: 0.8, fontSize: 11, color: COLORS.textMuted, textAlign: 'right' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  detailModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  modalFlag: { fontSize: 40 },
  modalCountry: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  modalSegment: { fontSize: 12, color: COLORS.textMuted },
  closeX: { fontSize: 20, color: COLORS.textMuted },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  detailLbl: { fontSize: 12, color: COLORS.textMuted },
  detailVal: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  marketNotes: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12, marginBottom: 10, fontStyle: 'italic', lineHeight: 18 },
  topProductsTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  topProductItem: { fontSize: 12, color: COLORS.primary, paddingVertical: 3 },
  closeBtn: { marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  closeBtnTxt: { fontSize: 15, fontWeight: '700', color: COLORS.darkDeep },
  addModal: { backgroundColor: COLORS.darkCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  addTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  addLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
  countryBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.dark, borderWidth: 1, borderColor: COLORS.darkBorder },
  countryBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  countryBtnTxt: { fontSize: 12, color: COLORS.textSecondary },
  input: { backgroundColor: COLORS.dark, borderRadius: 10, padding: 12, fontSize: 13, color: COLORS.textPrimary, marginBottom: 10, borderWidth: 1, borderColor: COLORS.darkBorder },
  conversionBox: { backgroundColor: COLORS.primary + '15', borderRadius: 10, padding: 10, marginBottom: 10 },
  conversionTxt: { fontSize: 14, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.dark, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder },
  cancelTxt: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  saveBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveTxt: { fontSize: 14, color: COLORS.darkDeep, fontWeight: '700' }
});
