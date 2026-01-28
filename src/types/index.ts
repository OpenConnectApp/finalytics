/**
 * Type definitions for Finalytics
 */

export interface FinancialData {
  timestamp: Date;
  value: number;
  currency: string;
}

export interface AnalyticsResult {
  metric: string;
  value: number;
  period: string;
}
