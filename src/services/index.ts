/**
 * Service layer for Finalytics
 */

import type { AnalyticsResult } from "../types/index.js";

export async function processAnalytics(data: number[]): Promise<AnalyticsResult> {
  const sum = data.reduce((acc, val) => acc + val, 0);
  const average = data.length > 0 ? sum / data.length : 0;

  return {
    metric: "average",
    value: average,
    period: "current",
  };
}
