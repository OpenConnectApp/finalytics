# Finalytics

Financial analytics and data processing platform.

## Requirements

- Node.js 22.x or later (LTS)
- npm 10.x or later

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd finalytics

# Install dependencies
npm install
```

## Usage

### Development

Run the development server with hot reload:

```bash
npm run dev
```

### Production

Build and run for production:

```bash
npm run build
npm start
```

### Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run type-check
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

## License

MIT
