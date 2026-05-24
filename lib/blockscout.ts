import type {
  BlockscoutAddressInfo,
  BlockscoutTransaction,
  BlockscoutTokenBalance,
  BlockscoutNFT,
} from "@/types/wallet";

const BASE_URL = "https://eth.blockscout.com/api/v2";
const HEADERS = {
  "User-Agent": "ChainPulse/1.0",
  Accept: "application/json",
};

async function fetchBlockscout<T>(endpoint: string): Promise<T | null> {
  try {
    const apiKey = process.env.BLOCKSCOUT_API_KEY;
    const url = `${BASE_URL}${endpoint}${apiKey ? `?apikey=${apiKey}` : ""}`;
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getAddressInfo(address: string): Promise<BlockscoutAddressInfo | null> {
  return fetchBlockscout<BlockscoutAddressInfo>(`/addresses/${address}`);
}

export async function getTransactions(
  address: string,
  limit = 50
): Promise<BlockscoutTransaction[]> {
  const data = await fetchBlockscout<{ items: BlockscoutTransaction[] }>(
    `/addresses/${address}/transactions?limit=${limit}`
  );
  return data?.items ?? [];
}

export async function getTokenBalances(address: string): Promise<BlockscoutTokenBalance[]> {
  const data = await fetchBlockscout<BlockscoutTokenBalance[]>(
    `/addresses/${address}/token-balances`
  );
  return data ?? [];
}

export async function getNFTs(address: string): Promise<BlockscoutNFT[]> {
  const data = await fetchBlockscout<{ items: BlockscoutNFT[] }>(
    `/addresses/${address}/nft?limit=20`
  );
  return data?.items ?? [];
}

// Known protocol contract addresses
const KNOWN_PROTOCOLS: Record<string, string> = {
  "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2",
  "0xe592427a0aece92de3edee1f18e0157c05861564": "Uniswap V3",
  "0xdef1c0ded9bec7f1a1670819833240f027b25eff": "0x Exchange",
  "0x1111111254fb6c44bac0bed2854e76f90643097d": "1inch",
  "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch v5",
  "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9": "Aave V2",
  "0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2": "Aave V3",
  "0x3dfd3c6866e9c64a2524ff542596888a21ca82bd": "Compound",
  "0xc3d688b66703497daa19211eedff47f25384cdc3": "Compound V3",
  "0x00000000006c3852cbef3e08e8df289169ede581": "Seaport (OpenSea)",
  "0x0000000000000068f116a894984e2db1123eb395": "Seaport v1.6",
  "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45": "Uniswap Router",
  "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f": "Uniswap V2 Factory",
  "0x1f98431c8ad98523631ae4a59f267346ea31f984": "Uniswap V3 Factory",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "Tether USDT",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USD Coin",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "Wrapped ETH",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "Wrapped BTC",
};

export function detectProtocol(tx: BlockscoutTransaction): string | null {
  const toAddr = tx.to?.hash?.toLowerCase();
  if (toAddr && KNOWN_PROTOCOLS[toAddr]) {
    return KNOWN_PROTOCOLS[toAddr];
  }

  // Check method signatures
  const method = tx.method?.toLowerCase();
  if (!method) return null;

  if (method.includes("swap")) return "DEX";
  if (method.includes("deposit") || method.includes("withdraw")) return "DeFi";
  if (method.includes("vote") || method.includes("delegate")) return "Governance";
  if (method.includes("mint") && tx.token_transfers?.length) return "NFT";
  if (method.includes("transfer")) return "Transfer";

  return null;
}
