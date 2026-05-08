# ShopSmart (Anti_Retail)

An AI-powered, natural language shopping assistant featuring an "Industrial Utilitarian" brutalist frontend. ShopSmart parses user intents using Gemini 2.5 Flash, fetches live product data from Amazon (via Rainforest API), and actively scrapes real-time competitor pricing (Flipkart, Croma, Reliance) using SerpApi and Google Shopping.

## Key Features

- **Natural Language Parsing**: Just type "I need a 65 inch OLED TV under 1 lakh" and Gemini 2.5 Flash figures out the exact search terms and price caps.
- **Cross-Store Price Comparison**: An AI sub-routine dynamically extracts precise product models and searches Google Shopping to find cheaper deals on alternative stores.
- **Price History Graphs**: Visualizes mock/historical pricing trends utilizing `recharts`.
- **IP Rate Limiting**: Built-in Upstash Redis protection limits queries to prevent API abuse.
- **Industrial Design System**: Zero-fluff, border-heavy, high-density React UI designed for readability and functional scanning.

---

## Tech Stack

- **Framework**: Next.js 16.2+ (App Router)
- **Frontend**: React 19.2+
- **Styling**: Tailwind CSS v4
- **Language Models**: Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Rate Limiting**: Upstash Redis Serverless (`@upstash/redis`)
- **Data Visualizations**: Recharts
- **Live Search APIs**: Rainforest API (Amazon), SerpApi (Google Shopping)

---

## Prerequisites

- Node.js 20 or higher
- npm or pnpm
- Google Gemini API Key
- Upstash Redis REST URL & Token
- Rainforest API Key (For Amazon data)
- SerpApi Key (For Google Shopping competitor cross-matching)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BhaveshP888/ShopSmart.git
cd ShopSmart/web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root of the project:

```bash
touch .env.local
```

Configure the following variables:

| Variable                     | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `GEMINI_API_KEY`             | Google AI Studio key for intent parsing               |
| `UPSTASH_REDIS_REST_URL`     | Upstash Redis database URL                            |
| `UPSTASH_REDIS_REST_TOKEN`   | Upstash Redis access token                            |
| `RAINFOREST_API_KEY`         | Rainforest API key for querying live Amazon.in data   |
| `SERPAPI_KEY`                | SerpApi key for Google Shopping cross-store matching  |

*(Note: If `SERPAPI_KEY` is omitted, the app gracefully falls back to generating realistic mock competitors based on a +/- 10% price variance).*

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

---

## Architecture

### Directory Structure

```text
web/
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── layout.tsx       # Root HTML layout and fonts
│   │   ├── page.tsx         # Main entry point and Grid layout
│   │   └── actions.ts       # Server Actions (API logic, Redis, Gemini)
│   ├── components/          # Reusable UI Components
│   │   ├── CompareDealsModal.tsx
│   │   ├── LoadingState.tsx
│   │   ├── PriceHistoryModal.tsx
│   │   ├── ProductCard.tsx  # Industrial manifest card component
│   │   └── SearchBar.tsx
│   └── lib/
│       └── api.ts           # Rainforest API integration layer
├── public/                  # Static assets
├── package.json
└── tailwind.config.ts       # Tailwind v4 config
```

### Request Lifecycle

1. **User Input:** User enters natural language into `SearchBar.tsx`.
2. **Server Action Validation:** Request hits `processSearchQuery` in `actions.ts`. Upstash Redis checks IP-based rate limiting.
3. **Intent Parsing:** Gemini 2.5 Flash parses the query, returning structured JSON with optimized `keywords` and `maxPrice`.
4. **Primary Fetch:** `fetchAmazonProducts` pings the Rainforest API targeting `amazon.in` to retrieve live product listings.
5. **Render:** `page.tsx` renders `ProductCard` manifests in a responsive 4-column CSS grid.
6. **Cross-Store Lookup (On-Demand):** Clicking "Compare" passes the title back to `actions.ts`. Gemini extracts the precise Model Number and queries SerpApi to pull live competitor data.

---

## Environment Variables Reference

```env
# Google Gemini 
GEMINI_API_KEY=your_google_gemini_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# APIs
RAINFOREST_API_KEY=your_rainforest_api_key
SERPAPI_KEY=your_serpapi_key
```

---

## Available Scripts

| Command          | Description                                         |
| ---------------- | --------------------------------------------------- |
| `npm run dev`    | Starts the development server with Hot-Module Reloading |
| `npm run build`  | Compiles the application for production deployment  |
| `npm run start`  | Starts the compiled production application          |
| `npm run lint`   | Runs ESLint to identify code quality issues         |

---

## Deployment

The easiest way to deploy this Next.js application is via Vercel.

### Vercel Deployment

1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com).
3. Click **Add New Project** and select your `ShopSmart` repository.
4. Set the **Framework Preset** to `Next.js`.
5. Under **Environment Variables**, add all the required keys (`GEMINI_API_KEY`, `UPSTASH_REDIS_REST_URL`, etc.).
6. Click **Deploy**.

Because all API calls are routed through Next.js Server Actions (`use server`), your API keys will remain securely on the server and will not be leaked to the client bundle.

---

## Troubleshooting

### API Returns "SYSTEM_LOCKOUT"
**Solution:** You have exceeded the hardcoded 100 queries/day limit in `actions.ts`. Flush your Upstash Redis database or modify the rate-limit threshold in `src/app/actions.ts`.

### Cross-Store Compare Returns "NO_MATCHES_FOUND"
**Solution:** Ensure your `SERPAPI_KEY` is valid. If SerpApi runs out of credits, Google Shopping queries will fail. The system logs exact API errors directly to the terminal where `npm run dev` is running.

### Gemini Parsing Fails
**Solution:** Ensure you have access to `gemini-2.5-flash`. The system specifically requires `responseMimeType: "application/json"` support to correctly orchestrate the downstream e-commerce API requests.
