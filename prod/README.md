# Energetic Goose 🦆⚡

**Tokenized Invoice Financing Platform** - Accelerate cash flow with blockchain-powered invoice factoring at 7% APY with 0% FX markup.

Built with Next.js 14, Prisma, SQLite, NextAuth, and shadcn/ui.

---

## 🚀 Features

- **🔐 Organization-based Authentication** - Secure signup/signin with NextAuth (Credentials provider)
- **📄 Invoice Upload** - Upload PDF or image invoices with metadata
- **🔄 Contract Conversion** - Convert invoices to tokenized contracts (mock Centrifuge integration)
- **🤖 AI Treasury Assistant** - Chat interface with voice input support (Web Speech API)
- **📊 Analytics Dashboard** - Real-time stats, charts, and reports
- **⚙️ Settings Management** - Organization profile, API keys, and user settings
- **🎨 Modern UI** - Beautiful, responsive design with Tailwind CSS and shadcn/ui

---

## 📋 Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** (or npm/yarn)
- **Git**

---

## 🛠️ Setup Instructions

### 1. Clone & Navigate

```bash
cd frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_SECRET=dev_secret_for_demo_only_change_in_production
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** For production, generate a secure secret with `openssl rand -base64 32`

### 4. Database Setup

Initialize the SQLite database and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

This will:
- Generate Prisma Client
- Create `prisma/dev.db` (SQLite database)
- Apply all migrations

### 5. Seed Database (Optional)

Populate with demo data:

```bash
pnpm prisma:seed
```

This creates:
- **Organization:** Demo Corp
- **User:** demo@democorp.com / demo1234
- **Sample invoices and contracts**

### 6. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Quick Start Guide

### First Time Setup

1. **Visit Landing Page** - http://localhost:3000
2. **Sign Up** - Create your organization account
3. **Sign In** - Use your credentials
4. **Dashboard** - You'll be redirected to `/app`

### Demo Account (if seeded)

- **Email:** demo@democorp.com
- **Password:** demo1234

---

## 📁 Project Structure

```
frontend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data script
│   └── dev.db                 # SQLite database (gitignored)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── page.tsx       # Landing page
│   │   ├── (auth)/
│   │   │   ├── signup/        # Organization signup
│   │   │   └── signin/        # User signin
│   │   ├── app/               # Protected app routes
│   │   │   ├── layout.tsx     # App layout with nav
│   │   │   ├── page.tsx       # Dashboard (tabs)
│   │   │   ├── new/           # New financing application
│   │   │   ├── invoices/      # Invoices list
│   │   │   ├── reports/       # Analytics & charts
│   │   │   └── settings/      # Settings page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup/    # POST signup
│   │   │   │   └── [...nextauth]/ # NextAuth handler
│   │   │   ├── applications/  # POST/GET financing apps
│   │   │   ├── invoices/
│   │   │   │   └── upload/    # POST/GET invoices
│   │   │   ├── contracts/
│   │   │   │   └── convert/   # POST convert invoice
│   │   │   ├── ai/
│   │   │   │   └── query/     # POST/GET AI chat
│   │   │   └── reports/
│   │   │       └── summary/   # GET analytics
│   │   ├── globals.css        # Tailwind styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── app-nav.tsx        # App navigation
│   │   ├── file-uploader.tsx  # Invoice uploader
│   │   ├── invoices-list.tsx  # Invoices table
│   │   ├── chat-box.tsx       # AI chat with voice
│   │   └── stats-cards.tsx    # Dashboard stats
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── utils.ts           # Utility functions
│   │   ├── validators.ts      # Zod schemas
│   │   └── ai/
│   │       └── mock.ts        # Mock AI responses
│   └── types/
│       └── next-auth.d.ts     # NextAuth types
├── uploads/                   # Uploaded files (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

---

## 🔑 Key Features Explained

### 1. Authentication (NextAuth)

- **Credentials Provider** - Email + password (bcrypt hashing)
- **Organization-scoped** - Each user belongs to an organization
- **Session Management** - JWT-based sessions
- **Protected Routes** - `/app/**` requires authentication

### 2. Invoice Upload

- **File Types:** PDF, JPG, PNG
- **Storage:** Local filesystem (`/uploads`)
- **Metadata:** Filename, amount, status
- **API:** `POST /api/invoices/upload` (multipart/form-data)

### 3. Contract Conversion (Mock)

- **Mock Logic:** Generates `contractId` (e.g., `EG-ABC123`) and `contractHash` (CID-like)
- **Status Update:** Invoice status → `CONTRACTED`
- **Future Integration:** Replace with real Centrifuge smart contract calls

### 4. AI Treasury Assistant

- **Mock Responses:** Keyword-based search over invoices/contracts
- **Voice Input:** Web Speech API (Chrome/Edge supported)
- **Chat History:** Stored in DB (`ChatMessage` model)
- **Future Integration:** Connect to OpenAI/Anthropic for real LLM

### 5. Reports & Analytics

- **Aggregations:** Total invoices, amount, contracted count, avg duration
- **Charts:** Bar chart (invoices per week), Pie chart (status distribution)
- **Library:** Recharts

---

## 🧪 Testing Workflow

### Manual Testing Checklist

1. **Signup Flow**
   - [ ] Create new organization
   - [ ] Validation errors display correctly
   - [ ] Redirect to signin after success

2. **Signin Flow**
   - [ ] Login with valid credentials
   - [ ] Error on invalid credentials
   - [ ] Redirect to `/app` on success

3. **New Application**
   - [ ] Fill out financing application form
   - [ ] Validation works (amount > 0, duration 7-360)
   - [ ] Success toast and redirect

