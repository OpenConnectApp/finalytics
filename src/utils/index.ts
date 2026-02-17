/**
 * Utility functions for Finalytics
 */

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0] ?? "";
}

export * from './encryption.js';
