import { getBalances, testConnection } from "./integrations/coindcx/index.js";
import { getCoinDCXConfig } from "./config/env.js";
import { CoinDCXBalance } from "./types/coindcx.js";

/**
 * Fetch and display CoinDCX account balances
 */
async function coindcxBalance(): Promise<void> {
  console.log("🚀 CoinDCX Balance Check\n");

  // Load configuration
  console.log("📋 Loading CoinDCX configuration...");
  const config = getCoinDCXConfig();
  console.log("✅ Configuration loaded\n");

  // Test connection
  console.log("🔌 Testing connection to CoinDCX API...");
  const isConnected = await testConnection(config);

  if (!isConnected) {
    console.error("❌ Failed to connect to CoinDCX API");
    console.error("Please check your API credentials in .env file");
    throw new Error("CoinDCX connection failed");
  }
  console.log("✅ Connection successful\n");

  // Fetch balances
  console.log("💰 Fetching account balances...");
  const balances = await getBalances(config);

  console.log(`✅ Retrieved ${balances.length} balances\n`);

  // Display balances
  displayBalances(balances);
}

/**
 * Display balances in a formatted table
 * @param balances - Array of CoinDCX balances
 */
function displayBalances(balances: CoinDCXBalance[]): void {
  console.log("📊 Account Balances:");
  console.log("─".repeat(60));

  if (balances.length === 0) {
    console.log("No balances found");
    return;
  }

  // Filter out zero balances
  const nonZeroBalances = balances.filter(
    (b) => b.balance > 0 || b.locked_balance > 0,
  );

  if (nonZeroBalances.length === 0) {
    console.log("All balances are zero");
    return;
  }

  nonZeroBalances.forEach((balance) => {
    console.log(`\n${balance.currency}:`);
    console.log(`  Available: ${balance.balance}`);
    console.log(`  Locked:    ${balance.locked_balance}`);
    console.log(`  Total:     ${balance.balance + balance.locked_balance}`);
  });

  console.log("\n" + "─".repeat(60));
}

/**
 * Main entry point
 */
async function main() {
  try {
    console.log("✨ Finalytics - Financial Analytics Platform\n");

    // Test CoinDCX integration
    await coindcxBalance();

    console.log("\n✨ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Error occurred:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the application
main();
