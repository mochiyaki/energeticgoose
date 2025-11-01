# Deployment Guide - Energetic Goose

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- PostgreSQL database (recommended: Vercel Postgres or Supabase)

### Step 1: Prepare for Production

1. **Update Database Provider**

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

2. **Add Production Environment Variables**

Create `.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional: External Services
OPENAI_API_KEY="sk-..."
CENTRIFUGE_API_KEY="..."
```

### Step 2: Deploy to Vercel

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Energetic Goose"
git branch -M main
git remote add origin https://github.com/yourusername/energetic-goose.git
git push -u origin main
```

2. **Connect to Vercel**

- Go to https://vercel.com/new
- Import your GitHub repository
- Configure project:
  - Framework Preset: Next.js
  - Root Directory: `./frontend`
  - Build Command: `pnpm build`
  - Output Directory: `.next`

3. **Add Environment Variables**

In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

4. **Deploy**

Click "Deploy" - Vercel will:
- Install dependencies
- Run Prisma generate
- Build Next.js app
- Deploy to CDN

### Step 3: Database Setup

```bash
# Run migrations on production database
npx prisma migrate deploy

# Optional: Seed production data
npx prisma db seed
```

---

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/energetic_goose
      - NEXTAUTH_SECRET=your-secret-here
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=energetic_goose
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app
```

---

## ☁️ AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repo
   - Select branch: `main`

2. **Build Settings**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
        - npx prisma generate
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Environment Variables**
   - Add in Amplify Console → Environment Variables
   - Same as Vercel setup

### Using EC2 + RDS

1. **Launch EC2 Instance** (t3.small or larger)
2. **Create RDS PostgreSQL** database
3. **SSH into EC2**:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone repo
git clone https://github.com/yourusername/energetic-goose.git
cd energetic-goose/frontend

# Install dependencies
pnpm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with production values

# Run migrations
npx prisma migrate deploy

# Build
pnpm build

# Start with PM2
npm install -g pm2
pm2 start npm --name "energetic-goose" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx** as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📦 Production Checklist

### Security

- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie settings
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Add security headers (Helmet.js)
- [ ] Enable CSP (Content Security Policy)
- [ ] Sanitize file uploads
- [ ] Add input validation on all endpoints

### Performance

- [ ] Enable Next.js image optimization
- [ ] Add Redis for session storage
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add CDN for static assets
- [ ] Enable gzip compression
- [ ] Lazy load components
- [ ] Add database connection pooling

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Vercel Analytics, Google Analytics)
- [ ] Configure logging (Winston, Pino)
- [ ] Set up uptime monitoring
- [ ] Add performance monitoring
- [ ] Configure alerts

### Features

- [ ] Add email service (SendGrid, Resend)
- [ ] Implement password reset flow
- [ ] Add 2FA/MFA
- [ ] Set up file storage (S3, R2)
- [ ] Add real-time notifications
- [ ] Implement audit logs
- [ ] Add backup strategy

### Testing

- [ ] Write unit tests (Jest, Vitest)
- [ ] Add integration tests
- [ ] E2E tests (Playwright, Cypress)
- [ ] Load testing
- [ ] Security testing

### Documentation

- [ ] API documentation (Swagger)
- [ ] User guide
- [ ] Admin documentation
- [ ] Deployment runbook
- [ ] Incident response plan

---

## 🔧 Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | JWT signing secret | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `https://app.example.com` |

### Optional (for production features)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | For real AI chat |
| `CENTRIFUGE_API_KEY` | For blockchain integration |
| `STRIPE_SECRET_KEY` | For payments |
| `SENDGRID_API_KEY` | For emails |
| `AWS_ACCESS_KEY_ID` | For S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | For S3 uploads |
| `AWS_REGION` | AWS region |
| `S3_BUCKET_NAME` | S3 bucket for uploads |
| `SENTRY_DSN` | Error tracking |
| `REDIS_URL` | For caching/sessions |

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
        working-directory: ./frontend
      
      - name: Run tests
        run: pnpm test
        working-directory: ./frontend
      
      - name: Build
        run: pnpm build
        working-directory: ./frontend
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🆘 Troubleshooting

### Build Fails

**Error:** `Prisma Client not generated`

```bash
npx prisma generate
```

**Error:** `bcrypt build fails`

```bash
pnpm rebuild bcrypt
```

### Database Issues

**Error:** `Can't reach database`

- Check `DATABASE_URL` is correct
- Verify database is accessible
- Check firewall rules

**Error:** `Migration failed`

```bash
# Reset database (CAUTION: deletes data)
npx prisma migrate reset

# Or manually fix
npx prisma migrate resolve --rolled-back "migration_name"
```

### Runtime Errors

**Error:** `NEXTAUTH_SECRET not set`

- Add to environment variables
- Restart application

**Error:** `Module not found`

```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## 📞 Support

For deployment issues:
1. Check logs: `vercel logs` or `docker-compose logs`
2. Review environment variables
3. Verify database connection
4. Check build output

---

**Ready to deploy! 🚀**
