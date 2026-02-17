# Database Setup Guide

## Prerequisites

- PostgreSQL 14+ installed and running
- Database user with CREATE DATABASE privileges

## Initial Setup

### 1. Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE finalytics;

# Create user (optional)
CREATE USER finalytics_user WITH PASSWORD 'finalytics_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE finalytics TO finalytics_user;

# Exit
\q
```

### 2. Configure Environment Variables

Update your `.env` file with the database connection URL:
```env
DATABASE_URL="postgresql://finalytics_user:finalytics_password@localhost:5432/finalytics?schema=public"
```

Or for local development with default postgres user:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finalytics?schema=public"
```

### 3. Run Migrations

Apply the database schema:
```bash
npx prisma migrate dev
```

This will:
- Create all tables in PostgreSQL
- Generate the Prisma Client
- Sync your schema with the database

### 4. Verify Database
```bash
# View database status
npx prisma db status

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Common Commands
```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ DANGER: Deletes all data)
npx prisma migrate reset

# View current database schema
npx prisma db pull

# Open Prisma Studio GUI
npx prisma studio
```

## Database Schema

### Tables

- **users** - Application users
- **portfolios** - User portfolios for organizing assets
- **connected_exchanges** - Encrypted exchange API credentials
- **balances** - Current balances per currency per exchange
- **transactions** - Trade history (buy, sell, deposit, withdrawal)
- **balance_history** - Historical balance snapshots

### Relationships

```
User (1) ──┬──> (N) Portfolio
           └──> (N) ConnectedExchange

Portfolio (1) ──┬──> (N) Balance
                └──> (N) Transaction
```
