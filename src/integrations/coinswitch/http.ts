import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { CoinSwitchConfig } from '../../types/coinswitch.js';
import {
  generateSignature,
  createAuthHeaders,
  getCurrentEpochTime,
} from './auth.js';

const BASE_URL = 'https://coinswitch.co';

/**
 * Create an HTTP client for CoinSwitch API with authentication
 */
export function createHttpClient(config: CoinSwitchConfig): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add authentication
  client.interceptors.request.use(async (requestConfig) => {
    const method = requestConfig.method?.toUpperCase() || 'GET';
    const endpoint = requestConfig.url || '';
    const epochTime = getCurrentEpochTime();

    // Generate signature
    const signature = await generateSignature(
      method,
      endpoint,
      config.apiSecret,
      epochTime,
      requestConfig.data
    );

    // Add authentication headers
    const authHeaders = createAuthHeaders(
      config.apiKey,
      signature,
      epochTime
    );

    // Merge headers properly
    Object.assign(requestConfig.headers || {}, authHeaders);

    return requestConfig;
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        // Enhanced error messages
        if (status === 401) {
          throw new Error(`Authentication failed: ${message}`);
        } else if (status === 422) {
          throw new Error(`Invalid request: ${message}`);
        } else if (status === 429) {
          throw new Error('Rate limit exceeded');
        } else if (status >= 500) {
          throw new Error(`CoinSwitch server error: ${message}`);
        }

        throw new Error(`CoinSwitch API error (${status}): ${message}`);
      }

      throw error;
    }
  );

  return client;
}

/**
 * Make an authenticated request to CoinSwitch API
 */
export async function makeAuthenticatedRequest<T>(
  client: AxiosInstance,
  method: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  data?: any,
  params?: any
): Promise<T> {
  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    ...(data && { data }),
    ...(params && { params }),
  };

  const response = await client.request<T>(config);
  return response.data;
}
