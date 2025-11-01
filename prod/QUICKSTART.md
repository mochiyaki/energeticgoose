# 🚀 Quick Start Guide

Get Energetic Goose running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Create Environment File

```bash
# Copy the example file
cp .env.local.example .env.local

# The default values work for development!
```

### 3. Setup Database

```bash
# Generate Prisma Client
pnpm prisma:generate

# Create database and run migrations
pnpm prisma:migrate

# (Optional) Seed with demo data
pnpm prisma:seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Demo Account

If you ran the seed command:

- **Email:** demo@democorp.com
- **Password:** demo1234

## What to Try

1. **Landing Page** - Beautiful hero section with product info
2. **Sign Up** - Create your organization account
3. **Dashboard** - Upload invoices, convert to contracts
4. **AI Chat** - Ask questions (try voice input in Chrome!)
5. **Reports** - View analytics and charts
6. **Settings** - See API keys and org settings

## Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules .next
pnpm install
```

### Database issues

```bash
rm prisma/dev.db
pnpm prisma:migrate
pnpm prisma:seed
```

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 pnpm dev
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase in `src/`
- Check out the API routes in `src/app/api/`
- Customize the UI in `src/components/`

---

**Need help?** Check the main README or open an issue!
