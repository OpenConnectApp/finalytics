# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with TypeScript and Node.js
- Package manager specification (pnpm)
- Changelog for tracking project changes
- Authentication utilities for CoinDCX API (generateSignature, createAuthHeaders, createPayload)
- HTTP client utilities for CoinDCX API requests
- getBalances() API method to fetch user account balances
- testConnection() method to verify API credentials
- Barrel export for CoinDCX integration module
- Common exchange types (Balance, Transaction, ExchangeInfo)
- TransactionType enum for normalized transaction types
- TransactionFilters interface for querying transactions
- ExchangeProvider interface for consistent exchange integration API
- createCoinDCXProvider factory function
- Balance normalization from CoinDCX to common format
- Documentation for ExchangeProvider architecture and pattern
- Database schema for multi-tenant support
- User, Portfolio, ConnectedExchange models
- Balance and Transaction tracking
- BalanceHistory for portfolio analytics
- Encrypted credentials storage support

### Changed
- Refactored test script to use separate coindcxBalance() function
- Updated README with CoinDCX integration documentation and usage examples
