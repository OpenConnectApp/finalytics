function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function loadConfig() {
  return {
    coindcx: {
      apiKey: requireEnv("COINDCX_API_KEY"),
      apiSecret: requireEnv("COINDCX_API_SECRET"),
    },
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;
