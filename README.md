# ⚡ ChainPulse — Your Wallet Tells a Story

Analyze any Ethereum wallet instantly. Get a **Wallet Persona**, **On-Chain Resume**, and **Reputation Score** powered by **MiMo V2.5 Pro**.

🔗 **Live:** [chainpulse-one.vercel.app](https://chainpulse-one.vercel.app)

---

## ✨ Features

- **Wallet Persona** — Classify wallets into archetypes: DeFi Degen, Diamond Hands, NFT Collector, Whale Watcher, DAO Governor, Yield Farmer, Crypto Curious, On-Chain Native
- **Reputation Score** — 0-100 score with breakdown: Consistency, Diversity, Hold Duration, Governance
- **On-Chain Resume** — Stats grid with ETH balance, tx count, DeFi protocols, NFTs, active months
- **AI Narrative** — AI-generated wallet story powered by MiMo V2.5 Pro
- **Activity Timeline** — Recent transactions with protocol detection (Uniswap, Aave, Compound, OpenSea, 1inch, etc.)
- **Share Profile** — Copy link or native share

---

## 🧠 AI Engine

ChainPulse uses **MiMo V2.5 Pro** as its default AI engine for wallet narrative generation. MiMo analyzes on-chain behavior patterns and writes insightful, human-readable wallet profiles.

> Want to use a different LLM? ChainPulse supports any **OpenAI-compatible API**. Just change the `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` in your environment variables.

```bash
# Default (MiMo V2.5 Pro)
AI_BASE_URL=https://api.mimo.com/v1
AI_API_KEY=your_mimo_key
AI_MODEL=mimo-v2.5-pro

# Or use Groq
AI_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=your_groq_key
AI_MODEL=llama-3.3-70b-versatile

# Or use OpenAI
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your_openai_key
AI_MODEL=gpt-4o-mini
```

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS + Radix UI
- **Data:** Blockscout API (free, no credit card)
- **AI:** MiMo V2.5 Pro (OpenAI-compatible, swap to any provider)
- **Cache:** Supabase (optional)
- **Deploy:** Vercel

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/nasrulniroi/chainpulse.git
cd chainpulse

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your MiMo API key (or other LLM provider)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AI_BASE_URL` | No | `https://api.mimo.com/v1` | AI provider URL |
| `AI_API_KEY` | No | — | Your MiMo API key (or any OpenAI-compatible key) |
| `AI_MODEL` | No | `mimo-v2.5-pro` | Model name |
| `AI_ENABLED` | No | `true` | Set to `false` to disable AI narratives |
| `BLOCKSCOUT_API_KEY` | No | — | Blockscout API key (works without it) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | — | Supabase URL for caching |
| `SUPABASE_SERVICE_KEY` | No | — | Supabase service key |

---

## 📁 Project Structure

```
chainpulse/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── profile/[address]/page.tsx  # Wallet profile page
│   └── api/
│       ├── analyze/route.ts        # Wallet analysis API
│       └── settings/route.ts       # Config status API
├── components/
│   ├── profile/                    # Profile page components
│   │   ├── PersonaCard.tsx
│   │   ├── ReputationScore.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── TraitsBar.tsx
│   │   ├── NarrativeCard.tsx
│   │   ├── ActivityTimeline.tsx
│   │   └── ShareButton.tsx
│   └── ui/                         # Reusable UI components
├── lib/
│   ├── blockscout.ts               # Blockscout API client
│   ├── wallet-analyzer.ts          # Main analysis engine
│   ├── persona-classifier.ts       # Persona classification logic
│   ├── ai-narrative.ts             # AI narrative generation (MiMo)
│   ├── supabase.ts                 # Supabase caching
│   └── utils.ts                    # Utilities
└── types/
    └── wallet.ts                   # TypeScript types
```

---

## 🧩 How It Works

1. **Fetch** — Pulls address info, transactions, token balances, and NFTs from Blockscout
2. **Analyze** — Calculates wallet age, active months, DeFi protocol usage, governance activity
3. **Classify** — Assigns a persona based on on-chain behavior patterns
4. **Score** — Computes reputation score (0-100) across 4 dimensions
5. **Narrate** — MiMo V2.5 Pro generates an insightful wallet story
6. **Cache** — Stores results in Supabase for 24h (optional)

---

## 📄 License

MIT
