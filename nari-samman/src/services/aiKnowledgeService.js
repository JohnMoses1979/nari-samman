import useStore from '../store/useStore';
import { fetchAddresses, fetchConsumerProfile } from './api';
import { getConsumerId } from '../storage/authStorage';

const STOP_WORDS = new Set([
  'what',
  'when',
  'where',
  'which',
  'tell',
  'show',
  'help',
  'please',
  'could',
  'would',
  'want',
  'need',
  'order',
  'orders',
  'product',
  'products',
  'price',
  'status',
  'my',
  'the',
  'a',
  'an',
  'is',
  'are',
  'for',
  'with',
  'from',
  'this',
  'that',
  'me',
  'you',
  'your',
  'under',
  'below',
  'within',
  'budget',
]);

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s₹]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTokens(queryText) {
  return normalizeText(queryText)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getMoneyValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function formatAddressLine(address) {
  if (!address) return null;
  if (typeof address === 'string') return address;
  return address.line || address.address || address.fullAddress || null;
}

function formatList(values, emptyText = 'none') {
  const items = safeArray(values).filter(Boolean);
  return items.length ? items.join(', ') : emptyText;
}

function findBestMatches(items, queryText, keys, limit = 3) {
  const tokens = extractTokens(queryText);
  const normalizedQuery = normalizeText(queryText);

  return safeArray(items)
    .map((item) => {
      const haystack = normalizeText(keys.map((key) => item?.[key]).filter(Boolean).join(' '));
      if (!haystack) return null;

      let score = 0;
      tokens.forEach((token) => {
        if (haystack.includes(token)) score += 2;
      });

      if (normalizedQuery && haystack.includes(normalizedQuery)) score += 4;
      if (getMoneyValue(item?.price) !== null && /under|below|budget|within/i.test(queryText)) score += 1;
      if (score === 0) return null;

      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

function summarizeUser(user) {
  if (!user) return { exists: false };

  return {
    exists: true,
    id: user.id || null,
    name: user.name || user.fullName || null,
    email: user.email || null,
    phone: user.phone || null,
    avatar: user.avatar || null,
    addressCount: safeArray(user.addresses).length,
    defaultAddress: formatAddressLine(safeArray(user.addresses).find((address) => address?.default) || safeArray(user.addresses)[0]),
  };
}

function summarizeAddresses(addresses) {
  const list = safeArray(addresses);

  return {
    count: list.length,
    defaultAddress: formatAddressLine(list.find((address) => address?.default) || list[0]),
    items: list.slice(0, 3).map((address) => ({
      id: address?.id || null,
      label: address?.label || 'Address',
      line: formatAddressLine(address),
      city: address?.city || null,
      pincode: address?.pincode || null,
      default: Boolean(address?.default),
    })),
  };
}

function summarizeOrders(orders, queryText) {
  const list = safeArray(orders);
  const latest = list[0] || null;
  const active = list.find((order) => !['delivered', 'cancelled'].includes(normalizeText(order?.status))) || null;
  const matching = findBestMatches(
    list,
    queryText,
    ['id', 'status', 'tracking', 'trackingStatus', 'deliveryStatus', 'items', 'item', 'name'],
    3
  );

  return {
    count: list.length,
    latest: latest ? {
      id: latest.id || null,
      status: latest.status || null,
      tracking: latest.tracking || latest.trackingStatus || null,
      total: latest.total || latest.amount || null,
      date: latest.date || null,
      itemCount: safeArray(latest.items).length || null,
      items: safeArray(latest.items).slice(0, 3).map((item) => item?.name || item?.productName || item?.title).filter(Boolean),
    } : null,
    active: active ? {
      id: active.id || null,
      status: active.status || null,
      tracking: active.tracking || active.trackingStatus || null,
      total: active.total || active.amount || null,
    } : null,
    matching: matching.map((order) => ({
      id: order.id || null,
      status: order.status || null,
      tracking: order.tracking || order.trackingStatus || null,
      total: order.total || order.amount || null,
      itemCount: safeArray(order.items).length || null,
    })),
  };
}

function summarizeProducts(products, queryText) {
  const list = safeArray(products);
  const matches = findBestMatches(
    list,
    queryText,
    ['name', 'productName', 'title', 'category', 'description', 'tags', 'shgName', 'item'],
    6
  );

  return {
    count: list.length,
    matches: matches.map((product) => ({
      id: product.id || null,
      name: product.name || product.productName || product.title || null,
      price: product.price ?? product.amount ?? product.value ?? null,
      stock: product.stock ?? product.qty ?? null,
      category: product.category || null,
      shgName: product.shgName || null,
      rating: product.rating ?? null,
      tags: safeArray(product.tags).slice(0, 5),
      description: product.description || null,
    })),
    sample: list.slice(0, 3).map((product) => ({
      id: product.id || null,
      name: product.name || product.productName || product.title || null,
      price: product.price ?? product.amount ?? product.value ?? null,
      stock: product.stock ?? product.qty ?? null,
      category: product.category || null,
    })),
  };
}

function summarizeWishlist(wishlist) {
  const list = safeArray(wishlist);
  return {
    count: list.length,
    items: list.slice(0, 5).map((item) => ({
      id: item?.id || null,
      name: item?.name || item?.productName || item?.title || null,
      price: item?.price ?? item?.amount ?? null,
      category: item?.category || null,
    })),
  };
}

function summarizeCart(cart) {
  const list = safeArray(cart);
  const totalQty = list.reduce((sum, item) => sum + Number(item?.qty || 0), 0);
  const totalAmount = list.reduce((sum, item) => sum + Number(item?.qty || 0) * Number(item?.price || 0), 0);

  return {
    count: list.length,
    totalQty,
    totalAmount,
    items: list.slice(0, 5).map((item) => ({
      id: item?.id || null,
      name: item?.name || item?.productName || item?.title || null,
      qty: Number(item?.qty || 0),
      price: Number(item?.price || 0),
    })),
  };
}

function summarizeNotifications(notifications) {
  const list = safeArray(notifications);
  return {
    count: list.length,
    unreadCount: list.filter((item) => !item?.read).length,
    latest: list[0]
      ? {
          id: list[0].id || null,
          type: list[0].type || null,
          message: list[0].message || null,
          read: Boolean(list[0].read),
        }
      : null,
  };
}

function summarizeMarketplace(state, queryText) {
  const shgGroups = safeArray(state.shgGroups);
  const artisans = safeArray(state.artisans);
  const warehouseStock = safeArray(state.warehouseStock);
  const vendors = safeArray(state.vendors);

  const shgMatches = findBestMatches(
    [...shgGroups, ...artisans],
    queryText,
    ['shgName', 'name', 'location', 'category', 'story', 'email', 'products'],
    4
  );

  const warehouseMatches = findBestMatches(
    warehouseStock,
    queryText,
    ['productName', 'shgName', 'category', 'location', 'qualityStatus'],
    4
  );

  const vendorMatches = findBestMatches(
    vendors,
    queryText,
    ['name', 'shopName', 'businessName', 'location', 'speciality', 'category'],
    4
  );

  return {
    shgs: shgMatches.map((item) => ({
      id: item.id || null,
      name: item.shgName || item.name || null,
      location: item.location || null,
      members: item.members ?? null,
      products: item.products ?? null,
      rating: item.rating ?? null,
      story: item.story || null,
    })),
    artisans: artisans.slice(0, 5).map((item) => ({
      id: item.id || null,
      name: item.name || null,
      location: item.location || null,
      story: item.story || null,
      products: item.products ?? null,
    })),
    warehouse: warehouseMatches.map((item) => ({
      id: item.id || null,
      productName: item.productName || null,
      shgName: item.shgName || null,
      category: item.category || null,
      qty: item.qty ?? null,
      qualityStatus: item.qualityStatus || null,
      location: item.location || null,
    })),
    vendors: vendorMatches.map((item) => ({
      id: item.id || null,
      name: item.name || item.shopName || item.businessName || null,
      location: item.location || null,
      category: item.category || null,
      speciality: item.speciality || null,
    })),
  };
}

function summarizeConversation(messages) {
  const list = safeArray(messages);
  return {
    turnCount: list.length,
    recentMessages: list.slice(-8).map((message) => ({
      role: message?.role === 'ai' ? 'assistant' : message?.role || 'user',
      text: String(message?.text || '').trim(),
    })),
  };
}

function buildRequestSignals(queryText, intent = {}) {
  const normalized = normalizeText(queryText);
  return {
    wantsProfile: Boolean(
      intent.intent === 'profile_info' ||
        /profile|name|email|phone|who am i|my account/i.test(normalized)
    ),
    wantsOrders: Boolean(
      intent.intent === 'order_tracking' ||
        /order|delivery|shipping|tracking|parcel|shipment/i.test(normalized)
    ),
    wantsProducts: Boolean(
      intent.intent === 'product_discovery' ||
        intent.intent === 'product_pricing' ||
        intent.intent === 'product_availability' ||
        /product|price|cost|budget|under|below|find me|recommend|suggest|buy/i.test(normalized)
    ),
    wantsAddresses: Boolean(
      intent.intent === 'address_help' ||
        /address|delivery address|shipping address|where should it be sent/i.test(normalized)
    ),
    wantsWishlist: Boolean(intent.intent === 'wishlist_help' || /wishlist|saved items|saved products/i.test(normalized)),
    wantsNotifications: Boolean(
      intent.intent === 'notifications_help' || /notification|alert|alerts/i.test(normalized)
    ),
    wantsMarketplace: Boolean(
      intent.intent === 'shg_information' ||
        intent.intent === 'vendor_details' ||
        /shg|self help group|women|artisan|vendor|seller|group/i.test(normalized)
    ),
  };
}

async function maybeFetchConsumerProfile(state, signals) {
  if (!signals.wantsProfile && !signals.wantsAddresses) {
    return null;
  }

  const currentUser = state.user || {};
  if (currentUser.name && currentUser.email && currentUser.phone && safeArray(currentUser.addresses).length) {
    return null;
  }

  const consumerId = currentUser.id || (await getConsumerId().catch(() => null));
  if (!consumerId) {
    return null;
  }

  const result = await fetchConsumerProfile(consumerId).catch(() => null);
  const profile = result?.profile || null;
  if (profile && typeof state.updateUserProfile === 'function') {
    state.updateUserProfile({
      id: profile.id || consumerId,
      name: profile.fullName || profile.name || currentUser.name || '',
      email: profile.email || currentUser.email || '',
      phone: profile.phone || currentUser.phone || '',
    });
  }

  return profile;
}

async function maybeFetchAddresses(state, signals) {
  if (!signals.wantsAddresses) {
    return null;
  }

  const currentUser = useStore.getState().user || {};
  const hasAddresses = safeArray(currentUser.addresses).length > 0;
  if (hasAddresses) {
    return null;
  }

  const consumerId = currentUser.id || (await getConsumerId().catch(() => null));
  if (!consumerId) {
    return null;
  }

  const result = await fetchAddresses(consumerId).catch(() => null);
  const addresses = safeArray(result?.addresses);
  if (addresses.length && typeof state.updateUserProfile === 'function') {
    state.updateUserProfile({ addresses });
  }

  return addresses;
}

async function maybeLoadOrders(state, signals) {
  if (!signals.wantsOrders || !state.loadConsumerOrders) {
    return null;
  }

  if (safeArray(state.orders).length > 0) {
    return null;
  }

  const consumerId = state.user?.id || (await getConsumerId().catch(() => null));
  if (!consumerId) {
    return null;
  }

  return state.loadConsumerOrders(consumerId).catch(() => null);
}

async function maybeLoadProducts(state, signals) {
  if (!signals.wantsProducts || !state.loadApprovedProducts) {
    return null;
  }

  if (safeArray(state.products).length > 0) {
    return null;
  }

  return state.loadApprovedProducts().catch(() => null);
}

export async function buildAssistantContext({ queryText = '', messages = [], intent = {} } = {}) {
  const state = useStore.getState() || {};
  const signals = buildRequestSignals(queryText, intent);

  await Promise.allSettled([
    maybeFetchConsumerProfile(state, signals),
    maybeFetchAddresses(state, signals),
    maybeLoadOrders(state, signals),
    maybeLoadProducts(state, signals),
  ]);

  const refreshedState = useStore.getState() || state;

  return {
    queryText,
    requestSignals: signals,
    user: summarizeUser(refreshedState.user),
    profile: summarizeUser(refreshedState.user),
    addresses: summarizeAddresses(refreshedState.user?.addresses),
    orders: summarizeOrders(refreshedState.orders, queryText),
    products: summarizeProducts(refreshedState.products, queryText),
    wishlist: summarizeWishlist(refreshedState.wishlist),
    cart: summarizeCart(refreshedState.cart),
    notifications: summarizeNotifications(refreshedState.notifications),
    marketplace: summarizeMarketplace(refreshedState, queryText),
    conversation: summarizeConversation(messages),
  };
}

export function formatAssistantContextPrompt(context) {
  if (!context) {
    return 'No additional local context is available.';
  }

  const recentMessages = safeArray(context.conversation?.recentMessages)
    .map((message) => `${message.role}: ${message.text}`)
    .join('\n');

  return [
    'Verified Nari Samman context.',
    'Use these facts first. Do not invent missing private data.',
    '',
    `User: ${context.user?.exists ? [context.user.name, context.user.email, context.user.phone].filter(Boolean).join(' | ') : 'unknown'}`,
    `Addresses: ${context.addresses?.count || 0} saved`,
    `Orders: ${context.orders?.count || 0} total`,
    `Wishlist: ${context.wishlist?.count || 0} saved`,
    `Cart: ${context.cart?.count || 0} items, total quantity ${context.cart?.totalQty || 0}, estimated value INR ${context.cart?.totalAmount || 0}`,
    `Notifications: ${context.notifications?.count || 0} total, ${context.notifications?.unreadCount || 0} unread`,
    `Marketplace hints: ${formatList(context.marketplace?.shgs?.map((item) => item.name), 'none')}`,
    context.orders?.latest ? `Latest order: ${context.orders.latest.id || 'unknown'} | ${context.orders.latest.status || 'unknown'} | ${context.orders.latest.tracking || 'no tracking'}` : 'Latest order: none',
    context.products?.matches?.length
      ? `Relevant products: ${context.products.matches
          .map((item) => `${item.name || 'product'} (INR ${item.price ?? 'n/a'})`)
          .join('; ')}`
      : 'Relevant products: none',
    recentMessages ? `Recent conversation:\n${recentMessages}` : 'Recent conversation: none',
  ]
    .filter(Boolean)
    .join('\n');
}
