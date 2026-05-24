# ⚡ ChainPulse — Your Wallet Tells a Story

Analyze any Ethereum wallet instantly. Get a **Wallet Persona**, **On-Chain Resume**, and **Reputation Score** powered by AI.

🔗 **Live:** [chainpulse-one.vercel.app](https://chainpulse-one.vercel.app)

---

## ✨ Features

- **Wallet Persona** — Classify wallets into archetypes: DeFi Degen, Diamond Hands, NFT Collector, Whale Watcher, DAO Governor, Yield Farmer, Crypto Curious, On-Chain Native
- **Reputation Score** — 0-100 score with breakdown: Consistency, Diversity, Hold Duration, Governance
- **On-Chain Resume** — Stats grid with ETH balance, tx count, DeFi protocols, NFTs, active months
- **AI Narrative** — AI-generated wallet story (configurable provider)
- **Activity Timeline** — Recent transactions with protocol detection (Uniswap, Aave, Compound, OpenSea, 1inch, etc.)
- **Share Profile** — Copy link or native share

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS + Radix UI
- **Data:** Blockscout API (free, no credit card)
- **AI:** OpenAI-compatible (MiMo V2.5 Pro, Groq, OpenAI, etc.)
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

# Configure (optional)
cp .env.example .env.local
# Edit .env.local with your keys

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BLOCKSCOUT_API_KEY` | No | Blockscout API key (works without it) |
| `AI_BASE_URL` | No | AI provider URL (default: MiMo V2.5 Pro) |
| `AI_API_KEY` | No | AI provider API key |
| `AI_MODEL` | No | Model name (default: mimo-v2.5-pro) |
| `AI_ENABLED` | No | Set to `false` to disable AI narratives |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase URL for caching |
| `SUPABASE_SERVICE_KEY` | No | Supabase service key |

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
│   ├── ai-narrative.ts             # AI narrative generation
│   ├── supabase.ts                 # Supabase caching
│   └── utils.ts                    # Utilities
└── types/
    └── wallet.ts                   # TypeScript types
```

---

## 🧠 How It Works

1. **Fetch** — Pulls address info, transactions, token balances, and NFTs from Blockscout
2. **Analyze** — Calculates wallet age, active months, DeFi protocol usage, governance activity
3. **Classify** — Assigns a persona based on on-chain behavior patterns
4. **Score** — Computes reputation score (0-100) across 4 dimensions
5. **Narrate** — Generates an AI-powered wallet story
6. **Cache** — Stores results in Supabase for 24h (optional)

---

## 📄 License

MIT
