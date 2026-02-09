# Finalytics

Financial analytics and data processing platform.

## Requirements

- Node.js 22.x or later (LTS)
- pnpm 10.x or later

## Package Manager

This project uses [pnpm](https://pnpm.io/) as its package manager. The version is pinned via the `packageManager` field in `package.json`.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd finalytics

# Install dependencies
pnpm install
```

## Usage

### Development

Run the development server with hot reload:

```bash
pnpm run dev
```

### Production

Build and run for production:

```bash
pnpm run build
pnpm start
```

### Type Checking

Run TypeScript type checking without emitting files:

```bash
pnpm run type-check
```

## Project Structure

```
finalytics/
├── src/
│   ├── index.ts        # Application entry point
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── services/       # Business logic and services
├── dist/               # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

| Script       | Description                              |
| ------------ | ---------------------------------------- |
| `dev`        | Start development server with hot reload |
| `build`      | Compile TypeScript to JavaScript         |
| `start`      | Run compiled application                 |
| `type-check` | Run TypeScript compiler without output   |

## Dependencies

### Core Dependencies
- **axios** - HTTP client for API requests
- **dotenv** - Environment variable management
- **@noble/ed25519** - Ed25519 cryptography for CoinSwitch authentication

### Development Dependencies
- **typescript** - TypeScript compiler
- **tsx** - TypeScript execution engine
- **@types/node** - TypeScript definitions for Node.js

## CoinDCX Integration

### Setup

1. Get your CoinDCX API credentials:
   - Visit [CoinDCX API Dashboard](https://coindcx.com/api-dashboard)
   - Create a new API key
   - Copy the **API Key** and **API Secret**

2. Add credentials to your `.env` file:
```bash
COINDCX_API_KEY=your_actual_api_key_here
COINDCX_API_SECRET=your_actual_api_secret_here
```

### Usage

#### Fetch Account Balances

Run the test script to fetch and display your CoinDCX account balances:
```bash
pnpm run dev
```

#### Programmatic Usage
```typescript
import { getBalances, testConnection } from './integrations/coindcx';
import { getCoinDCXConfig } from './config';

// Load configuration
const config = getCoinDCXConfig();

// Test connection
const isConnected = await testConnection(config);
console.log('Connected:', isConnected);

// Get balances
const balances = await getBalances(config);
console.log('Balances:', balances);
```

### API Reference

#### `getBalances(config: CoinDCXConfig): Promise<CoinDCXBalance[]>`
Fetches all account balances from CoinDCX.

**Returns:**
```typescript
[
  {
    currency: "BTC",
    balance: 0.5,
    locked_balance: 0.1
  },
  ...
]
```

#### `testConnection(config: CoinDCXConfig): Promise<boolean>`
Tests if the API credentials are valid.

**Returns:** `true` if connection successful, `false` otherwise

### CoinDCX Documentation

- [CoinDCX API Documentation](https://docs.coindcx.com/)
- [Get API Credentials](https://coindcx.com/api-dashboard)

## CoinSwitch Integration

### Setup

1. Get your CoinSwitch PRO API credentials:
   - Visit [CoinSwitch PRO](https://coinswitch.co/pro)
   - Navigate to API settings
   - Create a new API key with Ed25519 signature
   - Copy the **API Key** and **Secret Key** (hex-encoded)

2. Add credentials to your `.env` file:
```bash
COINSWITCH_API_KEY=your_actual_api_key_here
COINSWITCH_API_SECRET=your_hex_encoded_secret_key_here
```

### Usage

#### Programmatic Usage
```typescript
import { createCoinSwitchProvider } from './integrations/providers/CoinSwitchProvider';

const config = {
  apiKey: process.env.COINSWITCH_API_KEY!,
  apiSecret: process.env.COINSWITCH_API_SECRET!,
};

const provider = createCoinSwitchProvider(config);

// Test connection
const isConnected = await provider.testConnection();
console.log('Connected:', isConnected);

// Get balances
const balances = await provider.getBalances();
console.log('Balances:', balances);

// Get transactions (orders)
const transactions = await provider.getTransactions({
  startDate: new Date('2024-01-01'),
  endDate: new Date(),
});
console.log('Transactions:', transactions);
```

### API Reference

#### `createCoinSwitchProvider(config: CoinSwitchConfig): ExchangeProvider`
Creates a CoinSwitch provider instance.

#### `provider.getBalances(): Promise<Balance[]>`
Fetches portfolio balances in normalized format.

#### `provider.getTransactions(filters?): Promise<Transaction[]>`
Fetches order history (open and closed orders).

**Filters:**
- `startDate` - Filter orders from this date
- `endDate` - Filter orders until this date
- `currency` - Filter by currency (e.g., "BTC")
- `type` - Filter by transaction type (BUY, SELL)

### CoinSwitch Documentation

- [CoinSwitch PRO](https://coinswitch.co/pro)

## Exchange Provider Architecture

Finalytics uses a provider pattern to support multiple cryptocurrency exchanges with a consistent interface.

### Architecture

```
ExchangeProvider Interface
    ↓
    ├── CoinDCXProvider (implemented)
    ├── CoinSwitchProvider (implemented)
    └── [Future exchanges...]
```

### Creating a Provider

```typescript
import { createCoinDCXProvider } from './integrations/providers/CoinDCXProvider';
import { getCoinDCXConfig } from './config';

// Create provider
const config = getCoinDCXConfig();
const provider = createCoinDCXProvider(config);

// All providers have the same interface:
const info = provider.getExchangeInfo();
const isConnected = await provider.testConnection();
const balances = await provider.getBalances();
// const transactions = await provider.getTransactions(); // Coming soon
```

### Adding New Exchanges

To add a new exchange:

1. Create exchange-specific integration in `src/integrations/[exchange]/`
2. Create provider in `src/integrations/providers/[Exchange]Provider.ts`
3. Implement `ExchangeProvider` interface
4. Export factory function `create[Exchange]Provider()`

See `CoinDCXProvider.ts` for reference implementation.

## Documentation

- [Changelog](CHANGELOG.md) - Notable changes to the project

## License

MIT
