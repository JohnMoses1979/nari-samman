const INTENT_GROUPS = [
  {
    intent: 'greeting',
    category: 'conversation',
    needsDatabase: false,
    triggers: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'],
  },
  {
    intent: 'thanks',
    category: 'conversation',
    needsDatabase: false,
    triggers: ['thank you', 'thanks', 'thank u', 'thx', 'appreciate it'],
  },
  {
    intent: 'identity',
    category: 'conversation',
    needsDatabase: false,
    triggers: ['who are you', 'what are you', 'tell me about yourself', 'introduce yourself'],
  },
  {
    intent: 'capabilities',
    category: 'conversation',
    needsDatabase: false,
    triggers: ['what can you do', 'what can you help with', 'how can you help'],
  },
  {
    intent: 'help',
    category: 'conversation',
    needsDatabase: false,
    triggers: ['help me', 'need help', 'support', 'what should i ask'],
  },
  {
    intent: 'order_tracking',
    category: 'orders',
    needsDatabase: true,
    triggers: [
      'track my order',
      'track order',
      'where is my order',
      'order status',
      'delivery status',
      'my order status',
      'shipped yet',
      'delivered yet',
      'where is it now',
    ],
  },
  {
    intent: 'product_discovery',
    category: 'products',
    needsDatabase: true,
    triggers: [
      'looking for',
      'need a',
      'need an',
      'need some',
      'suggest a product',
      'recommend a product',
      'find me',
      'show me something',
      'under rs',
      'under inr',
      'under rupees',
      'below rs',
      'below inr',
      'budget',
      'price range',
      'handmade bag',
      'buy a',
      'buy an',
      'i want to buy',
    ],
  },
  {
    intent: 'product_pricing',
    category: 'products',
    needsDatabase: true,
    triggers: [
      'product price',
      'price of',
      'how much is',
      'what is the price',
      'product cost',
      'cost of product',
      'how much does',
    ],
  },
  {
    intent: 'product_availability',
    category: 'products',
    needsDatabase: true,
    triggers: [
      'available products',
      'product stock',
      'product availability',
      'is it available',
      'in stock',
      'out of stock',
      'availability of',
    ],
  },
  {
    intent: 'vendor_details',
    category: 'vendors',
    needsDatabase: true,
    triggers: [
      'vendor details',
      'vendor information',
      'vendor info',
      'seller details',
      'seller information',
      'seller profile',
    ],
  },
  {
    intent: 'shg_information',
    category: 'shg',
    needsDatabase: true,
    triggers: [
      'shg information',
      'shg details',
      'self help group',
      'self-help group',
      'women shg',
      'women self help groups',
      'artisan information',
      'artisan details',
      'artisan story',
    ],
  },
  {
    intent: 'profile_info',
    category: 'consumer',
    needsDatabase: true,
    triggers: [
      'my profile',
      'profile details',
      'what is my name',
      'tell me my name',
      'my name',
      'profile name',
      'show my profile',
      'who am i',
    ],
  },
  {
    intent: 'address_help',
    category: 'consumer',
    needsDatabase: true,
    triggers: [
      'my address',
      'add new address',
      'change address',
      'edit my address',
      'update address',
      'address details',
      'delivery address',
    ],
  },
  {
    intent: 'wishlist_help',
    category: 'consumer',
    needsDatabase: true,
    triggers: ['my wishlist', 'wishlist items', 'show wishlist', 'saved items', 'saved products'],
  },
  {
    intent: 'cart_help',
    category: 'consumer',
    needsDatabase: true,
    triggers: ['my cart', 'show cart', 'cart items', 'what is in my cart'],
  },
  {
    intent: 'notifications_help',
    category: 'consumer',
    needsDatabase: true,
    triggers: ['notifications', 'my notifications', 'show notifications', 'alerts'],
  },
];

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s?₹]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPhraseRegex(phrase) {
  const escaped = phrase
    .toLowerCase()
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');

  return new RegExp(`(^|\\s)${escaped}(\\s|$|[?.!,])`, 'i');
}

function matchesAnyTrigger(normalizedText, triggers) {
  return triggers.some((trigger) => buildPhraseRegex(trigger).test(normalizedText));
}

function detectBudgetMatch(normalizedText) {
  return /(under|below|within|less than|budget|around)\s*(?:rs|inr|₹|rupees?)?\s*\d+/i.test(normalizedText);
}

function detectMarketplaceDiscovery(normalizedText) {
  return /(need|looking for|find me|show me|recommend|suggest|help me find|want to buy)/i.test(normalizedText)
    && /(product|item|bag|saree|honey|jaggery|spice|craft|gift|decor|textile|food|handmade|artisan)/i.test(normalizedText);
}

export function detectAiIntent(rawText) {
  const normalizedText = normalizeText(rawText);

  if (!normalizedText) {
    return {
      route: 'assistant',
      intent: 'empty_message',
      category: 'general',
      normalizedText,
      needsDatabase: false,
      needsFollowUp: true,
      needsContext: false,
    };
  }

  for (const group of INTENT_GROUPS) {
    if (matchesAnyTrigger(normalizedText, group.triggers)) {
      return {
        route: 'assistant',
        intent: group.intent,
        category: group.category,
        normalizedText,
        needsDatabase: Boolean(group.needsDatabase),
        needsFollowUp: group.intent === 'product_discovery' && !detectBudgetMatch(normalizedText),
        needsContext: Boolean(group.needsDatabase),
      };
    }
  }

  if (detectBudgetMatch(normalizedText) || detectMarketplaceDiscovery(normalizedText)) {
    return {
      route: 'assistant',
      intent: 'product_discovery',
      category: 'products',
      normalizedText,
      needsDatabase: true,
      needsFollowUp: !detectBudgetMatch(normalizedText),
      needsContext: true,
    };
  }

  return {
    route: 'assistant',
    intent: 'general_query',
    category: 'general',
    normalizedText,
    needsDatabase: false,
    needsFollowUp: false,
    needsContext: false,
  };
}

export function isBusinessAssistantQuery(rawText) {
  const intent = detectAiIntent(rawText);
  return intent.needsDatabase || intent.intent !== 'general_query';
}