4. **Invoice Upload**
   - [ ] Upload PDF/image file
   - [ ] Optional amount field
   - [ ] File appears in invoices list

5. **Convert to Contract**
   - [ ] Click "Convert" on uploaded invoice
   - [ ] Status changes to "Contracted"
   - [ ] Contract ID displayed

6. **AI Chat**
   - [ ] Type message and send
   - [ ] Receive mock response
   - [ ] Voice input works (Chrome/Edge)
   - [ ] Chat history persists

7. **Reports**
   - [ ] Stats cards display correct numbers
   - [ ] Charts render with data
   - [ ] Insights section shows

8. **Settings**
   - [ ] Organization name displays
   - [ ] API key copy works
   - [ ] User profile shows

---

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)

# Build
pnpm build            # Production build
pnpm start            # Start production server

# Database
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:migrate   # Run migrations
pnpm prisma:seed      # Seed demo data
pnpm prisma:studio    # Open Prisma Studio (DB GUI)

# Linting
pnpm lint             # Run ESLint
```

---

## 🔧 Configuration

### Database (Prisma + SQLite)

- **File:** `prisma/dev.db` (gitignored)
- **Schema:** `prisma/schema.prisma`
- **Migrations:** Auto-generated in `prisma/migrations/`

To reset database:

```bash
rm prisma/dev.db
pnpm prisma:migrate
pnpm prisma:seed
```

### File Uploads

- **Directory:** `./uploads` (gitignored except `.gitkeep`)
- **Max Size:** 10MB (configurable in `next.config.mjs`)
- **Allowed Types:** PDF, JPG, PNG

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | JWT signing secret | `dev_secret_for_demo_only` |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` |
| `UPLOAD_DIR` | Upload directory | `./uploads` |

---

## 🚧 Known Limitations (Demo Mode)

### Not Implemented (Stubs Only)

1. **Real Blockchain Integration**
   - No actual Centrifuge smart contract calls
   - Mock contract IDs and hashes

2. **Real LLM**
   - AI responses are keyword-based mock logic
   - No OpenAI/Anthropic API calls

3. **Payment Processing**
   - Card info is display-only (no Stripe/payment gateway)

4. **FX Settlement**
   - No real USDC/Circle integration

5. **Email Notifications**
   - No email service configured

6. **File Validation**
   - Basic MIME type check only (no OCR/invoice parsing)

### Production Readiness Checklist

- [ ] Replace SQLite with PostgreSQL/MySQL
- [ ] Integrate Centrifuge SDK for real tokenization
- [ ] Connect AI chat to OpenAI/Anthropic API
- [ ] Add Stripe/payment gateway for card processing
- [ ] Implement Circle USDC for FX settlements
- [ ] Add email service (SendGrid/Resend)
- [ ] Implement OCR for invoice parsing
- [ ] Add KYC/AML verification
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add rate limiting and security headers
- [ ] Deploy to Vercel/AWS with proper secrets management

---

## 🎨 UI Components (shadcn/ui)

All components are in `src/components/ui/`:

- `button.tsx` - Button variants
- `input.tsx` - Form inputs
- `label.tsx` - Form labels
- `card.tsx` - Card layouts
- `tabs.tsx` - Tabbed interfaces
- `toast.tsx` - Toast notifications

To add more shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🐛 Troubleshooting

### Database Issues

**Error:** `Can't reach database server`

```bash
# Reset database
rm prisma/dev.db
pnpm prisma:migrate
```

### NextAuth Errors

**Error:** `[next-auth][error][SIGNIN_EMAIL_ERROR]`

- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure `NEXTAUTH_URL` matches your dev server

### Upload Failures

**Error:** `ENOENT: no such file or directory`

```bash
# Create uploads directory
mkdir -p uploads
```

### Voice Input Not Working

- **Supported Browsers:** Chrome, Edge (Chromium-based)
- **Requires HTTPS** in production (or localhost in dev)
- **Permissions:** Allow microphone access

---

## 📚 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | Prisma + SQLite |
| **Auth** | NextAuth.js (Credentials) |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui (Radix UI) |
| **Forms** | react-hook-form + Zod |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Date Utils** | date-fns |
| **Password Hashing** | bcrypt |

---

## 🔐 Security Notes

### Development

- Default `NEXTAUTH_SECRET` is insecure - **change in production**
- SQLite is file-based - **use PostgreSQL in production**
- Uploads stored locally - **use S3/CloudFlare R2 in production**

### Production Recommendations

1. **Environment Variables**
   - Use secure secret management (Vercel Secrets, AWS Secrets Manager)
   - Rotate `NEXTAUTH_SECRET` regularly

2. **Database**
   - Migrate to PostgreSQL with connection pooling
   - Enable SSL/TLS connections
   - Regular backups

3. **File Storage**
   - Use S3/R2 with signed URLs
   - Implement virus scanning
   - Set proper CORS policies

4. **API Security**
   - Add rate limiting (Upstash, Redis)
   - Implement CSRF protection
   - Add security headers (Helmet.js)

5. **Authentication**
   - Add 2FA/MFA
   - Implement password reset flow
   - Add session timeout

---

## 🤝 Contributing

This is a demo project for hackathon/showcase purposes. For production use:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Centrifuge** - Real-world asset tokenization protocol
- **Aave** - DeFi lending protocol inspiration
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Next.js framework and hosting

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review [Known Limitations](#-known-limitations-demo-mode)
3. Open an issue on GitHub

---

## 🎉 Demo Credentials

If you ran `pnpm prisma:seed`:

```
Email: demo@democorp.com
Password: demo1234
```

---

**Built with ⚡ by the Energetic Goose Team**

_Accelerate your cash flow with blockchain-powered invoice financing._
