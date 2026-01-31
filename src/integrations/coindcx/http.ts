import axios, { AxiosInstance } from "axios";
import { CoinDCXConfig } from "../../types/coindcx.js";
import { generateSignature, createAuthHeaders, createPayload } from "./auth.js";

/**
 * Create axios instance configured for CoinDCX API
 * @param baseUrl - CoinDCX API base URL
 * @returns Configured axios instance
 */
export function createHttpClient(baseUrl: string): AxiosInstance {
  return axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Make authenticated POST request to CoinDCX API
 * @param config - CoinDCX configuration (apiKey, apiSecret, baseUrl)
 * @param endpoint - API endpoint path
 * @param body - Request body parameters
 * @returns API response data
 */
export async function makeAuthenticatedRequest<T>(
  config: CoinDCXConfig,
  endpoint: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  try {
    const httpClient = createHttpClient(config.baseUrl);

    // Create payload with timestamp
    const payload = createPayload(body);

    // Generate signature
    const signature = generateSignature(payload, config.apiSecret);

    // Create authentication headers
    const authHeaders = createAuthHeaders(config.apiKey, signature);

    // Parse payload back to object for axios
    const requestBody: unknown = JSON.parse(payload);

    // Make request
    const response = await httpClient.post<T>(endpoint, requestBody, {
      headers: authHeaders,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message;
      throw new Error(`CoinDCX API Error: ${errorMessage}`);
    }
    throw error;
  }
}
