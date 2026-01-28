/**
 * Finalytics - Financial Analytics and Data Processing Platform
 * Main entry point
 */

const APP_NAME = "Finalytics";
const VERSION = "1.0.0";

interface AppConfig {
  name: string;
  version: string;
  environment: string;
}

function getConfig(): AppConfig {
  return {
    name: APP_NAME,
    version: VERSION,
    environment: process.env.NODE_ENV ?? "development",
  };
}

function main(): void {
  const config = getConfig();

  console.log(`${config.name} v${config.version}`);
  console.log(`Environment: ${config.environment}`);
  console.log("Financial analytics platform initialized.");
}

main();
