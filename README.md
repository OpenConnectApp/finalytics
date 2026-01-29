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

## Documentation

- [Changelog](CHANGELOG.md) - Notable changes to the project

## License

MIT
