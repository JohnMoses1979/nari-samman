export const CATEGORY_LABELS = {
  all: 'All',
  food: 'Food',
  textiles: 'Textiles',
  crafts: 'Crafts',
  wellness: 'Wellness'
};

export const CATEGORY_TAGS = {
  food: 'Food',
  textiles: 'Textiles',
  crafts: 'Crafts',
  wellness: 'Wellness'
};

export const SORT_LABELS = {
  featured: 'Featured',
  priceLow: 'Price: Low to High',
  priceHigh: 'Price: High to Low',
  rating: 'Highest Rated',
  newest: 'Newest'
};

export function getAutoCategoryLabel(categoryId) {
  return CATEGORY_LABELS[categoryId] || categoryId;
}

export function getAutoCategoryTag(categoryId) {
  return CATEGORY_TAGS[categoryId] || categoryId;
}

export function getAutoSortLabel(sortKey) {
  return SORT_LABELS[sortKey] || sortKey;
}