export function formatText(text, params = {}) {
  if (text === null || text === undefined) return '';
  return String(text).replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined && params[key] !== null ? String(params[key]) : `{${key}}`;
  });
}