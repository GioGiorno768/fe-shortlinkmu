// src/contexts/CurrencyContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CurrencyCode,
  formatCurrency,
  getAvailableCurrencies,
  CURRENCY_INFO,
  fetchExchangeRates,
  getRatesLastUpdate,
  forceRefreshRates,
} from "@/utils/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  format: (amountUSD: number) => string;
  symbol: string;
  currencyName: string;
  availableCurrencies: { code: CurrencyCode; name: string; symbol: string }[];
  lastRatesUpdate: Date | null;
  refreshRates: () => Promise<void>;
  isLoadingRates: boolean;
}

// Default context value for SSR
const defaultContextValue: CurrencyContextType = {
  currency: "USD",
  setCurrency: () => {},
  format: (amountUSD: number) => formatCurrency(amountUSD, "USD"),
  symbol: "$",
  currencyName: "US Dollar",
  availableCurrencies: getAvailableCurrencies(),
  lastRatesUpdate: null,
  refreshRates: async () => {},
  isLoadingRates: false,
};

const CurrencyContext = createContext<CurrencyContextType>(defaultContextValue);

const STORAGE_KEY = "preferred_currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [lastRatesUpdate, setLastRatesUpdate] = useState<Date | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesVersion, setRatesVersion] = useState(0); // Trigger re-render when rates update

  // Load from localStorage and fetch rates on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCY_INFO[stored]) {
      setCurrencyState(stored);
    }

    // Fetch exchange rates on mount
    fetchExchangeRates().then(() => {
      setLastRatesUpdate(getRatesLastUpdate());
      setRatesVersion((v) => v + 1); // Trigger re-render with new rates
    });
  }, []);

  // Save to localStorage when changed
  const setCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  }, []);

  // Manual refresh rates
  const refreshRates = useCallback(async () => {
    setIsLoadingRates(true);
    try {
      await forceRefreshRates();
      setLastRatesUpdate(getRatesLastUpdate());
      setRatesVersion((v) => v + 1); // Trigger re-render with new rates
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  // Format function using current currency (re-evaluates when ratesVersion changes)
  const format = useCallback(
    (amountUSD: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = ratesVersion; // Dependency to trigger re-evaluation
      return formatCurrency(amountUSD, currency);
    },
    [currency, ratesVersion]
  );

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    format,
    symbol: CURRENCY_INFO[currency].symbol,
    currencyName: CURRENCY_INFO[currency].name,
    availableCurrencies: getAvailableCurrencies(),
    lastRatesUpdate,
    refreshRates,
    isLoadingRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
