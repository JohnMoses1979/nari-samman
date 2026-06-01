





















import { create } from 'zustand';
import {
  fetchApprovedProducts,
  fetchVendorProducts,
  createVendorProduct,
  updateVendorProductApi,
  deleteVendorProductApi,
  adminFetchProducts,
  adminApproveProductApi,
  adminRejectProductApi,
  createOrderApi,
  fetchConsumerOrdersApi,
  fetchVendorOrdersApi,
  vendorPackOrderApi,
  vendorSendToLogisticsApi,
  fetchAdminOrdersApi,
  fetchDispatchesApi,
  adminUpdateDispatchStatusApi,
  buildImageUrl,
} from '../services/api';

const DEFAULT_PRODUCT_EMOJI = '🛍️';

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function splitTags(tags) {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getProductImage(product) {
  if (!product) return null;
  if (product.image) return product.image;
  if (product.primaryImageUrl) return product.primaryImageUrl;
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }
  return null;
}

function normalizeProduct(product = {}) {
  const sellingPrice = toNumber(product.sellingPrice ?? product.price);
  const mrp = toNumber(product.mrp ?? sellingPrice);
  const image = buildImageUrl(getProductImage(product));
  const tags = splitTags(product.tags);
  const certifications = splitTags(product.certifications);

  return {
    ...product,
    id: product.id,
    name: product.name || 'Unnamed product',
    category: product.category || 'general',
    price: sellingPrice,
    sellingPrice,
    mrp,
    unit: product.unit || 'piece',
    description: product.description || '',
    stock: toNumber(product.stock, 0),
    tags,
    certifications,
    image,
    imageUrls: Array.isArray(product.imageUrls)
      ? product.imageUrls
        .map(buildImageUrl)
        .filter(Boolean)
      : image
        ? [image]
        : [],
    primaryImageUrl:
      buildImageUrl(product.primaryImageUrl) ||
      image ||
      null,
    badge: product.badge || null,
    emoji: product.emoji || DEFAULT_PRODUCT_EMOJI,
  };
}

function normalizeOrder(order = {}) {
  return {
    ...order,
    id: String(order.id),
    status: order.status || 'confirmed',
    paymentStatus: order.paymentStatus || 'pending',
    total: toNumber(order.total ?? order.totalAmount, 0),
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
        ...item,
        id: item.id ? String(item.id) : String(item.productId || ''),
        productId: item.productId,
        qty: toNumber(item.qty ?? item.quantity, 1),
        price: toNumber(item.price, 0),
        amount: toNumber(item.amount, toNumber(item.price, 0) * toNumber(item.qty ?? item.quantity, 1)),
        image: item.image || item.imageUrl || null,
        imageUrls: item.imageUrls || (item.image || item.imageUrl ? [item.image || item.imageUrl] : []),
      }))
      : [],
  };
}

function normalizeVendorOrder(order = {}) {
  return {
    ...order,
    id: String(order.id),
    consumerOrderId: order.consumerOrderId ? String(order.consumerOrderId) : null,
    qty: toNumber(order.qty ?? order.quantity, 1),
    amount: toNumber(order.amount, 0),
    status: order.status || 'confirmed',
    paymentStatus: order.paymentStatus || 'pending',
    image: order.image || order.imageUrl || null,
    imageUrls: order.imageUrls || (order.image || order.imageUrl ? [order.image || order.imageUrl] : []),
  };
}

function normalizeDispatch(dispatch = {}) {
  return {
    ...dispatch,
    id: String(dispatch.id),
    orderId: dispatch.orderId ? String(dispatch.orderId) : null,
    consumerOrderId: dispatch.consumerOrderId ? String(dispatch.consumerOrderId) : null,
    vendorOrderId: dispatch.vendorOrderId ? String(dispatch.vendorOrderId) : null,
    productNames: Array.isArray(dispatch.productNames) ? dispatch.productNames : [],
    status: dispatch.status || 'at_hub',
  };
}

// ─── Local Asset Images ───────────────────────────────────────────────────────
export const IMAGES = {
  sundarbanshoney: require('../../assets/Sundarbans Honey.jpg'),
  organicspices: require('../../assets/Organic Spices.jpg'),
  papad: require('../../assets/Papad.jpg'),
  jaggery: require('../../assets/Jaggery Products.jpg'),
  masalas: require('../../assets/Handmade Masalas.jpg'),
  bengalifood: require('../../assets/Traditional Bengali Food Products.jpg'),
  herbal: require('../../assets/Herbal Product.jpg'),
  tantSaree: require('../../assets/tant sarees.jpg'),
  baluchari: require('../../assets/Baluchari Sarees.jpg'),
  jamdani: require('../../assets/jamdani sarees.jpg'),
  bengalSilk: require('../../assets/bengal silk sarees.jpg'),
  dupattas: require('../../assets/handwoven dupattas.jpg'),
  tribalTextiles: require('../../assets/tribal textiles.jpg'),
  bambooCrafts: require('../../assets/bamboo crafts.jpg'),
  clayArtifacts: require('../../assets/clay artifacts.jpg'),
  juteProducts: require('../../assets/jute products.jpg'),
  handcraftedDecor: require('../../assets/handcrafted decorative.jpg'),
  ecoUtility: require('../../assets/eco-friendly utility.jpg'),
  handmadeGarments: require('../../assets/Handmade Garments.jpg'),
  bengaliApparel: require('../../assets/traditional bengali apparel.jpg'),
  dryFish: require('../../assets/Dry Fish.jpg'),
  mangoPickle: require('../../assets/mango_pickle.jpg'),
  bengalMustard: require('../../assets/bengal_mustard_oil.jpg'),
  dryFish2: require('../../assets/Dry Fish2.jpg'),
};

// ─── Mock Data (non-product) ──────────────────────────────────────────────────
const MOCK_ARTISANS = [
  { id: 'a1', name: 'Mamata Biswas', shg: 'Sundarbans Honey SHG', location: 'Sandeshkhali, N24PGS', avatar: '👩‍🌾', products: 12, rating: 4.8, members: 24, story: 'Mamata leads a group of 24 women who collect pure Sundarbans honey. After years of selling to middlemen at throwaway prices, Nari Samman gave them direct market access.' },
  { id: 'a2', name: 'Rekha Mondal', shg: 'Tant Weavers Collective', location: 'Nadia, West Bengal', avatar: '🧵', products: 18, rating: 4.9, members: 16, story: "Rekha's family has woven Tant sarees for 4 generations. Nari Samman helped her reach buyers across India without any middleman." },
  { id: 'a3', name: 'Priya Das', shg: 'Tribal Craft Circle', location: 'Purulia, West Bengal', avatar: '🏺', products: 9, rating: 4.7, members: 30, story: 'Priya leads a tribal craft group creating bamboo and clay artifacts that tell stories of their ancient Santhali culture.' },
  { id: 'a4', name: 'Anita Soren', shg: 'Jamdani Heritage Weavers', location: 'Murshidabad, West Bengal', avatar: '🌺', products: 22, rating: 5.0, members: 12, story: 'Anita is a master Jamdani weaver whose intricate patterns have been recognized at national textile exhibitions.' },
  { id: 'a5', name: 'Lakshmi Roy', shg: 'Baluchari Revival Group', location: 'Bishnupur, Bankura', avatar: '🦋', products: 15, rating: 4.8, members: 8, story: 'Lakshmi is reviving the near-extinct Baluchari tradition. Each saree takes 3–6 months to weave and tells Mahabharata stories in silk.' },
  { id: 'a6', name: 'Savitri Mahato', shg: 'Spice Sisters SHG', location: 'Jhargram, West Bengal', avatar: '🌶️', products: 11, rating: 4.6, members: 20, story: "Savitri's group handgrinds traditional spice blends using recipes passed down for generations. No preservatives, pure tradition." },
];

