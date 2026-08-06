export type CurrencyCode = "INR" | "USD" | "GBP" | "EUR" | "AED" | "SAR" | "KWD";

export const CURRENCIES: { code: CurrencyCode; flag: string; symbol: string; rateFromUsd: number }[] = [
  { code: "INR", flag: "🇮🇳", symbol: "₹", rateFromUsd: 83 },
  { code: "USD", flag: "🇺🇸", symbol: "$", rateFromUsd: 1 },
  { code: "GBP", flag: "🇬🇧", symbol: "£", rateFromUsd: 0.79 },
  { code: "EUR", flag: "🇪🇺", symbol: "€", rateFromUsd: 0.92 },
  { code: "AED", flag: "🇦🇪", symbol: "AED ", rateFromUsd: 3.67 },
  { code: "SAR", flag: "🇸🇦", symbol: "SAR ", rateFromUsd: 3.75 },
  { code: "KWD", flag: "🇰🇼", symbol: "KWD ", rateFromUsd: 0.31 },
];

const DEFAULT_CURRENCY: CurrencyCode = "USD";

// Only these countries map to a non-default currency — everyone else falls back to USD,
// so the site only ever shows one of the seven currencies above, per product requirement.
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AE: "AED",
  SA: "SAR",
  KW: "KWD",
  // Eurozone
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  EE: "EUR",
  FI: "EUR",
  FR: "EUR",
  DE: "EUR",
  GR: "EUR",
  IE: "EUR",
  IT: "EUR",
  LV: "EUR",
  LT: "EUR",
  LU: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SK: "EUR",
  SI: "EUR",
  ES: "EUR",
};

export function currencyForCountry(countryCode: string | null | undefined): CurrencyCode {
  if (!countryCode) return DEFAULT_CURRENCY;
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? DEFAULT_CURRENCY;
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value);
}

export function convertFromUsd(amountUsd: number, currency: CurrencyCode): number {
  const rate = CURRENCIES.find((c) => c.code === currency)?.rateFromUsd ?? 1;
  return amountUsd * rate;
}

export function formatPrice(amountUsd: number, currency: CurrencyCode): string {
  const meta = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[1];
  const amount = convertFromUsd(amountUsd, currency);
  const decimals = amount < 10 ? 2 : 0;
  return `${meta.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
