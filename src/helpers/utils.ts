// Parse euro amounts - catawiki uses Dutch locale (period = thousands, comma = decimal)
export function parseCurrencyAmount(text: string): number {
  const normalized = text
    .replace(/[^\d.,]/g, "")   // strip currency symbols
    .replace(/\./g, "")         // remove thousands separator
    .replace(",", ".");          // convert decimal comma to point
  return parseFloat(normalized) || 0;
}

/** Quick check if a string looks like a valid euro bid */
export function isValidEuroBid(bid: string): boolean {
  return /€\s*[\d,.]+/.test(bid);
}

/** Check if numbers are in ascending order */
export function isAscending(values: number[]): boolean {
  return values.every((val, i) => i === 0 || val > values[i - 1]);
}