const MOCK_ORDERS = [
  { id: 'ord001', date: '2025-05-08', status: 'delivered', paymentStatus: 'paid', items: [{ productId: 'p1', qty: 2, name: 'Pure Sundarbans Forest Honey', price: 480, unit: '500g', emoji: '🍯' }, { productId: 'p9', qty: 1, name: 'Tant Saree – Crimson Border', price: 1200, unit: 'piece', emoji: '👘' }], total: 2160, address: 'Mumbai, Maharashtra', tracking: 'Delivered on May 10' },
  { id: 'ord002', date: '2025-05-06', status: 'shipped', paymentStatus: 'pending', items: [{ productId: 'p5', qty: 3, name: 'Jaggery – Palm Sugar', price: 160, unit: '1kg', emoji: '🍫' }], total: 480, address: 'Delhi, NCR', tracking: 'Out for delivery' },
  { id: 'ord003', date: '2025-05-03', status: 'packed', paymentStatus: 'pending', items: [{ productId: 'p10', qty: 1, name: 'Baluchari Silk – Mahabharata Motif', price: 8500, unit: 'piece', emoji: '🧵' }], total: 8500, address: 'Bangalore, Karnataka', tracking: 'Quality checked at warehouse' },
];

const MOCK_VENDOR_ORDERS = [
  { id: 'vo001', buyer: 'Priya S.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'confirmed', paymentStatus: 'pending', date: '2025-05-10', consumerOrderId: 'ext001', shgName: 'Tant Weavers Collective' },
  { id: 'vo002', buyer: 'Ananya M.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'packed', paymentStatus: 'pending', date: '2025-05-09', consumerOrderId: 'ext002', shgName: 'Tant Weavers Collective' },
  { id: 'vo003', buyer: 'Ritu T.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'sent_to_logistics', paymentStatus: 'pending', date: '2025-05-07', consumerOrderId: 'ext003', shgName: 'Tant Weavers Collective' },
  { id: 'vo004', buyer: 'Meena K.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'pending_payment', date: '2025-05-01', consumerOrderId: 'ext004' },
  { id: 'vo005', buyer: 'Sunita R.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'pending_payment', date: '2025-04-28', consumerOrderId: 'ext005' },
  { id: 'vo006', buyer: 'Kavita D.', item: 'Tant Dupatta – Indigo', qty: 3, amount: 1950, status: 'delivered', paymentStatus: 'paid', date: '2025-04-25', consumerOrderId: 'ext006' },
  { id: 'vo007', buyer: 'Lata P.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-22', consumerOrderId: 'ext007' },
  { id: 'vo008', buyer: 'Deepa M.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-04-20', consumerOrderId: 'ext008' },
  { id: 'vo009', buyer: 'Radha V.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-18', consumerOrderId: 'ext009' },
  { id: 'vo010', buyer: 'Pooja N.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-04-15', consumerOrderId: 'ext010' },
  { id: 'vo011', buyer: 'Asha B.', item: 'Tant Dupatta – Indigo', qty: 1, amount: 650, status: 'delivered', paymentStatus: 'paid', date: '2025-04-12', consumerOrderId: 'ext011' },
  { id: 'vo012', buyer: 'Nisha C.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-04-10', consumerOrderId: 'ext012' },
  { id: 'vo013', buyer: 'Geeta L.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-08', consumerOrderId: 'ext013' },
  { id: 'vo014', buyer: 'Mala J.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-04-05', consumerOrderId: 'ext014' },
  { id: 'vo015', buyer: 'Usha K.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'delivered', paymentStatus: 'paid', date: '2025-04-02', consumerOrderId: 'ext015' },
  { id: 'vo016', buyer: 'Rekha A.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-30', consumerOrderId: 'ext016' },
  { id: 'vo017', buyer: 'Smita H.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-27', consumerOrderId: 'ext017' },
  { id: 'vo018', buyer: 'Tara W.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-25', consumerOrderId: 'ext018' },
  { id: 'vo019', buyer: 'Poonam G.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-22', consumerOrderId: 'ext019' },
  { id: 'vo020', buyer: 'Varsha F.', item: 'Tant Dupatta – Indigo', qty: 2, amount: 1300, status: 'delivered', paymentStatus: 'paid', date: '2025-03-20', consumerOrderId: 'ext020' },
  { id: 'vo021', buyer: 'Chitra E.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-18', consumerOrderId: 'ext021' },
  { id: 'vo022', buyer: 'Jyoti D.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-15', consumerOrderId: 'ext022' },
  { id: 'vo023', buyer: 'Shalini C.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-03-12', consumerOrderId: 'ext023' },
  { id: 'vo024', buyer: 'Kamla B.', item: 'Tant Dupatta – Indigo', qty: 3, amount: 1950, status: 'delivered', paymentStatus: 'paid', date: '2025-03-10', consumerOrderId: 'ext024' },
  { id: 'vo025', buyer: 'Saroj A.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-07', consumerOrderId: 'ext025' },
  { id: 'vo026', buyer: 'Bimla Z.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-03-05', consumerOrderId: 'ext026' },
  { id: 'vo027', buyer: 'Hemlata Y.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-03-02', consumerOrderId: 'ext027' },
  { id: 'vo028', buyer: 'Indira X.', item: 'Tant Dupatta – Indigo', qty: 1, amount: 650, status: 'delivered', paymentStatus: 'paid', date: '2025-02-28', consumerOrderId: 'ext028' },
  { id: 'vo029', buyer: 'Janaki W.', item: 'Tant Saree – Crimson Border', qty: 1, amount: 1200, status: 'delivered', paymentStatus: 'paid', date: '2025-02-25', consumerOrderId: 'ext029' },
  { id: 'vo030', buyer: 'Kamala V.', item: 'Jamdani Saree – White & Gold', qty: 1, amount: 4200, status: 'delivered', paymentStatus: 'paid', date: '2025-02-22', consumerOrderId: 'ext030' },
  { id: 'vo031', buyer: 'Lalita U.', item: 'Tant Saree – Crimson Border', qty: 2, amount: 2400, status: 'delivered', paymentStatus: 'paid', date: '2025-02-18', consumerOrderId: 'ext031' },
  { id: 'vo032', buyer: 'Mamta T.', item: 'Murshidabad Silk Saree', qty: 1, amount: 3600, status: 'delivered', paymentStatus: 'paid', date: '2025-02-15', consumerOrderId: 'ext032' },
];

const MOCK_PAYOUT_REQUESTS = [
  { id: 'pr001', vendorId: 'v1', vendorName: 'Rekha Mondal', amount: 4800, status: 'paid', requestedAt: '2025-04-30', paidAt: '2025-05-01', ref: 'NS-PAY-0412', orders: ['vo006', 'vo007'] },
  { id: 'pr002', vendorId: 'v1', vendorName: 'Rekha Mondal', amount: 3600, status: 'paid', requestedAt: '2025-03-31', paidAt: '2025-04-01', ref: 'NS-PAY-0390', orders: ['vo008', 'vo009'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayDate = () => new Date().toISOString().split('T')[0];

const ORDER_TRACKING_MESSAGES = {
  confirmed: 'Order confirmed – vendor is preparing your items',
  packed: 'Items packed and quality-checked by SHG',
  sent_to_logistics: 'Handed to IS&SF logistics hub for dispatch',
  shipped: 'Your order is on the way with logistics partner',
  delivered: 'Delivered successfully – Thank you for your purchase!',
};

const DISPATCH_TO_ORDER = {
  at_hub: { consumerStatus: 'packed', vendorStatus: 'sent_to_logistics', tracking: 'Reached IS&SF logistics hub. Dispatch team is preparing shipment.', title: 'At Logistics Hub' },
  dispatched: { consumerStatus: 'shipped', vendorStatus: 'shipped', tracking: 'Dispatched from IS&SF logistics hub and handed to delivery partner.', title: 'Dispatched' },
  in_transit: { consumerStatus: 'shipped', vendorStatus: 'shipped', tracking: 'In transit to customer address. Delivery partner is moving the shipment.', title: 'In Transit' },
  delivered: { consumerStatus: 'delivered', vendorStatus: 'delivered', tracking: 'Delivered successfully – COD/payment collected and order closed.', title: 'Delivered' },
};

const makeTrackingEvent = (status, title, message, actor = 'System') => ({
  id: `track_${status}_${Date.now()}`,
  status, title, message, actor,
  date: todayDate(),
});

const appendTrackingEvent = (timeline, status, title, message, actor = 'System') => {
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  return [...safeTimeline, makeTrackingEvent(status, title, message, actor)];
};

const getRelatedConsumerOrder = (state, dispatch, vendorOrder) => {
  const consumerId = dispatch?.consumerOrderId || vendorOrder?.consumerOrderId || (String(dispatch?.orderId || '').startsWith('ord') ? dispatch.orderId : null);
  return consumerId ? state.orders.find((o) => o.id === consumerId) : null;
};

const getRelatedVendorOrders = (state, dispatch) => {
  const vendorId = dispatch?.vendorOrderId || (String(dispatch?.orderId || '').startsWith('vo') ? dispatch.orderId : null);
  if (vendorId) return state.vendorOrders.filter((o) => o.id === vendorId);
  const consumerId = dispatch?.consumerOrderId || (String(dispatch?.orderId || '').startsWith('ord') ? dispatch.orderId : null);
  if (consumerId) return state.vendorOrders.filter((o) => o.consumerOrderId === consumerId);
  return [];
};

// ─── Store ────────────────────────────────────────────────────────────────────
const useStore = create((set, get) => ({

  // ─── State ────────────────────────────────────────────────────────────────
  currentRole: null,
  currentScreen: 'Splash',
  isLoggedIn: false,

  authPasswords: {
    consumer: 'User@1234',
    vendor: 'Shg@1234',
    admin: 'Admin@1234',
  },

  language: 'en',
  pendingSHGRegistrations: [],

  user: {
    id: 'u1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    avatar: '👤',
    addresses: [
      { id: 'addr1', label: 'Home', line: '12 Park Street, Kolkata 700016', default: true },
      { id: 'addr2', label: 'Office', line: 'Salt Lake Sector V, Kolkata 700091', default: false },
    ],
  },

  vendorProfile: {
    id: 'v1',
    name: 'Rekha Mondal',
    shgName: 'Tant Weavers Collective',
    location: 'Nadia, West Bengal',
    phone: '+91 97650 12345',
    email: 'rekha@shg.in',
    kycStatus: 'verified',
    bankLinked: true,
    kycDocuments: {},
    totalOrders: 32,
    rating: 4.9,
    avatar: '🧵',
  },

  vendorOnboarding: {
    registrationId: null,
    status: 'approved',
    productSubmitted: true,
    kycSubmitted: true,
    bankSubmitted: true,
    startedAt: null,
    submittedAt: null,
    reviewedAt: null,
  },

  // Products — loaded from API, NOT from mock data
  products: [],
  productsLoading: false,
  productsError: null,

  artisans: MOCK_ARTISANS,

  // Consumer State
  cart: [],
  wishlist: [],
  orders: [],
  searchQuery: '',
  selectedCategory: 'all',

  // Vendor State
  vendorOrders: [],
  vendorProducts: [],        // loaded from API
  vendorProductsLoading: false,

  // Payment / Payout
  payoutRequests: MOCK_PAYOUT_REQUESTS,
  vendorNotifications: [],

  // Admin State
  adminProfile: {
    name: 'Devanjan Bose',
    role: 'Founder Sewak / Admin',
    organisation: 'IS&SF',
    phone: '+91 98765 00000',
    email: 'admin@narisamman.in',
    warehouse: 'Sandeshkhali, N24PGS',
  },
  adminStats: {
    totalRevenue: 8240000,
    activeSHGs: 214,
    pendingApprovals: 0,
    totalArtisans: 6000,
    productsListed: 342,
    monthlyGrowth: 23.4,
    happyCustomers: 18500,
  },
  pendingProducts: [],       // loaded from API
  allVendors: MOCK_ARTISANS,

  notifications: [
    { id: 'n1', type: 'order', message: 'Your Tant Saree order has been dispatched!', time: '2 min ago', read: false },
    { id: 'n2', type: 'promo', message: '🎉 New Baluchari collection just arrived!', time: '1 hr ago', read: false },
    { id: 'n3', type: 'offer', message: '15% off on all Sundarbans Honey today!', time: '3 hr ago', read: true },
  ],

  // ─── Derived Helpers ──────────────────────────────────────────────────────
  getTotalOrders: () => {
    const { orders, vendorOrders } = get();
    const consumerOrderIds = new Set(orders.map((o) => o.id));
    const standaloneVendorOrders = vendorOrders.filter((o) => !o.consumerOrderId || !consumerOrderIds.has(o.consumerOrderId));
    return orders.length + standaloneVendorOrders.length;
  },

  // ─── Core Actions ─────────────────────────────────────────────────────────
  setRole: (role) => set({ currentRole: role, isLoggedIn: true }),
  setScreen: (screen) => set({ currentScreen: screen }),
  logout: () => set({ currentRole: null, isLoggedIn: false, currentScreen: 'RoleSelect', cart: [], wishlist: [] }),
  setLanguage: (lang) => set({ language: lang }),

  // ─── Auth ─────────────────────────────────────────────────────────────────
  loginUser: (role, credentials) => set((state) => {
    if (role === 'consumer') {
      return { currentRole: 'consumer', isLoggedIn: true, user: { ...state.user, email: credentials.email || state.user.email } };
    } else if (role === 'vendor') {
      return { currentRole: 'vendor', isLoggedIn: true, vendorProfile: { ...state.vendorProfile, email: credentials.email || state.vendorProfile.email } };
    } else if (role === 'admin') {
      return { currentRole: 'admin', isLoggedIn: true, adminProfile: { ...state.adminProfile, email: credentials.email || state.adminProfile.email } };
    }
    return { currentRole: role, isLoggedIn: true };
  }),

  resetPassword: (role, newPassword, mobile) => {
    const normalizedRole = role === 'shg' ? 'vendor' : role || 'consumer';
    set((state) => ({
      authPasswords: { ...state.authPasswords, [normalizedRole]: newPassword },
      ...(normalizedRole === 'consumer' ? { user: { ...state.user, phone: mobile || state.user.phone } } : {}),
      ...(normalizedRole === 'vendor' ? { vendorProfile: { ...state.vendorProfile, phone: mobile || state.vendorProfile.phone } } : {}),
      ...(normalizedRole === 'admin' ? { adminProfile: { ...state.adminProfile, phone: mobile || state.adminProfile.phone } } : {}),
    }));
    return { success: true };
  },

  changePassword: (role, currentPassword, newPassword) => {
    const normalizedRole = role === 'shg' ? 'vendor' : role || 'consumer';
    const state = get();
    const savedPassword = state.authPasswords?.[normalizedRole] || '';
    if (savedPassword && currentPassword !== savedPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    set({ authPasswords: { ...state.authPasswords, [normalizedRole]: newPassword } });
    return { success: true };
  },

  loginVendorByEmail: (email) => {
    const state = get();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const currentProfileEmail = String(state.vendorProfile?.email || '').trim().toLowerCase();
    const currentOnboardingStatus = state.vendorOnboarding?.status || 'approved';
    const pendingReg = (state.pendingSHGRegistrations || []).find(
      (r) => String(r.email || '').trim().toLowerCase() === normalizedEmail && r.status === 'pending'
    );
    const dummyShg = (state.shgGroups || []).find(
      (s) => String(s.email || '').trim().toLowerCase() === normalizedEmail
    );

    if (pendingReg) {
      set({
        currentRole: 'vendor', isLoggedIn: true,
        vendorProfile: {
          ...state.vendorProfile,
          id: pendingReg.vendorId || state.vendorProfile.id,
          registrationId: pendingReg.id,
          name: pendingReg.leaderName || state.vendorProfile.name,
          shgName: pendingReg.shgName || state.vendorProfile.shgName,
          email: pendingReg.email,
          phone: pendingReg.phone || state.vendorProfile.phone,
          location: pendingReg.location || state.vendorProfile.location,
          category: pendingReg.category || state.vendorProfile.category,
          members: pendingReg.members || state.vendorProfile.members,
          kycStatus: 'submitted', bankLinked: true,
          kycDocuments: pendingReg.kycDocuments || state.vendorProfile.kycDocuments || {},
          accountHolder: pendingReg.bankDetails?.accountHolder || state.vendorProfile.accountHolder,
          accountNumber: pendingReg.bankDetails?.accountNumber || state.vendorProfile.accountNumber,
          bankName: pendingReg.bankDetails?.bankName || state.vendorProfile.bankName,
          ifsc: pendingReg.bankDetails?.ifsc || state.vendorProfile.ifsc,
          branch: pendingReg.bankDetails?.branch || state.vendorProfile.branch,
          upi: pendingReg.bankDetails?.upi || state.vendorProfile.upi,
        },
        vendorOnboarding: { registrationId: pendingReg.id, status: 'pending_admin', productSubmitted: true, kycSubmitted: true, bankSubmitted: true, startedAt: pendingReg.startedAt || null, submittedAt: pendingReg.submittedAt || null, reviewedAt: null },
      });
      return { status: 'pending_admin', message: 'Waiting for admin approval' };
    }

    if (currentProfileEmail === normalizedEmail && currentOnboardingStatus !== 'approved') {
      set({ currentRole: 'vendor', isLoggedIn: true });
      return { status: currentOnboardingStatus, message: currentOnboardingStatus === 'pending_admin' ? 'Waiting for admin approval' : 'Continue vendor registration setup' };
    }

    if (dummyShg) {
      set({
        currentRole: 'vendor', isLoggedIn: true,
        vendorProfile: { ...state.vendorProfile, id: dummyShg.id, name: dummyShg.name, shgName: dummyShg.shgName, email: dummyShg.email, phone: dummyShg.phone, location: dummyShg.location, category: dummyShg.category, members: dummyShg.members, kycStatus: 'verified', bankLinked: true, rating: dummyShg.rating, avatar: dummyShg.avatar },
        vendorOnboarding: { registrationId: null, status: 'approved', productSubmitted: true, kycSubmitted: true, bankSubmitted: true, startedAt: null, submittedAt: null, reviewedAt: null },
      });
      return { status: 'approved', message: 'Approved dummy vendor login' };
    }

    set({
      currentRole: 'vendor', isLoggedIn: true,
      vendorProfile: { ...state.vendorProfile, email: normalizedEmail },
      vendorOnboarding: { ...state.vendorOnboarding, status: 'approved', productSubmitted: true, kycSubmitted: true, bankSubmitted: true },
    });
    return { status: 'approved', message: 'Approved demo vendor login' };
  },

  registerUser: (role, data) => set((state) => {
    if (role === 'consumer') {
      return { currentRole: 'consumer', isLoggedIn: true, user: { ...state.user, name: data.name || state.user.name, email: data.email || state.user.email, phone: data.phone || state.user.phone } };
    } else if (role === 'vendor') {
      return { currentRole: 'vendor', isLoggedIn: true, vendorProfile: { ...state.vendorProfile, name: data.name || state.vendorProfile.name, shgName: data.shgName || state.vendorProfile.shgName, email: data.email || state.vendorProfile.email, phone: data.phone || state.vendorProfile.phone, location: data.location || state.vendorProfile.location, kycStatus: 'pending', bankLinked: false } };
    }
    return { currentRole: role, isLoggedIn: true };
  }),

  // ─── Profile ──────────────────────────────────────────────────────────────
  updateUserProfile: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),

  addUserAddress: (address) => {
    const newAddress = { id: address?.id || `addr${Date.now()}`, label: address?.label || 'Address', line: address?.line || '', default: Boolean(address?.default) };
    set((state) => {
      const existing = state.user.addresses || [];
      const shouldDefault = newAddress.default || existing.length === 0;
      return { user: { ...state.user, addresses: [...existing.map((a) => shouldDefault ? { ...a, default: false } : a), { ...newAddress, default: shouldDefault }] } };
    });
    return newAddress;
  },

  removeUserAddress: (addressId) => set((state) => {
    const remaining = (state.user.addresses || []).filter((a) => a.id !== addressId);
    const hasDefault = remaining.some((a) => a.default);
    return { user: { ...state.user, addresses: hasDefault || remaining.length === 0 ? remaining : remaining.map((a, index) => ({ ...a, default: index === 0 })) } };
  }),

  setDefaultUserAddress: (addressId) => set((state) => ({
    user: { ...state.user, addresses: (state.user.addresses || []).map((a) => ({ ...a, default: a.id === addressId })) },
  })),

  updateVendorProfile: (updates) => set((state) => ({ vendorProfile: { ...state.vendorProfile, ...updates } })),

  markVendorOnboardingStep: (step) => set((state) => ({ vendorOnboarding: { ...state.vendorOnboarding, [step]: true } })),

  updateAdminProfile: (updates) => set((state) => ({ adminProfile: { ...state.adminProfile, ...updates } })),

  // ─── SHG Management ───────────────────────────────────────────────────────
  shgGroups: [
    { id: 'shg1', name: 'Mamata Biswas', shgName: 'Sundarbans Honey SHG', location: 'Sandeshkhali, N24PGS', phone: '+91 98765 11111', email: 'mamata@shg.in', avatar: '👩‍🌾', products: 12, rating: 4.8, members: 24, kycStatus: 'verified', isActive: true, joinedDate: '2024-01-15', bankLinked: true, totalRevenue: 48000, category: 'food', story: 'Mamata leads a group of 24 women who collect pure Sundarbans honey.', employees: [{ id: 'e1a', name: 'Pushpa Das', role: 'Honey Collector', phone: '+91 98001 11001', joinedDate: '2024-02-01' }, { id: 'e1b', name: 'Rekha Baidya', role: 'Quality Checker', phone: '+91 98001 11002', joinedDate: '2024-02-10' }, { id: 'e1c', name: 'Saraswati Manna', role: 'Packer', phone: '+91 98001 11003', joinedDate: '2024-03-01' }, { id: 'e1d', name: 'Bina Halder', role: 'Logistics Handler', phone: '+91 98001 11004', joinedDate: '2024-03-15' }] },
    { id: 'shg2', name: 'Rekha Mondal', shgName: 'Tant Weavers Collective', location: 'Nadia, West Bengal', phone: '+91 97650 12345', email: 'rekha@shg.in', avatar: '🧵', products: 18, rating: 4.9, members: 16, kycStatus: 'verified', isActive: true, joinedDate: '2024-02-01', bankLinked: true, totalRevenue: 125000, category: 'textiles', story: "Rekha's family has woven Tant sarees for 4 generations.", employees: [{ id: 'e2a', name: 'Sulekha Sen', role: 'Master Weaver', phone: '+91 97001 22001', joinedDate: '2024-02-05' }, { id: 'e2b', name: 'Mina Pal', role: 'Dyer', phone: '+91 97001 22002', joinedDate: '2024-02-15' }, { id: 'e2c', name: 'Rupa Ghosh', role: 'Finisher', phone: '+91 97001 22003', joinedDate: '2024-03-01' }] },
    { id: 'shg3', name: 'Priya Das', shgName: 'Tribal Craft Circle', location: 'Purulia, West Bengal', phone: '+91 94501 23456', email: 'priya@shg.in', avatar: '🏺', products: 9, rating: 4.7, members: 30, kycStatus: 'verified', isActive: true, joinedDate: '2024-03-10', bankLinked: true, totalRevenue: 32000, category: 'crafts', story: 'Priya leads a tribal craft group creating bamboo and clay artifacts.', employees: [{ id: 'e3a', name: 'Champa Soren', role: 'Bamboo Craftsperson', phone: '+91 94001 33001', joinedDate: '2024-03-20' }, { id: 'e3b', name: 'Jharna Tudu', role: 'Clay Artist', phone: '+91 94001 33002', joinedDate: '2024-04-01' }, { id: 'e3c', name: 'Binita Murmu', role: 'Painter', phone: '+91 94001 33003', joinedDate: '2024-04-10' }, { id: 'e3d', name: 'Sushila Hembram', role: 'Packer', phone: '+91 94001 33004', joinedDate: '2024-04-15' }, { id: 'e3e', name: 'Tara Besra', role: 'Stock Manager', phone: '+91 94001 33005', joinedDate: '2024-05-01' }] },
    { id: 'shg4', name: 'Anita Soren', shgName: 'Jamdani Heritage Weavers', location: 'Murshidabad, West Bengal', phone: '+91 93456 78901', email: 'anita@shg.in', avatar: '🌺', products: 22, rating: 5.0, members: 12, kycStatus: 'verified', isActive: true, joinedDate: '2024-04-05', bankLinked: true, totalRevenue: 210000, category: 'textiles', story: 'Anita is a master Jamdani weaver.', employees: [{ id: 'e4a', name: 'Kohinoor Begum', role: 'Lead Weaver', phone: '+91 93001 44001', joinedDate: '2024-04-10' }, { id: 'e4b', name: 'Nasrin Khatun', role: 'Thread Specialist', phone: '+91 93001 44002', joinedDate: '2024-04-20' }, { id: 'e4c', name: 'Farida Bibi', role: 'Quality Control', phone: '+91 93001 44003', joinedDate: '2024-05-01' }] },
    { id: 'shg5', name: 'Lakshmi Roy', shgName: 'Baluchari Revival Group', location: 'Bishnupur, Bankura', phone: '+91 92345 67890', email: 'lakshmi@shg.in', avatar: '🦋', products: 15, rating: 4.8, members: 8, kycStatus: 'pending', isActive: false, joinedDate: '2024-05-12', bankLinked: false, totalRevenue: 0, category: 'textiles', story: 'Lakshmi is reviving the near-extinct Baluchari tradition.', employees: [{ id: 'e5a', name: 'Shyama Karmakar', role: 'Silk Weaver', phone: '+91 92001 55001', joinedDate: '2024-05-20' }, { id: 'e5b', name: 'Gita Roy', role: 'Design Artist', phone: '+91 92001 55002', joinedDate: '2024-06-01' }] },
    { id: 'shg6', name: 'Savitri Mahato', shgName: 'Spice Sisters SHG', location: 'Jhargram, West Bengal', phone: '+91 91234 56789', email: 'savitri@shg.in', avatar: '🌶️', products: 11, rating: 4.6, members: 20, kycStatus: 'pending', isActive: false, joinedDate: '2024-06-20', bankLinked: false, totalRevenue: 0, category: 'food', story: "Savitri's group handgrinds traditional spice blends.", employees: [{ id: 'e6a', name: 'Durga Mahato', role: 'Spice Grinder', phone: '+91 91001 66001', joinedDate: '2024-07-01' }, { id: 'e6b', name: 'Kamla Munda', role: 'Packer', phone: '+91 91001 66002', joinedDate: '2024-07-10' }, { id: 'e6c', name: 'Phulo Oraon', role: 'Quality Checker', phone: '+91 91001 66003', joinedDate: '2024-07-15' }] },
  ],

  startSHGRegistration: (data) => set((state) => {
    const registrationId = `shgreg_${Date.now()}`;
    const catMap = { 'Food & Agriculture': 'food', 'Textiles & Weaving': 'textiles', 'Crafts & Handicrafts': 'crafts', 'Herbal & Wellness': 'food', 'Other': 'crafts' };
    const cat = catMap[data.category] || 'crafts';
    const emojiMap = { food: '🌿', textiles: '🧵', crafts: '🏺' };
    const today = new Date().toISOString().split('T')[0];
    return {
      currentRole: 'vendor', isLoggedIn: true,
      vendorProfile: { ...state.vendorProfile, id: `vendor_${Date.now()}`, registrationId, name: data.leaderName || 'New Vendor', shgName: data.shgName || 'New SHG', email: data.email || '', phone: data.phone || '', mobileVerified: Boolean(data.mobileVerified), location: data.location || '', category: data.category || '', members: parseInt(data.members) || 0, kycStatus: 'pending', bankLinked: false, rating: 0, avatar: emojiMap[cat] || '👩‍🌾', kycDocuments: {}, identityProofPhoto: '', shgCertificatePhoto: '', addressProofPhoto: '', panOrRegistrationPhoto: '', kycNote: '', accountHolder: data.leaderName || '', accountNumber: '', bankName: '', ifsc: '', branch: '', upi: '', bio: '' },
      vendorProducts: [], vendorOrders: [],
      vendorNotifications: [{ id: `notif_${Date.now()}`, type: 'onboarding', message: 'Welcome! Complete Product Details, KYC Documents, and Bank Details, then submit for admin approval.', time: 'Just now', read: false }, ...state.vendorNotifications],
      vendorOnboarding: { registrationId, status: 'draft', productSubmitted: false, kycSubmitted: false, bankSubmitted: false, startedAt: today, submittedAt: null, reviewedAt: null },
    };
  }),

  submitVendorForAdminApproval: () => set((state) => {
    const onboarding = state.vendorOnboarding || {};
    const profile = state.vendorProfile || {};
    const registrationId = onboarding.registrationId || profile.registrationId || `shgreg_${Date.now()}`;
    const alreadyPending = state.pendingSHGRegistrations.some((r) => r.id === registrationId && r.status === 'pending');
    const today = new Date().toISOString().split('T')[0];
    const newReg = { id: registrationId, leaderName: profile.name, shgName: profile.shgName, email: profile.email, phone: profile.phone, location: profile.location, category: profile.category, members: parseInt(profile.members) || 0, mobileVerified: Boolean(profile.mobileVerified), productSubmitted: true, kycSubmitted: true, bankSubmitted: true, vendorId: profile.id, kycDocuments: profile.kycDocuments || {}, bankDetails: { accountHolder: profile.accountHolder, accountNumber: profile.accountNumber, bankName: profile.bankName, ifsc: profile.ifsc, branch: profile.branch, upi: profile.upi }, submittedAt: today, status: 'pending' };
    return {
      pendingSHGRegistrations: alreadyPending ? state.pendingSHGRegistrations : [newReg, ...state.pendingSHGRegistrations],
      vendorOnboarding: { ...onboarding, registrationId, status: 'pending_admin', productSubmitted: true, kycSubmitted: true, bankSubmitted: true, submittedAt: today },
      vendorNotifications: [{ id: `notif_${Date.now()}`, type: 'approval', message: 'Your vendor registration is submitted. Waiting for admin approval.', time: 'Just now', read: false }, ...state.vendorNotifications],
      adminStats: { ...state.adminStats, pendingApprovals: alreadyPending ? state.adminStats.pendingApprovals : state.adminStats.pendingApprovals + 1 },
    };
  }),

  submitSHGRegistration: (data) => set((state) => {
    const newReg = { id: `shgreg_${Date.now()}`, leaderName: data.leaderName, shgName: data.shgName, email: data.email, phone: data.phone, location: data.location, category: data.category, members: parseInt(data.members) || 0, mobileVerified: Boolean(data.mobileVerified), submittedAt: new Date().toISOString().split('T')[0], status: 'pending' };
    return { pendingSHGRegistrations: [newReg, ...state.pendingSHGRegistrations], adminStats: { ...state.adminStats, pendingApprovals: state.adminStats.pendingApprovals + 1 } };
  }),

  approveSHGRegistration: (regId) => set((state) => {
    const reg = state.pendingSHGRegistrations.find((r) => r.id === regId);
    if (!reg) return {};
    const catMap = { 'Food & Agriculture': 'food', 'Textiles & Weaving': 'textiles', 'Crafts & Handicrafts': 'crafts', 'Herbal & Wellness': 'food', 'Other': 'crafts' };
    const emojiMap = { food: '🌿', textiles: '🧵', crafts: '🏺' };
    const cat = catMap[reg.category] || 'crafts';
    const newSHG = { id: `shg_${regId}`, name: reg.leaderName, shgName: reg.shgName, location: reg.location, phone: reg.phone, email: reg.email, mobileVerified: Boolean(reg.mobileVerified), avatar: emojiMap[cat] || '👩‍🌾', products: 0, rating: 0, members: reg.members, kycStatus: 'verified', kycDocuments: reg.kycDocuments || {}, bankDetails: reg.bankDetails || {}, isActive: true, joinedDate: new Date().toISOString().split('T')[0], bankLinked: true, totalRevenue: 0, category: cat, story: `${reg.leaderName} leads ${reg.shgName}, recently onboarded to Nari Samman.`, employees: [] };
    const isCurrentVendor = state.vendorOnboarding?.registrationId === regId || state.vendorProfile?.email === reg.email;
    const reviewedAt = new Date().toISOString().split('T')[0];
    return {
      pendingSHGRegistrations: state.pendingSHGRegistrations.map((r) => r.id === regId ? { ...r, status: 'approved' } : r),
      shgGroups: [newSHG, ...state.shgGroups],
      vendorProfile: isCurrentVendor ? { ...state.vendorProfile, kycStatus: 'verified', bankLinked: true, rating: state.vendorProfile.rating || 0 } : state.vendorProfile,
      vendorOnboarding: isCurrentVendor ? { ...state.vendorOnboarding, status: 'approved', reviewedAt } : state.vendorOnboarding,
      vendorNotifications: isCurrentVendor ? [{ id: `notif_${Date.now()}`, type: 'approval', message: 'Congratulations! Admin approved your vendor registration.', time: 'Just now', read: false }, ...state.vendorNotifications] : state.vendorNotifications,
      adminStats: { ...state.adminStats, activeSHGs: state.adminStats.activeSHGs + 1, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) },
    };
  }),

  rejectSHGRegistration: (regId, reason) => set((state) => {
    const isCurrentVendor = state.vendorOnboarding?.registrationId === regId;
    return {
      pendingSHGRegistrations: state.pendingSHGRegistrations.map((r) => r.id === regId ? { ...r, status: 'rejected', rejectionReason: reason || 'Rejected by admin' } : r),
      vendorOnboarding: isCurrentVendor ? { ...state.vendorOnboarding, status: 'rejected', reviewedAt: new Date().toISOString().split('T')[0], rejectionReason: reason || 'Rejected by admin' } : state.vendorOnboarding,
      vendorNotifications: isCurrentVendor ? [{ id: `notif_${Date.now()}`, type: 'approval', message: reason || 'Your vendor registration was rejected by admin.', time: 'Just now', read: false }, ...state.vendorNotifications] : state.vendorNotifications,
      adminStats: { ...state.adminStats, pendingApprovals: Math.max(0, state.adminStats.pendingApprovals - 1) },
    };
  }),

  toggleSHGStatus: (shgId) => set((state) => ({ shgGroups: state.shgGroups.map((s) => s.id === shgId ? { ...s, isActive: !s.isActive } : s) })),
  updateSHGKYC: (shgId, status) => set((state) => ({ shgGroups: state.shgGroups.map((s) => s.id === shgId ? { ...s, kycStatus: status } : s) })),

  // ─── Warehouse / Logistics ─────────────────────────────────────────────────
  warehouseStock: [
    { id: 'ws1', productName: 'Sundarbans Forest Honey', shgName: 'Sundarbans Honey SHG', category: 'food', qty: 45, unit: '500g jars', qualityStatus: 'approved', receivedDate: '2025-05-08', location: 'Rack A-3' },
    { id: 'ws2', productName: 'Tant Saree – Crimson Border', shgName: 'Tant Weavers Collective', category: 'textiles', qty: 22, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-07', location: 'Rack B-1' },
    { id: 'ws3', productName: 'Palm Jaggery', shgName: 'Spice Sisters SHG', category: 'food', qty: 60, unit: '1kg packs', qualityStatus: 'quality_check', receivedDate: '2025-05-10', location: 'Dock Area' },
    { id: 'ws4', productName: 'Bamboo Fruit Basket', shgName: 'Tribal Craft Circle', category: 'crafts', qty: 50, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-06', location: 'Rack C-2' },
    { id: 'ws5', productName: 'Jamdani Saree – White & Gold', shgName: 'Jamdani Heritage Weavers', category: 'textiles', qty: 8, unit: 'pieces', qualityStatus: 'approved', receivedDate: '2025-05-09', location: 'Rack B-3' },
    { id: 'ws6', productName: 'Organic Turmeric Powder', shgName: 'Spice Sisters SHG', category: 'food', qty: 150, unit: '200g packs', qualityStatus: 'rejected', receivedDate: '2025-05-11', location: 'Rejected Bin', rejectionReason: 'Failed moisture content test' },
  ],

  updateWarehouseItemStatus: (id, status, reason) => set((state) => ({
    warehouseStock: state.warehouseStock.map((w) => w.id === id ? { ...w, qualityStatus: status, rejectionReason: reason || w.rejectionReason } : w),
  })),

  dispatches: [],

  updateDispatchStatus: async (id, status) => {
    const data = await adminUpdateDispatchStatusApi(id, status);
    const updatedDispatch = data?.dispatch ? normalizeDispatch(data.dispatch) : null;
    set((state) => ({
      dispatches: updatedDispatch
        ? state.dispatches.map((d) => (d.id === updatedDispatch.id ? updatedDispatch : d))
        : state.dispatches,
    }));
    await Promise.all([get().loadAdminOrders(), get().loadDispatches()]);
    return updatedDispatch;
  },

  // ─── Cart ──────────────────────────────────────────────────────────────────
  addToCart: (product, qty = 1) => set((state) => {
    const normalized = normalizeProduct(product);
    const existing = state.cart.find((i) => String(i.id) === String(normalized.id));
    if (existing) {
      return {
        cart: state.cart.map((i) => (String(i.id) === String(normalized.id)
          ? { ...normalizeProduct(i), ...normalized, qty: i.qty + qty }
          : i)),
      };
    }
    return { cart: [...state.cart, { ...normalized, qty: Math.max(1, qty) }] };
  }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((i) => String(i.id) !== String(productId)) })),
  updateCartQty: (productId, qty) => set((state) => ({ cart: qty <= 0 ? state.cart.filter((i) => String(i.id) !== String(productId)) : state.cart.map((i) => String(i.id) === String(productId) ? { ...i, qty } : i) })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => get().cart.reduce((sum, item) => sum + toNumber(item.price) * toNumber(item.qty, 1), 0),
  getCartCount: () => get().cart.reduce((sum, i) => sum + toNumber(i.qty, 1), 0),

  // ─── Wishlist ──────────────────────────────────────────────────────────────
  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.find((i) => i.id === product.id);
    return { wishlist: exists ? state.wishlist.filter((i) => i.id !== product.id) : [...state.wishlist, product] };
  }),
  isWishlisted: (productId) => get().wishlist.some((i) => i.id === productId),

  // ─── Search & Filter ───────────────────────────────────────────────────────
  setSearch: (query) => set({ searchQuery: query }),
  setCategory: (cat) => set({ selectedCategory: cat }),
  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory } = get();
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags?.some((t) => t.includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  },

  // ─── Orders ────────────────────────────────────────────────────────────────
  loadConsumerOrders: async (consumerId) => {
    if (!consumerId || Number.isNaN(Number(consumerId))) return [];
    const data = await fetchConsumerOrdersApi(consumerId);
    const orders = (data.orders || []).map(normalizeOrder);
    set({ orders });
    return orders;
  },

  loadVendorOrders: async (vendorId) => {
    if (!vendorId || Number.isNaN(Number(vendorId))) return [];
    const data = await fetchVendorOrdersApi(vendorId);
    const vendorOrders = (data.vendorOrders || []).map(normalizeVendorOrder);
    set({ vendorOrders });
    return vendorOrders;
  },

  loadAdminOrders: async () => {
    const data = await fetchAdminOrdersApi();
    const orders = (data.orders || []).map(normalizeOrder);
    const vendorOrders = (data.vendorOrders || []).map(normalizeVendorOrder);
    set({ orders, vendorOrders });
    return { orders, vendorOrders };
  },

  loadDispatches: async () => {
    const data = await fetchDispatchesApi();
    const dispatches = (data.dispatches || []).map(normalizeDispatch);
    set({ dispatches });
    return dispatches;
  },

  placeOrder: async (address, options = {}) => {
    const state = get();
    if (!state.cart.length) {
      throw new Error('Cart is empty.');
    }

    const payload = {
      buyerName: state.user?.name || 'Consumer',
      buyerPhone: state.user?.phone || '',
      deliveryAddress: address,
      paymentMethod: options.paymentMethod || 'UPI',
      paymentStatus: options.paymentStatus || 'paid',
      paymentReference: options.paymentReference || null,
      totalAmount: state.cart.reduce((sum, i) => sum + toNumber(i.price) * toNumber(i.qty, 1), 0),
      items: state.cart.map((i) => ({
        productId: Number(i.id),
        vendorId: Number(i.vendorId),
        name: i.name,
        quantity: toNumber(i.qty, 1),
        unit: i.unit,
        price: toNumber(i.price),
        imageUrl: i.image || i.primaryImageUrl || null,
      })),
    };

    const data = await createOrderApi(payload);
    const order = normalizeOrder(data.order);
    set((current) => ({
      orders: [order, ...current.orders.filter((o) => o.id !== order.id)],
      cart: [],
      adminStats: { ...current.adminStats, totalRevenue: current.adminStats.totalRevenue + order.total },
    }));
    return order;
  },

  updateOrderStatus: async (vendorOrderId, newStatus) => {
    if (newStatus !== 'packed') {
      return null;
    }
    const vendorId = get().vendorProfile?.id;
    const data = await vendorPackOrderApi(vendorId, vendorOrderId);
    const updatedOrder = data?.vendorOrder ? normalizeVendorOrder(data.vendorOrder) : null;
    set((state) => ({
      vendorOrders: updatedOrder
        ? state.vendorOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        : state.vendorOrders,
    }));
    return updatedOrder;
  },

  shgSendToLogistics: async (vendorOrderId) => {
    const vendorId = get().vendorProfile?.id;
    const data = await vendorSendToLogisticsApi(vendorId, vendorOrderId);
    const updatedOrder = data?.vendorOrder ? normalizeVendorOrder(data.vendorOrder) : null;
    set((state) => ({
      vendorOrders: updatedOrder
        ? state.vendorOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        : state.vendorOrders,
    }));
    return updatedOrder;
  },

  // ─── Payouts ───────────────────────────────────────────────────────────────
  requestPayout: (orderIds) => set((state) => {
    const eligibleOrders = state.vendorOrders.filter((o) => orderIds.includes(o.id) && o.status === 'delivered' && o.paymentStatus === 'pending_payment');
    if (eligibleOrders.length === 0) return {};
    const totalAmount = eligibleOrders.reduce((s, o) => s + o.amount, 0);
    const newRequest = { id: `pr_${Date.now()}`, vendorId: state.vendorProfile.id, vendorName: state.vendorProfile.name, amount: totalAmount, status: 'requested', requestedAt: new Date().toISOString().split('T')[0], paidAt: null, ref: null, orders: orderIds };
    return { payoutRequests: [newRequest, ...state.payoutRequests], vendorOrders: state.vendorOrders.map((o) => orderIds.includes(o.id) ? { ...o, paymentStatus: 'payout_requested' } : o) };
  }),

  approvePayoutRequest: (requestId) => set((state) => {
    const request = state.payoutRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'requested') return {};
    const refCode = `NS-PAY-${Date.now().toString().slice(-4)}`;
    return {
      payoutRequests: state.payoutRequests.map((r) => r.id === requestId ? { ...r, status: 'paid', paidAt: new Date().toISOString().split('T')[0], ref: refCode } : r),
      vendorOrders: state.vendorOrders.map((o) => request.orders.includes(o.id) ? { ...o, paymentStatus: 'paid' } : o),
      adminStats: { ...state.adminStats },
      vendorNotifications: [{ id: `vn_${Date.now()}`, type: 'payment', message: `💰 Payment of ₹${request.amount.toLocaleString()} credited to your bank account! Ref: ${refCode}`, time: 'Just now', read: false, amount: request.amount, ref: refCode }, ...state.vendorNotifications],
    };
  }),

  rejectPayoutRequest: (requestId, reason) => set((state) => {
    const request = state.payoutRequests.find((r) => r.id === requestId);
    if (!request) return {};
    return {
      payoutRequests: state.payoutRequests.map((r) => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason || 'Request rejected by admin' } : r),
      vendorOrders: state.vendorOrders.map((o) => request.orders.includes(o.id) ? { ...o, paymentStatus: 'pending_payment' } : o),
      vendorNotifications: [{ id: `vn_${Date.now()}`, type: 'payment_rejected', message: `⚠️ Payout request of ₹${request.amount.toLocaleString()} was not processed. ${reason || 'Please contact admin.'}`, time: 'Just now', read: false }, ...state.vendorNotifications],
    };
  }),

  markVendorNotifRead: (id) => set((state) => ({ vendorNotifications: state.vendorNotifications.map((n) => n.id === id ? { ...n, read: true } : n) })),

  // ─── Notifications ─────────────────────────────────────────────────────────
  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  getUnreadCount: () => get().notifications.filter((n) => !n.read).length,

  // ─── Product Actions (API-backed) ──────────────────────────────────────────

  // Consumer: load approved products from backend
  loadApprovedProducts: async (category) => {
    set({ productsLoading: true, productsError: null });
    try {
      const data = await fetchApprovedProducts(category);
      set({ products: (data.products || []).map(normalizeProduct), productsLoading: false });
    } catch (err) {
      // On error, silently fail — don't crash the screen, just show empty
      set({ productsError: err.message, productsLoading: false, products: [] });
    }
  },

  // Vendor: load own products from backend
  loadVendorProducts: async (vendorId) => {
    set({ vendorProductsLoading: true });
    try {
      const data = await fetchVendorProducts(vendorId);
      set({ vendorProducts: (data.products || []).map(normalizeProduct), vendorProductsLoading: false });
    } catch (err) {
      set({ vendorProductsLoading: false });
      throw err;
    }
  },

  // Vendor: submit new product
  addProductToPending: async (vendorId, formData, imageFiles) => {
    const data = await createVendorProduct(vendorId, formData, imageFiles);
    try {
      const refresh = await fetchVendorProducts(vendorId);
      set({ vendorProducts: (refresh.products || []).map(normalizeProduct) });
    } catch {
      // Keep the submission successful even if the immediate refresh fails on mobile.
      set((state) => {
        const nextProduct = data?.product ? normalizeProduct(data.product) : null;
        const next = nextProduct ? [nextProduct, ...state.vendorProducts.filter((p) => p.id !== nextProduct.id)] : state.vendorProducts;
        return { vendorProducts: next };
      });
    }
    return normalizeProduct(data.product);
  },

  // Vendor: update product
  updateVendorProduct: async (vendorId, productId, formData, newImageFiles, deleteImageIds) => {
    const data = await updateVendorProductApi(vendorId, productId, formData, newImageFiles, deleteImageIds);
    try {
      const refresh = await fetchVendorProducts(vendorId);
      set({ vendorProducts: (refresh.products || []).map(normalizeProduct) });
    } catch {
      // Preserve the updated product locally if the refresh fails.
      set((state) => ({
        vendorProducts: state.vendorProducts.map((p) => (p.id === productId ? normalizeProduct(data?.product || p) : p)),
      }));
    }
    return normalizeProduct(data.product);
  },

  // Vendor: delete product
  removeVendorProduct: async (vendorId, productId) => {
    await deleteVendorProductApi(vendorId, productId);
    set((state) => ({ vendorProducts: state.vendorProducts.filter((p) => p.id !== productId) }));
  },

  // Admin: load pending products from backend
  loadAdminProducts: async (status) => {
    try {
      const data = await adminFetchProducts(status);
      // normalizeProduct() applies buildImageUrl() to primaryImageUrl and imageUrls
      // — same as loadApprovedProducts and loadVendorProducts already do.
      const allNormalized = (data.products || []).map(normalizeProduct);
      const pending = allNormalized.filter((p) => p.status === 'PENDING');
      set((state) => ({
        pendingProducts: pending,
        adminStats: { ...state.adminStats, pendingApprovals: data.pendingCount || pending.length },
      }));
      return allNormalized;
    } catch (err) {
      throw err;
    }
  },

  // Admin: approve product
  approveProduct: async (productId, badge) => {
    await adminApproveProductApi(productId, badge || null);
    set((state) => ({
      pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
      adminStats: { ...state.adminStats, pendingApprovals: Math.max(0, (state.adminStats.pendingApprovals || 1) - 1) },
    }));
  },

  // Admin: reject product
  rejectProduct: async (productId, reason) => {
    if (!reason || !reason.trim()) throw new Error('Rejection reason is required.');
    await adminRejectProductApi(productId, reason.trim());
    set((state) => ({
      pendingProducts: state.pendingProducts.filter((p) => p.id !== productId),
      adminStats: { ...state.adminStats, pendingApprovals: Math.max(0, (state.adminStats.pendingApprovals || 1) - 1) },
    }));
  },

}));

export default useStore;
