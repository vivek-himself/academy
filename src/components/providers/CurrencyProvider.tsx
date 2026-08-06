"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type CurrencyCode, formatPrice, isCurrencyCode } from "@/lib/currency";

const STORAGE_KEY = "academy_currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  format: (amountUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ initialCurrency, children }: { initialCurrency: CurrencyCode; children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);

  // A saved manual choice should win over the geo-detected default, but localStorage is only
  // readable client-side — applying it post-hydration avoids an SSR/client mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isCurrencyCode(stored)) setCurrencyState(stored);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format: (amountUsd) => formatPrice(amountUsd, currency) }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
