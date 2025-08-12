# Legally Legit AI - Next.js Application Structure

## Root Directory Structure

```
legally-legit-ai-2/
├── app/                          # Next.js 14+ App Router
│   ├── (auth)/                   # Auth group route
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (guest)/                  # Guest/public routes
│   │   ├── quiz/                 # Guest quiz access
│   │   │   ├── page.tsx
│   │   │   └── [step]/
│   │   │       └── page.tsx
│   │   ├── results/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── business/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx
│   │   │   ├── templates/
│   │   │   │   └── page.tsx
│   │   │   ├── generate/
│   │   │   │   └── [templateId]/
│   │   │   │       └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── obligations/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── subscription/
│   │   │   ├── page.tsx
│   │   │   └── upgrade/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── billing/
│   │   │   │   └── page.tsx
│   │   │   └── notifications/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── signout/
│   │   │       └── route.ts
│   │   ├── stripe/
│   │   │   ├── webhook/
│   │   │   │   └── route.ts
│   │   │   ├── checkout/
│   │   │   │   └── route.ts
│   │   │   └── portal/
│   │   │       └── route.ts
│   │   ├── documents/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── download/
│   │   │       └── route.ts
│   │   ├── quiz/
│   │   │   ├── submit/
│   │   │   │   └── route.ts
│   │   │   └── calculate-score/
│   │   │       └── route.ts
│   │   └── email/
│   │       └── sequence/
│   │           └── route.ts
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css              # Global styles
│   └── fonts/                    # Local fonts (if any)
│
├── components/                   # Reusable React components
│   ├── ui/                      # UI primitives (buttons, cards, etc.)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── skeleton.tsx
│   │   └── tabs.tsx
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── breadcrumb.tsx
│   │
│   ├── quiz/                    # Quiz-specific components
│   │   ├── quiz-progress.tsx
│   │   ├── quiz-question.tsx
│   │   ├── quiz-navigation.tsx
│   │   ├── quiz-results.tsx
│   │   └── risk-score-display.tsx
│   │
│   ├── documents/               # Document-related components
│   │   ├── document-card.tsx
│   │   ├── document-list.tsx
│   │   ├── document-preview.tsx
│   │   ├── document-wizard.tsx
│   │   └── watermark-overlay.tsx
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── stats-card.tsx
│   │   ├── risk-meter.tsx
│   │   ├── obligations-list.tsx
│   │   ├── recent-documents.tsx
│   │   └── compliance-chart.tsx
│   │
│   ├── subscription/            # Subscription components
│   │   ├── pricing-card.tsx
│   │   ├── pricing-table.tsx
│   │   ├── usage-meter.tsx
│   │   └── upgrade-prompt.tsx
│   │
│   ├── auth/                    # Authentication components
│   │   ├── auth-form.tsx
│   │   ├── social-login.tsx
│   │   └── protected-route.tsx
│   │
│   └── shared/                  # Shared/common components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── empty-state.tsx
│       └── confirmation-dialog.tsx
│
├── lib/                         # Core libraries and utilities
│   ├── supabase/
│   │   ├── client.ts           # Supabase client instance
│   │   ├── server.ts           # Server-side Supabase client
│   │   ├── middleware.ts       # Supabase middleware
│   │   └── auth-helpers.ts    # Auth utility functions
│   │
│   ├── stripe/
│   │   ├── client.ts           # Stripe client config
│   │   ├── products.ts         # Product/price definitions
│   │   └── webhooks.ts        # Webhook handlers
│   │
│   ├── pdf/
│   │   ├── generator.ts        # PDF generation logic
│   │   ├── templates.ts        # PDF templates
│   │   └── watermark.ts        # Watermarking logic
│   │
│   ├── email/
│   │   ├── resend.ts           # Resend client
│   │   ├── templates.ts        # Email templates
│   │   └── sequences.ts        # Email sequence logic
│   │
│   ├── constants/
│   │   ├── quiz.ts             # Quiz questions/config
│   │   ├── documents.ts        # Document types/templates
│   │   ├── compliance.ts       # Compliance categories
│   │   └── subscriptions.ts    # Subscription tiers
│   │
│   ├── utils/
│   │   ├── format.ts           # Formatting utilities
│   │   ├── validation.ts       # Form validation
│   │   ├── risk-calculator.ts  # Risk score calculation
│   │   └── dates.ts            # Date utilities
│   │
│   └── hooks/                  # Custom React hooks
│       ├── use-user.ts
│       ├── use-subscription.ts
│       ├── use-business.ts
│       ├── use-documents.ts
│       └── use-toast.ts
│
├── types/                       # TypeScript type definitions
│   ├── database.ts             # Database schema types
│   ├── supabase.ts             # Supabase generated types
│   ├── stripe.ts               # Stripe-related types
│   ├── quiz.ts                 # Quiz types
│   ├── documents.ts            # Document types
│   └── api.ts                  # API response types
│
├── styles/                      # Additional styles
│   └── tailwind/
│       └── plugins/            # Custom Tailwind plugins
│
├── public/                      # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-image.png
│   │   └── icons/
│   ├── documents/
│   │   └── samples/            # Sample document previews
│   └── fonts/                  # Web fonts
│
├── supabase/                    # Supabase configuration
│   ├── migrations/             # Database migrations
│   │   └── 001_initial_schema.sql
│   ├── functions/              # Edge Functions
│   │   ├── generate-pdf/
│   │   │   └── index.ts
│   │   ├── process-quiz/
│   │   │   └── index.ts
│   │   ├── send-email/
│   │   │   └── index.ts
│   │   └── stripe-webhook/
│   │       └── index.ts
│   ├── seed.sql               # Seed data
│   └── config.toml            # Supabase config
│
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                   # Local environment variables
├── .env.example                 # Example environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── middleware.ts               # Next.js middleware
└── README.md                   # Project documentation
```

## Key Architectural Decisions

### 1. Route Groups
- `(auth)` - Authentication pages with minimal layout
- `(guest)` - Public-facing quiz and results
- `(dashboard)` - Protected routes requiring authentication

### 2. Component Organization
- `ui/` - Atomic, reusable UI components
- Feature-specific folders for domain logic
- `shared/` for cross-cutting concerns

### 3. Data Flow
- Server Components for initial data fetching
- Client Components for interactivity
- Supabase Realtime for live updates
- React Query/SWR for client-side caching

### 4. State Management
- Zustand for global client state
- React Context for auth/user state
- Local state for component-specific data

### 5. Security Layers
- Middleware for route protection
- Row Level Security in Supabase
- API route validation
- Secure cookie handling
