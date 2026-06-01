import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  medium: Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' }),
  bold: Platform.select({ ios: 'System', android: 'Roboto-Bold', default: 'System' })
};

export const TYPOGRAPHY = {
  // Display
  hero: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5, lineHeight: 40 },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  h4: { fontSize: 16, fontWeight: '600', lineHeight: 24 },

  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 18 },

  // Labels
  label: { fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
  labelSmall: { fontSize: 11, fontWeight: '500', letterSpacing: 0.5 },
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 16 },

  // Special
  price: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  priceSmall: { fontSize: 14, fontWeight: '700' },
  badge: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }
};