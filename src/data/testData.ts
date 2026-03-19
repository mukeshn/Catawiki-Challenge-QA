// Search keywords used across tests
export const Keywords = {
  PRIMARY: "train",
  WATCHES: "watches",
  ART: "painting",
  NONSENSE: "xyzqwerty98765zzz",
  SPECIAL_CHARS: "art & antiques",
  YEAR: "1970",
} as const;

// URL patterns for assertions
export const Urls = {
  SEARCH: /search|q=|\/s\//i,
  LOT: /\/l\//,
} as const;
