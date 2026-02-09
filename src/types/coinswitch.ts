export interface CoinSwitchConfig {
  apiKey: string;
  apiSecret: string;
}

export interface CoinSwitchPortfolioItem {
  currency: string;
  blocked_balance_order: string;
  main_balance: string;
  buy_average_price?: number;
  invested_value?: number;
  invested_value_excluding_fee?: number;
  current_value?: number;
  sell_rate?: number;
  buy_rate?: number;
  is_average_price_available?: boolean;
  name: string;
  is_delisted_coin?: boolean;
}

export interface CoinSwitchPortfolioResponse {
  data: CoinSwitchPortfolioItem[];
}

export interface CoinSwitchOrder {
  order_id: string;
  symbol: string;
  price: number;
  average_price: number;
  orig_qty: number;
  executed_qty: number;
  status: string;
  side: string;
  exchange: string;
  order_source: string;
  created_time: number;
  updated_time: number;
}

export interface CoinSwitchOrdersResponse {
  data: {
    orders: CoinSwitchOrder[];
  };
}

export interface CoinSwitchServerTimeResponse {
  serverTime: number;
}
